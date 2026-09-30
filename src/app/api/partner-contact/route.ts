import { NextResponse } from "next/server";
import { getPartnerById } from "@/lib/partners-data";

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

    const structuredPayload = {
      type: "partner-contact",
      timestamp: new Date().toISOString(),
      partner: {
        id: partner.id,
        name: partner.name,
        email: partner.partnerEmail,
        specialty: partner.specialty,
      },
      sender: {
        name: body.senderName.trim(),
        email: body.senderEmail.trim(),
        phone: body.senderPhone.trim(),
        message: body.message.trim(),
      },
    };

    const webhookUrl = process.env.MAKE_WEBHOOK_URL;

    if (webhookUrl) {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(structuredPayload),
      });

      if (!response.ok) {
        console.error(
          `[Partner Contact Error] Webhook respondió con status: ${response.status}`,
        );
        return NextResponse.json(
          { success: false, error: "Error al registrar la consulta." },
          { status: 502 },
        );
      }
    } else {
      console.info("[Partner Contact]", structuredPayload);
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
