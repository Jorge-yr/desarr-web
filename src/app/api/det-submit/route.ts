import { NextResponse } from "next/server";
import { persistLead } from "@/lib/persist-lead";

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
        { status: 400 },
      );
    }

    const getAnswer = (id: number) =>
      body.answers.find((a) => a.questionId === id)?.selectedLabel || "";

    const solicitaAsesor = body.wantsAdvisorContact ? "SÍ" : "NO";
    const timestamp = new Date().toISOString();

    const structuredPayload = {
      type: "det",
      timestamp,
      lead: body.lead,
      diagnostic: {
        totalScore: body.score,
        maturityLevel: body.maturityLevel,
      },
      recommendations: body.recommendations ?? [],
      solicitaAsesor,
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

    const result = await persistLead({
      source: "det",
      sheetRange: process.env.GOOGLE_SHEETS_DET_RANGE ?? "DET!A:Z",
      row: [
        timestamp,
        body.lead.fullName,
        body.lead.company,
        body.lead.email,
        body.lead.phone,
        body.lead.country,
        body.lead.state,
        body.lead.companyTypes.join(", "),
        String(body.score),
        body.maturityLevel,
        solicitaAsesor,
        getAnswer(1),
        getAnswer(2),
        getAnswer(3),
        getAnswer(4),
        getAnswer(5),
        getAnswer(6),
        getAnswer(7),
        (body.recommendations ?? []).join(" | "),
      ],
      summaryLines: [
        `Nombre: ${body.lead.fullName}`,
        `Empresa: ${body.lead.company}`,
        `Email: ${body.lead.email}`,
        `Teléfono: ${body.lead.phone}`,
        `Score: ${body.score}`,
        `Nivel: ${body.maturityLevel}`,
        `Solicita asesor: ${solicitaAsesor}`,
      ],
      payload: structuredPayload,
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: "Error al registrar el diagnóstico." },
        { status: 502 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DET Submit Exception]", error);
    return NextResponse.json(
      { success: false, error: "Error al procesar la solicitud." },
      { status: 500 },
    );
  }
}
