type NotifyAdminInput = {
  subject: string;
  text: string;
};

export function isAdminNotifyConfigured(): boolean {
  return Boolean(
    process.env.RESEND_API_KEY?.trim() && process.env.ADMIN_NOTIFY_EMAIL?.trim(),
  );
}

export async function notifyAdmin({
  subject,
  text,
}: NotifyAdminInput): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const to = process.env.ADMIN_NOTIFY_EMAIL?.trim();

  if (!apiKey || !to) {
    console.error("[Admin Notify] Missing RESEND_API_KEY or ADMIN_NOTIFY_EMAIL.");
    console.error(subject, text);
    return;
  }

  const from =
    process.env.RESEND_FROM?.trim() ??
    "Desarr Soluciones <onboarding@resend.dev>";

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject,
      text,
    }),
  });

  if (!response.ok) {
    const details = await response.text();
    console.error(
      `[Admin Notify] Resend error (${response.status}): ${details}`,
    );
  }
}
