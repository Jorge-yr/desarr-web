import {
  isAdminNotifyConfigured,
  notifyAdmin,
} from "../../src/lib/admin-notify";
import type { buildDmtSmokeTestPayload } from "./payload";

type SmokeTestPayload = ReturnType<typeof buildDmtSmokeTestPayload>;

type SmokeTestResultDetails = {
  endpoint: string;
  statusCode?: number;
  responseBody?: string;
  error?: string;
};

export async function notifySmokeTestResult(
  status: "success" | "failure",
  payload: SmokeTestPayload,
  details: SmokeTestResultDetails,
): Promise<void> {
  if (!isAdminNotifyConfigured()) {
    console.warn(
      "[DMT Smoke Test] Email omitido: faltan RESEND_API_KEY o ADMIN_NOTIFY_EMAIL.",
    );
    return;
  }

  const runLabel = payload.lead.fullName;
  const subject =
    status === "success"
      ? `[Desarr] DMT smoke test OK — ${runLabel}`
      : `[Desarr] DMT smoke test FALLÓ — ${runLabel}`;

  const lines = [
    status === "success"
      ? "La prueba automática del Diagnóstico de Madurez Tecnológica finalizó correctamente."
      : "La prueba automática del DMT falló. Revisá el sitio, la API o Google Sheets.",
    "",
    `Endpoint: ${details.endpoint}`,
    `Lead de prueba: ${payload.lead.email}`,
    `Nombre: ${payload.lead.fullName}`,
    `Empresa: ${payload.lead.company}`,
    `Score: ${payload.score} (${payload.maturityLevel})`,
  ];

  if (details.statusCode !== undefined) {
    lines.push("", `HTTP status: ${details.statusCode}`);
  }

  if (details.responseBody) {
    lines.push("", "Respuesta del servidor:", details.responseBody);
  }

  if (details.error) {
    lines.push("", "Error:", details.error);
  }

  await notifyAdmin({ subject, text: lines.join("\n") });
}
