import { notifySmokeTestResult } from "./notify";
import { buildDmtSmokeTestPayload } from "./payload";

const endpoint =
  process.env.DMT_SMOKE_TEST_URL ?? "https://www.desarr.com/api/det-submit";

async function main() {
  const payload = buildDmtSmokeTestPayload();

  console.info(`[DMT Smoke Test] POST ${endpoint}`);
  console.info(`[DMT Smoke Test] Email: ${payload.lead.email}`);

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const body = await response.text();

    if (!response.ok) {
      console.error(
        `[DMT Smoke Test] Failed (${response.status}): ${body || "empty response"}`,
      );

      await notifySmokeTestResult("failure", payload, {
        endpoint,
        statusCode: response.status,
        responseBody: body || "empty response",
      });

      process.exit(1);
    }

    console.info("[DMT Smoke Test] Success:", body);

    await notifySmokeTestResult("success", payload, {
      endpoint,
      statusCode: response.status,
      responseBody: body,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);

    console.error("[DMT Smoke Test] Unexpected error:", message);

    await notifySmokeTestResult("failure", payload, {
      endpoint,
      error: message,
    });

    process.exit(1);
  }
}

main();
