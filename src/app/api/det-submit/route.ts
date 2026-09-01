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
  recommendations?: string[];
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

    if (!webhookUrl) {
      console.error("[DET Submit Error] MAKE_WEBHOOK_URL no está definida.");
      return NextResponse.json(
        { success: false, error: "Servicio de recepción no configurado en el servidor." },
        { status: 500 }
      );
    }

    // Extracción de cada respuesta por su ID fijo (1 al 7)
    const getAnswer = (id: number) =>
      body.answers.find((a) => a.questionId === id)?.selectedLabel || "";

    // Evaluación del checkbox final
    const solicitaAsesor = body.wantsAdvisorContact ? "SÍ" : "NO";

    const structuredPayload = {
      timestamp: new Date().toISOString(),
      lead: body.lead,
      diagnostic: {
        totalScore: body.score,
        maturityLevel: body.maturityLevel,
      },
      recommendations: body.recommendations ?? [],
      solicitaAsesor: solicitaAsesor,
      answersFlat: {
        q1_registros: getAnswer(1),
        q2_centralizacion: getAnswer(2),
        q3_automatizacion: getAnswer(3),
        q4_clientes: getAnswer(4),
        q5_reportes: getAnswer(5),
        q6_integracion: getAnswer(6),
        q7_escalamiento: getAnswer(7),
      },
      answersRaw: body.answers,
    };

    // Envío hacia el webhook de Make
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(structuredPayload),
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
