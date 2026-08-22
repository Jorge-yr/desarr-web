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
        { status: 400 },
      );
    }

    // Punto de extensión: persistir en CRM, email o base de datos.
    console.info("[DET Submit]", {
      score: body.score,
      maturityLevel: body.maturityLevel,
      lead: body.lead,
      answers: body.answers,
      wantsAdvisorContact: body.wantsAdvisorContact ?? null,
      confirmed: body.confirmed ?? false,
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { success: false, error: "Error al procesar la solicitud." },
      { status: 500 },
    );
  }
}
