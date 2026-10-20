import { createHmac } from "node:crypto";
import type { createServiceClient } from "@/lib/supabase/service";
import { VENCE_PENDIENTE_HORAS, VENTANA_INTENTOS_MIN, esPendiente } from "@/lib/turno/reglas";

type Cliente = NonNullable<ReturnType<typeof createServiceClient>>;

const HORA_MS = 60 * 60 * 1000;

function prefijoIpv6(ip: string) {
  const [cabeza, cola = ""] = ip.split("::");
  const antes = cabeza ? cabeza.split(":") : [];
  const despues = cola ? cola.split(":") : [];
  const relleno = ip.includes("::") ? Array(Math.max(0, 8 - antes.length - despues.length)).fill("0") : [];
  return [...antes, ...relleno, ...despues]
    .slice(0, 4)
    .map((grupo) => grupo.padStart(4, "0"))
    .join(":");
}

// Quien usa IPv6 recibe un bloque entero de direcciones: se cuenta por bloque /64.
function claveDeIp(ip: string) {
  if (!ip.includes(":")) return ip;
  if (ip.includes(".")) return ip.slice(ip.lastIndexOf(":") + 1);
  return `v6:${prefijoIpv6(ip)}`;
}

export function ipDeSolicitud(request: Request) {
  const directa =
    request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip")?.trim() ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return directa ? directa : null;
}

// Se guarda un hash, no la dirección.
export function hashDeIp(ip: string) {
  const secreto = process.env.TURNERO_IP_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || "desarr-turnero";
  return createHmac("sha256", secreto).update(claveDeIp(ip)).digest("hex");
}

// Si las tablas todavía no existen, la reserva sigue y queda el aviso en el log.
function tablaFaltante(origen: string, mensaje: string) {
  console.error(`[turnero] ${origen}: ${mensaje}`);
  return null;
}

export async function turnosPendientesDeIp(supabase: Cliente, ipHash: string): Promise<number | null> {
  const desde = new Date(Date.now() - VENCE_PENDIENTE_HORAS * HORA_MS).toISOString();
  const reservas = await supabase
    .from("turnero_reservas_web")
    .select("id_turno")
    .eq("ip_hash", ipHash)
    .gte("creado_en", desde);
  if (reservas.error) return tablaFaltante("reservas por IP", reservas.error.message);

  const ids = (reservas.data ?? []).map((fila) => String(fila.id_turno));
  if (ids.length === 0) return 0;

  const turnos = await supabase.from("historial_turnos").select("id_turno, estado_turno").in("id_turno", ids);
  if (turnos.error) return tablaFaltante("turnos por IP", turnos.error.message);
  return (turnos.data ?? []).filter((turno) => esPendiente(turno.estado_turno)).length;
}

export async function registrarReserva(supabase: Cliente, idTurno: string, ipHash: string) {
  const { error } = await supabase.from("turnero_reservas_web").insert({ id_turno: idTurno, ip_hash: ipHash });
  if (error) tablaFaltante("registrar reserva", error.message);
  await supabase
    .from("turnero_reservas_web")
    .delete()
    .lt("creado_en", new Date(Date.now() - 3 * 24 * HORA_MS).toISOString());
}

export async function intentosRecientes(supabase: Cliente, ipHash: string): Promise<number | null> {
  const desde = new Date(Date.now() - VENTANA_INTENTOS_MIN * 60 * 1000).toISOString();
  const { count, error } = await supabase
    .from("turnero_intentos")
    .select("id", { count: "exact", head: true })
    .eq("ip_hash", ipHash)
    .gte("creado_en", desde);
  if (error) return tablaFaltante("intentos por IP", error.message);
  return count ?? 0;
}

export async function registrarIntento(supabase: Cliente, ipHash: string) {
  const { error } = await supabase.from("turnero_intentos").insert({ ip_hash: ipHash });
  if (error) tablaFaltante("registrar intento", error.message);
  await supabase
    .from("turnero_intentos")
    .delete()
    .lt("creado_en", new Date(Date.now() - 2 * 24 * HORA_MS).toISOString());
}
