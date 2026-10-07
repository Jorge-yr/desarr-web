import { NextResponse } from "next/server";
import { crearPreferencia, isMercadoPagoConfigured } from "@/lib/mercadopago";

type Body = {
  idClinica?: string;
  idProfesional?: string;
  profesional?: string;
  inicio?: string;
  dni?: string;
  nombre?: string;
  apellido?: string;
  whatsapp?: string;
  importe?: number;
};

export async function POST(request: Request) {
  if (!isMercadoPagoConfigured()) {
    return NextResponse.json({ error: "Mercado Pago no está configurado." }, { status: 503 });
  }

  const body = (await request.json()) as Body;
  const importe = Number(body.importe);
  const dni = String(body.dni ?? "").replace(/\D/g, "");
  if (!body.idClinica || !body.idProfesional || !body.inicio || dni.length < 7 || !Number.isFinite(importe) || importe <= 0) {
    return NextResponse.json({ error: "Faltan datos de la seña." }, { status: 400 });
  }

  const referencia = crypto.randomUUID();
  const origen = new URL(request.url).origin;
  const vuelta = new URL(`/c/${body.idClinica}/pago`, origen);
  vuelta.searchParams.set("ref", referencia);

  const initPoint = await crearPreferencia({
    titulo: `Seña de turno · ${body.profesional || "Profesional"}`,
    importe,
    externalReference: referencia,
    metadata: {
      id_clinica: body.idClinica,
      id_profesional: body.idProfesional,
      inicio: body.inicio,
      dni,
      nombre: body.nombre ?? "",
      apellido: body.apellido ?? "",
      whatsapp: body.whatsapp ?? "",
    },
    successUrl: `${vuelta.toString()}&resultado=aprobado`,
    failureUrl: `${vuelta.toString()}&resultado=rechazado`,
    pendingUrl: `${vuelta.toString()}&resultado=pendiente`,
    notificationUrl: `${origen}/api/mercadopago/webhook`,
  });

  return NextResponse.json({ initPoint });
}
