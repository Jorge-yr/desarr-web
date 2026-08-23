import { NextResponse } from "next/server";

interface DETAnswer {
  questionId: number;
  questionTitle: string;
  selectedLabel: string;
  score: number;
}

interface DETLead {
  fullName: string;
  company: string;
  email: string;
  phone: string;
  country: string;
  state: string;
  companyTypes: string[];
  otherCompanyType?: string;
}

interface DETPayload {
  lead: DETLead;
  score: number;
  maturityLevel: string;
  answers: DETAnswer[];
  wantsAdvisorContact?: boolean;
  confirmed?: boolean;
}

function isValidPayload(body: unknown): body is DETPayload {
  if (!body || typeof body !== "object") return false;

  const payload = body as Partial<DETPayload>;
  const lead = payload.lead;

  return (
    typeof payload.score === "number" &&
    typeof payload.maturityLevel === "string" &&
    Array.isArray(payload.answers) &&
    payload.answers.length === 7 &&
    !!lead &&
    typeof lead.fullName === "string" &&
    typeof lead.company === "string" &&
    typeof lead.email === "string" &&
    typeof lead.phone === "string" &&
    typeof lead.country === "string" &&
    typeof lead.state === "string" &&
    Array.isArray(lead.companyTypes)
  );
}

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();

    if (!isValidPayload(body)) {
      return NextResponse.json(
        { success: false, error: "Payload inválido." },
        { status: 400 }
      );
    }

    const webhookUrl = process.env.MAKE_WEBHOOK_URL;

    // Validación de la variable de entorno
    if (!webhookUrl) {
      console.error("[DET Submit Error] MAKE_WEBHOOK_URL no está definida.");
      return NextResponse.json(
        { success: false, error: "Servicio de recepción no configurado en el servidor." },
        { status: 500 }
      );
    }

    // Envío del payload hacia el webhook de Make
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      console.error(`[DET Submit Error] Make respondió con status: ${response.status}`);
      return NextResponse.json(
        { success: false, error: "Error al registrar en webhook." },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DET Submit Exception]", error);
    return NextResponse.json(
      { success: false, error: "Error al procesar la solicitud." },
      { status: 500 }
    );
  }
}