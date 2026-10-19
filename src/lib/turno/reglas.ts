export const ESTADO_PENDIENTE = "Pendiente en Turnero Web";
export const ESTADO_VENCIDO = "Cancelado";

// Un turno web sin seña libera el horario a las 24 horas.
export const VENCE_PENDIENTE_HORAS = 24;
// Turnos pendientes de pago que puede tener una misma conexión.
export const MAX_TURNOS_PENDIENTES_POR_IP = 5;
// Consultas de DNI que no existe que se aceptan por conexión dentro de la ventana.
export const MAX_INTENTOS_POR_IP = 2;
export const VENTANA_INTENTOS_MIN = 60;

export function esPendiente(estado: unknown) {
  return String(estado ?? "").trim().toLowerCase() === ESTADO_PENDIENTE.toLowerCase();
}

// fecha_hora la escribe el turnero (hora de Argentina). Puede venir como
// "2026-10-18T21:50:00" o como texto de AppSheet "18/10/2026 21:50:00".
export function instanteDeRegistro(valor: unknown): number | null {
  const texto = String(valor ?? "").trim();
  if (!texto) return null;

  if (/^\d{4}-\d{2}-\d{2}[ T]\d{1,2}:\d{2}/.test(texto) && /Z$|[+-]\d{2}:?\d{2}$/.test(texto)) {
    const instante = new Date(texto.replace(" ", "T")).getTime();
    return Number.isNaN(instante) ? null : instante;
  }

  let partes: number[] | null = null;
  const iso = texto.match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{1,2}):(\d{2})(?::(\d{2}))?/);
  if (iso) partes = [Number(iso[1]), Number(iso[2]), Number(iso[3]), Number(iso[4]), Number(iso[5]), Number(iso[6] ?? 0)];
  const local = texto.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})[ ,T]+(\d{1,2}):(\d{2})(?::(\d{2}))?/);
  if (local) partes = [Number(local[3]), Number(local[2]), Number(local[1]), Number(local[4]), Number(local[5]), Number(local[6] ?? 0)];
  if (!partes) return null;

  const [anio, mes, dia, hora, minuto, segundo] = partes;
  // Argentina es UTC-3 todo el año.
  return Date.UTC(anio, mes - 1, dia, hora + 3, minuto, segundo);
}

export function pendienteVencido(estado: unknown, fechaHora: unknown, ahora = Date.now()) {
  if (!esPendiente(estado)) return false;
  const creado = instanteDeRegistro(fechaHora);
  if (creado === null) return false;
  return ahora - creado > VENCE_PENDIENTE_HORAS * 60 * 60 * 1000;
}
