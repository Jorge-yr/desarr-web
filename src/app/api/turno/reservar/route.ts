import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import { fechaDeRegistro } from "@/lib/turno/ahora";
import { seSolapa } from "@/lib/turno/huecos";
import { filasAOcupados } from "@/lib/turno/ocupados";

type Body = {
  idClinica?: string;
  idProfesional?: string;
  inicio?: string;
  duracionMin?: number;
  dni?: string;
  nombre?: string;
  apellido?: string;
  whatsapp?: string;
  nacimiento?: string;
};

function enArgentina(iso: string) {
  const fecha = new Date(iso).toLocaleDateString("en-CA", { timeZone: "America/Argentina/Buenos_Aires" });
  const hora = new Date(iso).toLocaleTimeString("en-GB", {
    timeZone: "America/Argentina/Buenos_Aires",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  return { fecha, hora, marca: `${fecha} ${hora}:00` };
}

function horaAMinutos(hora: string) {
  const [h, m] = hora.split(":").map(Number);
  return h * 60 + (m || 0);
}

export async function POST(request: Request) {
  const supabase = createServiceClient();
  if (!supabase) {
    return NextResponse.json({ error: "No se puede guardar el turno." }, { status: 503 });
  }

  const body = (await request.json()) as Body;
  const dni = String(body.dni ?? "").replace(/\D/g, "");
  const duracion = Number(body.duracionMin) > 0 ? Number(body.duracionMin) : 30;
  if (!body.idClinica || !body.idProfesional || !body.inicio || dni.length < 7) {
    return NextResponse.json({ error: "Faltan datos del turno." }, { status: 400 });
  }

  const { data: existente } = await supabase
    .from("pacientes")
    .select("id_paciente, nombre, apellido")
    .eq("id_clinica", body.idClinica)
    .eq("dni", dni)
    .maybeSingle();

  let idPaciente = existente?.id_paciente as string | undefined;
  if (!idPaciente) {
    const nacimiento = String(body.nacimiento ?? "").slice(0, 10);
    const fechaOk =
      /^\d{4}-\d{2}-\d{2}$/.test(nacimiento) &&
      !Number.isNaN(new Date(`${nacimiento}T00:00:00`).getTime()) &&
      nacimiento <= enArgentina(new Date().toISOString()).fecha;
    if (!body.nombre?.trim() || !body.apellido?.trim() || !fechaOk) {
      return NextResponse.json({ needsData: true });
    }
    idPaciente = crypto.randomUUID();
    const { error } = await supabase.from("pacientes").insert({
      id_paciente: idPaciente,
      dni,
      nombre: body.nombre.trim(),
      apellido: body.apellido.trim(),
      fecha_nacimiento: nacimiento,
      nacimiento: Number(nacimiento.slice(0, 4)),
      telefono_paciente: body.whatsapp?.trim() || null,
      id_clinica: body.idClinica,
      fecha_alta: enArgentina(new Date().toISOString()).fecha,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  }

  const cuando = enArgentina(body.inicio);
  const { data: tomados, error: errorTomados } = await supabase
    .from("historial_turnos")
    .select("estado_turno, duracion_turno, fecha_turno, hora_turno, fecha_hora_turno, finaliza_turno")
    .eq("id_profesional", body.idProfesional);
  if (errorTomados) return NextResponse.json({ error: "No se pudo verificar si el horario está libre." }, { status: 400 });
  const pedido = horaAMinutos(cuando.hora);
  const ocupados = filasAOcupados(tomados ?? [], duracion, 60);
  if (seSolapa(cuando.fecha, pedido, pedido + duracion, ocupados)) {
    return NextResponse.json({ error: "Ese horario ya fue tomado." }, { status: 409 });
  }

  const fin = new Date(new Date(body.inicio).getTime() + duracion * 60_000);
  const idTransaccion = crypto.randomUUID();
  const idTurno = crypto.randomUUID();

  const fechaMovimiento = await fechaDeRegistro(supabase, "movimientos", "fecha_hora");
  const movimiento = await supabase.from("movimientos").insert({
    id_transaccion: idTransaccion,
    id_paciente: idPaciente,
    id_profesional: body.idProfesional,
    id_clinica: body.idClinica,
    fecha_hora: fechaMovimiento,
    hora_turno: cuando.hora,
    tipo_movimiento: "Solicitud Turno",
  });
  if (movimiento.error) return NextResponse.json({ error: movimiento.error.message }, { status: 400 });

  const fechaTurno = await fechaDeRegistro(supabase, "historial_turnos", "fecha_hora");
  const turno = await supabase.from("historial_turnos").insert({
    id_turno: idTurno,
    id_transaccion: idTransaccion,
    id_profesional: body.idProfesional,
    id_paciente: idPaciente,
    id_clinica: body.idClinica,
    fecha_turno: cuando.fecha,
    hora_turno: cuando.hora,
    fecha_hora_turno: cuando.marca,
    duracion_turno: duracion,
    finaliza_turno: enArgentina(fin.toISOString()).marca,
    estado_turno: "Pendiente en Turnero Web",
    origen_turno: "Web",
    fecha_hora: fechaTurno,
  });
  if (turno.error) return NextResponse.json({ error: turno.error.message }, { status: 400 });

  return NextResponse.json({ idTurno });
}
