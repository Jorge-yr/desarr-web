import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import { fechaDeRegistro } from "@/lib/turno/ahora";
import { seSolapa } from "@/lib/turno/huecos";
import {
  hashDeIp,
  intentosRecientes,
  ipDeSolicitud,
  registrarIntento,
  registrarReserva,
  turnosPendientesDeIp,
} from "@/lib/turno/limites";
import { formatoCapital } from "@/lib/turno/nombre";
import { filasAOcupados } from "@/lib/turno/ocupados";
import { ESTADO_PENDIENTE, MAX_INTENTOS_POR_IP, MAX_TURNOS_PENDIENTES_POR_IP } from "@/lib/turno/reglas";
import { verificarTurnstile } from "@/lib/turno/turnstile";

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
  turnstileToken?: string;
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

  const body = (await request.json().catch(() => ({}))) as Body;
  const dni = String(body.dni ?? "").replace(/\D/g, "");
  const duracion = Number(body.duracionMin) > 0 ? Number(body.duracionMin) : 30;
  const nombre = formatoCapital(String(body.nombre ?? "")).slice(0, 60);
  if (!body.idClinica || !body.idProfesional || !body.inicio || dni.length < 7 || dni.length > 9) {
    return NextResponse.json({ error: "Faltan datos del turno." }, { status: 400 });
  }
  if (nombre.length < 2) {
    return NextResponse.json({ error: "Ingresá tu nombre." }, { status: 400 });
  }

  const ip = ipDeSolicitud(request);
  const ipHash = ip ? hashDeIp(ip) : null;

  if (!(await verificarTurnstile(body.turnstileToken, ip))) {
    return NextResponse.json(
      { error: "No pudimos verificar que sos una persona. Esperá un momento e intentá de nuevo." },
      { status: 403 },
    );
  }

  if (ipHash) {
    const pendientes = await turnosPendientesDeIp(supabase, ipHash);
    if (pendientes !== null && pendientes >= MAX_TURNOS_PENDIENTES_POR_IP) {
      return NextResponse.json(
        {
          error: `Ya hay ${MAX_TURNOS_PENDIENTES_POR_IP} turnos pendientes de pago desde esta conexión. Pagá la seña o esperá 24 horas.`,
        },
        { status: 429 },
      );
    }
  }

  const { data: existente } = await supabase
    .from("pacientes")
    .select("id_paciente")
    .eq("id_clinica", body.idClinica)
    .eq("dni", dni)
    .maybeSingle();

  let idPaciente = existente?.id_paciente as string | undefined;
  if (!idPaciente) {
    const nacimiento = String(body.nacimiento ?? "").slice(0, 10);
    const apellido = formatoCapital(String(body.apellido ?? "")).slice(0, 60);
    const fechaOk =
      /^\d{4}-\d{2}-\d{2}$/.test(nacimiento) &&
      !Number.isNaN(new Date(`${nacimiento}T00:00:00`).getTime()) &&
      nacimiento <= enArgentina(new Date().toISOString()).fecha;
    if (!apellido || !fechaOk) {
      if (ipHash) {
        const intentos = await intentosRecientes(supabase, ipHash);
        if (intentos !== null && intentos >= MAX_INTENTOS_POR_IP) {
          return NextResponse.json(
            { error: "Demasiados intentos con un DNI que no encontramos. Probá de nuevo en una hora." },
            { status: 429 },
          );
        }
        await registrarIntento(supabase, ipHash);
      }
      return NextResponse.json({ needsData: true });
    }
    idPaciente = crypto.randomUUID();
    const { error } = await supabase.from("pacientes").insert({
      id_paciente: idPaciente,
      dni,
      nombre,
      apellido,
      fecha_nacimiento: nacimiento,
      nacimiento: Number(nacimiento.slice(0, 4)),
      telefono_paciente: String(body.whatsapp ?? "").trim().slice(0, 30) || null,
      id_clinica: body.idClinica,
      fecha_alta: enArgentina(new Date().toISOString()).fecha,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  }

  const cuando = enArgentina(body.inicio);
  const { data: tomados, error: errorTomados } = await supabase
    .from("historial_turnos")
    .select("fecha_hora, estado_turno, duracion_turno, fecha_turno, hora_turno, fecha_hora_turno, finaliza_turno")
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
    estado_turno: ESTADO_PENDIENTE,
    origen_turno: "Web",
    fecha_hora: fechaTurno,
  });
  if (turno.error) return NextResponse.json({ error: turno.error.message }, { status: 400 });

  if (ipHash) await registrarReserva(supabase, idTurno, ipHash);

  // El nombre que se devuelve es el que escribió la persona, nunca el guardado en la base.
  return NextResponse.json({ idTurno, nombre });
}
