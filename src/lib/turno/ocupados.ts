import type { Ocupado } from "@/lib/turno/huecos";

const ZONA = "America/Argentina/Buenos_Aires";

export type FilaTurno = {
  fecha_turno?: unknown;
  hora_turno?: unknown;
  fecha_hora_turno?: unknown;
  finaliza_turno?: unknown;
  duracion_turno?: unknown;
  estado_turno?: unknown;
};

type Marca = { ymd: string; min: number };

export function filasAOcupados(filas: FilaTurno[], duracionDefecto: number, dias: number): Ocupado[] {
  const hoy = new Intl.DateTimeFormat("en-CA", {
    timeZone: ZONA,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
  const [anio, mes, dia] = hoy.split("-").map(Number);
  const limite = new Date(Date.UTC(anio, mes - 1, dia + dias)).toISOString().slice(0, 10);
  const ocupados: Ocupado[] = [];

  for (const turno of filas) {
    const estado = String(turno.estado_turno ?? "").trim().toLowerCase();
    if (!estado || estado.startsWith("cancel")) continue;
    const inicio = inicioDelTurno(turno);
    const fin = finDelTurno(turno, inicio, duracionDefecto);
    if (!inicio || !fin || !esPosterior(inicio, fin)) continue;
    if (!cruzaVentana(inicio, fin, hoy, limite)) continue;
    ocupados.push(...cortarPorDia(inicio, fin, hoy, limite));
  }
  return ocupados;
}

function inicioDelTurno(turno: FilaTurno) {
  return (
    leerMarca(turno.fecha_hora_turno) ??
    leerMarca(`${String(turno.fecha_turno ?? "").slice(0, 10)} ${String(turno.hora_turno ?? "").trim()}`)
  );
}

function finDelTurno(turno: FilaTurno, inicio: Marca | null, duracionDefecto: number) {
  const fin = leerMarca(turno.finaliza_turno);
  if (inicio && fin && esPosterior(inicio, fin)) return fin;
  if (!inicio) return null;
  const minutos = Number(turno.duracion_turno) > 0 ? Number(turno.duracion_turno) : duracionDefecto;
  return sumarMinutos(inicio, minutos > 0 ? minutos : 30);
}

function cortarPorDia(inicio: Marca, fin: Marca, desdeYmd: string, hastaYmd: string) {
  const tramos: Ocupado[] = [];
  let cursor = inicio.ymd < desdeYmd ? { ymd: desdeYmd, min: 0 } : inicio;
  const tope = fin.ymd > hastaYmd ? { ymd: sumarDias(hastaYmd, 1), min: 0 } : fin;
  while (esPosterior(cursor, tope) && cursor.ymd <= hastaYmd) {
    const cierre = cursor.ymd === tope.ymd ? tope.min : 24 * 60;
    if (cierre > cursor.min) tramos.push({ ymd: cursor.ymd, desdeMin: cursor.min, hastaMin: cierre });
    if (cursor.ymd === tope.ymd) break;
    cursor = { ymd: sumarDias(cursor.ymd, 1), min: 0 };
  }
  return tramos;
}

function cruzaVentana(inicio: Marca, fin: Marca, desdeYmd: string, hastaYmd: string) {
  return inicio.ymd <= hastaYmd && (fin.ymd > desdeYmd || (fin.ymd === desdeYmd && fin.min > 0));
}

function leerMarca(valor: unknown): Marca | null {
  const marca = String(valor ?? "").trim();
  const local = marca.match(/^(\d{4}-\d{2}-\d{2})[ T](\d{1,2}):(\d{2})/);
  const tieneZona = /Z$|[+-]\d{2}:?\d{2}$/.test(marca);
  if (local && !tieneZona) {
    const min = Number(local[2]) * 60 + Number(local[3]);
    if (min >= 0 && min < 24 * 60) return { ymd: local[1], min };
  }
  const instante = new Date(marca);
  if (!local && Number.isNaN(instante.getTime())) return null;
  if (!tieneZona) return null;
  const ymd = instante.toLocaleDateString("en-CA", { timeZone: ZONA });
  const reloj = instante.toLocaleTimeString("en-GB", {
    timeZone: ZONA,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const [h, m] = reloj.split(":").map(Number);
  return { ymd, min: h * 60 + m };
}

function esPosterior(desde: Marca, hasta: Marca) {
  return hasta.ymd > desde.ymd || (hasta.ymd === desde.ymd && hasta.min > desde.min);
}

function sumarMinutos(marca: Marca, minutos: number): Marca {
  const total = marca.min + minutos;
  const dias = Math.floor(total / (24 * 60));
  const min = total % (24 * 60);
  return { ymd: sumarDias(marca.ymd, dias), min };
}

function sumarDias(ymd: string, dias: number) {
  const [anio, mes, dia] = ymd.split("-").map(Number);
  return new Date(Date.UTC(anio, mes - 1, dia + dias)).toISOString().slice(0, 10);
}
