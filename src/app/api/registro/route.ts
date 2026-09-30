import { NextResponse } from "next/server";
import { persistLead } from "@/lib/persist-lead";

interface RegistroPayload {
  fullName: string;
  email: string;
  whatsapp: string;
  phoneCountryCode?: string;
  phoneNumber?: string;
  company: string;
  contactTimeRange: string;
  contactHourStart: number;
  contactHourEnd: number;
}

function isValidPayload(body: unknown): body is RegistroPayload {
  if (!body || typeof body !== "object") return false;

  const payload = body as Partial<RegistroPayload>;

  return (
    typeof payload.fullName === "string" &&
    payload.fullName.trim().length > 0 &&
    typeof payload.email === "string" &&
    payload.email.trim().length > 0 &&
    typeof payload.whatsapp === "string" &&
    payload.whatsapp.trim().length > 0 &&
    typeof payload.company === "string" &&
    payload.company.trim().length > 0 &&
    typeof payload.contactTimeRange === "string" &&
    typeof payload.contactHourStart === "number" &&
    typeof payload.contactHourEnd === "number" &&
    payload.contactHourEnd >= payload.contactHourStart
  );
}

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();

    if (!isValidPayload(body)) {
      return NextResponse.json(
        { success: false, error: "Payload inválido." },
        { status: 400 },
      );
    }

    const timestamp = new Date().toISOString();
    const lead = {
      fullName: body.fullName.trim(),
      email: body.email.trim(),
      whatsapp: body.whatsapp.trim(),
      phoneCountryCode: body.phoneCountryCode?.trim() ?? "",
      phoneNumber: body.phoneNumber?.trim() ?? "",
      company: body.company.trim(),
      contactTimeRange: body.contactTimeRange,
      contactHourStart: body.contactHourStart,
      contactHourEnd: body.contactHourEnd,
    };

    const structuredPayload = {
      type: "registro",
      timestamp,
      lead,
    };

    const result = await persistLead({
      source: "registro",
      sheetRange: process.env.GOOGLE_SHEETS_REGISTRO_RANGE ?? "Registros!A:J",
      row: [
        timestamp,
        lead.fullName,
        lead.email,
        lead.whatsapp,
        lead.company,
        lead.contactTimeRange,
        String(lead.contactHourStart),
        String(lead.contactHourEnd),
        lead.phoneCountryCode,
        lead.phoneNumber,
      ],
      summaryLines: [
        `Nombre: ${lead.fullName}`,
        `Email: ${lead.email}`,
        `Empresa: ${lead.company}`,
        `WhatsApp: ${lead.whatsapp}`,
        `Horario: ${lead.contactTimeRange}`,
      ],
      payload: structuredPayload,
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: "Error al registrar la solicitud." },
        { status: 502 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Registro Exception]", error);
    return NextResponse.json(
      { success: false, error: "Error al procesar la solicitud." },
      { status: 500 },
    );
  }
}
