import { NextResponse } from "next/server";
import { getPartnerById } from "@/lib/partners-data";
import { persistLead } from "@/lib/persist-lead";

interface PartnerContactPayload {
  partnerId: string;
  senderName: string;
  senderEmail: string;
  senderPhone: string;
  message: string;
}

function isValidPayload(body: unknown): body is PartnerContactPayload {
  if (!body || typeof body !== "object") return false;

  const payload = body as Partial<PartnerContactPayload>;

  return (
    typeof payload.partnerId === "string" &&
    payload.partnerId.trim().length > 0 &&
    typeof payload.senderName === "string" &&
    payload.senderName.trim().length > 0 &&
    typeof payload.senderEmail === "string" &&
    payload.senderEmail.trim().length > 0 &&
    typeof payload.message === "string" &&
    payload.message.trim().length > 0 &&
    typeof payload.senderPhone === "string"
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

    const partner = getPartnerById(body.partnerId);

    if (!partner) {
      return NextResponse.json(
        { success: false, error: "Partner no encontrado." },
        { status: 404 },
      );
    }

    const timestamp = new Date().toISOString();
    const sender = {
      name: body.senderName.trim(),
      email: body.senderEmail.trim(),
      phone: body.senderPhone.trim(),
      message: body.message.trim(),
    };

    const structuredPayload = {
      type: "partner-contact",
      timestamp,
      partner: {
        id: partner.id,
        name: partner.name,
        email: partner.partnerEmail,
        specialty: partner.specialty,
      },
      sender,
    };

    const result = await persistLead({
      source: "partner-contact",
      sheetRange:
        process.env.GOOGLE_SHEETS_PARTNERS_RANGE ?? "Contacto_para_Socios!A:I",
      row: [
        timestamp,
        partner.id,
        partner.name,
        partner.partnerEmail,
        partner.specialty,
        sender.name,
        sender.email,
        sender.phone,
        sender.message,
      ],
      summaryLines: [
        `Partner: ${partner.name} (${partner.partnerEmail})`,
        `Especialidad: ${partner.specialty}`,
        `De: ${sender.name} <${sender.email}>`,
        `Teléfono: ${sender.phone}`,
        `Mensaje: ${sender.message}`,
      ],
      payload: structuredPayload,
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: "Error al registrar la consulta." },
        { status: 502 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Partner Contact Exception]", error);
    return NextResponse.json(
      { success: false, error: "Error al procesar la solicitud." },
      { status: 500 },
    );
  }
}
