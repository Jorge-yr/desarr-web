import { notifyAdmin } from "@/lib/admin-notify";
import { appendSheetRow, isGoogleSheetsConfigured } from "@/lib/google-sheets";

type PersistLeadInput = {
  source: "registro" | "det" | "partner-contact";
  sheetRange: string;
  row: string[];
  summaryLines: string[];
  payload: unknown;
};

async function tryMakeWebhook(
  webhookUrl: string,
  payload: unknown,
): Promise<void> {
  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Make webhook responded with status ${response.status}`);
  }
}

export async function persistLead({
  source,
  sheetRange,
  row,
  summaryLines,
  payload,
}: PersistLeadInput): Promise<{ success: true } | { success: false; error: string }> {
  const errors: string[] = [];
  let stored = false;

  if (isGoogleSheetsConfigured()) {
    try {
      await appendSheetRow(sheetRange, row);
      stored = true;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown Google Sheets error.";
      errors.push(message);
      console.error(`[${source}] Google Sheets error:`, message);

      await notifyAdmin({
        subject: `[Desarr] Falló guardar lead (${source}) en Google Sheets`,
        text: [
          "Se intentó registrar un lead pero Google Sheets falló.",
          "",
          ...summaryLines,
          "",
          "Error:",
          message,
          "",
          "Payload:",
          JSON.stringify(payload, null, 2),
        ].join("\n"),
      });
    }
  }

  const webhookUrl =
    source === "registro"
      ? process.env.MAKE_REGISTRO_WEBHOOK_URL ?? process.env.MAKE_WEBHOOK_URL
      : process.env.MAKE_WEBHOOK_URL;

  if (webhookUrl) {
    try {
      await tryMakeWebhook(webhookUrl, payload);
      stored = true;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown Make webhook error.";
      errors.push(message);
      console.error(`[${source}] Make webhook error:`, message);

      await notifyAdmin({
        subject: `[Desarr] Falló envío a Make (${source})`,
        text: [
          "Make no recibió el lead. Revisá si el escenario está activo.",
          "",
          ...summaryLines,
          "",
          "Error:",
          message,
        ].join("\n"),
      });
    }
  }

  if (!stored) {
    if (!isGoogleSheetsConfigured() && !webhookUrl) {
      console.info(`[${source}]`, payload);
      errors.push("No hay Google Sheets ni webhook configurados.");
    }

    await notifyAdmin({
      subject: `[Desarr] Lead NO guardado (${source})`,
      text: [
        "Ningún destino de almacenamiento funcionó o está configurado.",
        "",
        ...summaryLines,
        "",
        "Errores:",
        errors.join("\n") || "Sin detalle adicional.",
        "",
        "Payload:",
        JSON.stringify(payload, null, 2),
      ].join("\n"),
    });

    return {
      success: false,
      error: errors[0] ?? "No se pudo guardar el lead.",
    };
  }

  return { success: true };
}
