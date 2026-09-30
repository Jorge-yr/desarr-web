import { createSign } from "crypto";

const SHEETS_SCOPE = "https://www.googleapis.com/auth/spreadsheets";
const TOKEN_URL = "https://oauth2.googleapis.com/token";

function base64UrlEncode(value: string | Buffer): string {
  const buffer = typeof value === "string" ? Buffer.from(value) : value;
  return buffer
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function getServiceAccountCredentials():
  | { clientEmail: string; privateKey: string; spreadsheetId: string }
  | null {
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL?.trim();
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n").trim();
  const spreadsheetId = process.env.GOOGLE_SHEETS_ID?.trim();

  if (!clientEmail || !privateKey || !spreadsheetId) return null;

  return { clientEmail, privateKey, spreadsheetId };
}

export function isGoogleSheetsConfigured(): boolean {
  return getServiceAccountCredentials() !== null;
}

async function getGoogleAccessToken(
  clientEmail: string,
  privateKey: string,
): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const header = base64UrlEncode(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claimSet = base64UrlEncode(
    JSON.stringify({
      iss: clientEmail,
      scope: SHEETS_SCOPE,
      aud: TOKEN_URL,
      exp: now + 3600,
      iat: now,
    }),
  );

  const unsignedToken = `${header}.${claimSet}`;
  const signature = createSign("RSA-SHA256")
    .update(unsignedToken)
    .sign(privateKey);
  const jwt = `${unsignedToken}.${base64UrlEncode(signature)}`;

  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Google token error (${response.status}): ${details}`);
  }

  const data = (await response.json()) as { access_token?: string };
  if (!data.access_token) {
    throw new Error("Google token response did not include access_token.");
  }

  return data.access_token;
}

export async function appendSheetRow(
  range: string,
  values: string[],
): Promise<void> {
  const credentials = getServiceAccountCredentials();
  if (!credentials) {
    throw new Error("Google Sheets is not configured.");
  }

  const accessToken = await getGoogleAccessToken(
    credentials.clientEmail,
    credentials.privateKey,
  );

  const url = new URL(
    `https://sheets.googleapis.com/v4/spreadsheets/${credentials.spreadsheetId}/values/${encodeURIComponent(range)}:append`,
  );
  url.searchParams.set("valueInputOption", "USER_ENTERED");
  url.searchParams.set("insertDataOption", "INSERT_ROWS");

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ values: [values] }),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Google Sheets append failed (${response.status}): ${details}`);
  }
}
