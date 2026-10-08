import { NextResponse } from "next/server";
import QRCode from "qrcode";
import { tokenDeClinica } from "@/lib/cobro";
import { crearPreferencia } from "@/lib/mercadopago";

type Body = {
  idClinica?: string;
  idProfesional?: string;
  profesional?: string;
  clinica?: string;
  duracionMin?: number;
  inicio?: string;
  dni?: string;
  nombre?: string;
  apellido?: string;
  whatsapp?: string;
  idTurno?: string;
  importe?: number;
};

export async function POST(request: Request) {
  const body = (await request.json()) as Body;
  const importe = Number(body.importe);
  const dni = String(body.dni ?? "").replace(/\D/g, "");
  if (!body.idClinica || !body.idProfesional || !body.inicio || !body.idTurno || dni.length < 7 || !Number.isFinite(importe) || importe <= 0) {
    return NextResponse.json({ error: "Faltan datos de la seña." }, { status: 400 });
  }

  const accessToken = await tokenDeClinica(body.idClinica);
  if (!accessToken) {
    return NextResponse.json({ error: "Esta clínica todavía no conectó Mercado Pago." }, { status: 503 });
  }

  const referencia = crypto.randomUUID();
  const origen = new URL(request.url).origin;
  const vuelta = new URL(`/c/${body.idClinica}/pago`, origen);
  vuelta.searchParams.set("ref", referencia);
  vuelta.searchParams.set("inicio", body.inicio);
  vuelta.searchParams.set("min", String(Number(body.duracionMin) > 0 ? Number(body.duracionMin) : 30));
  if (body.profesional) vuelta.searchParams.set("pro", body.profesional);
  if (body.clinica) vuelta.searchParams.set("cli", body.clinica);

  const initPoint = await crearPreferencia({
    accessToken,
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
      id_turno: body.idTurno,
    },
    successUrl: `${vuelta.toString()}&resultado=aprobado`,
    failureUrl: `${vuelta.toString()}&resultado=rechazado`,
    pendingUrl: `${vuelta.toString()}&resultado=pendiente`,
    notificationUrl: `${origen}/api/mercadopago/webhook`,
  });

  const qr = await QRCode.toDataURL(initPoint, { margin: 1, width: 280 });
  return NextResponse.json({ initPoint, qr });
}
