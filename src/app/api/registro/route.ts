import { NextResponse } from "next/server";

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

    console.info("[Registro]", body);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { success: false, error: "Error al procesar la solicitud." },
      { status: 500 },
    );
  }
}
