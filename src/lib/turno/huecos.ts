export type Bloque = { dia: number; desde: string; hasta: string };

export type SlotPublico = { inicio: string; etiqueta: string; libre: boolean };

export type Ocupado = { inicio: string; fin: string };

const ZONA = "America/Argentina/Buenos_Aires";

const DEFAULT_BLOCKS: Bloque[] = [1, 2, 3, 4, 5].flatMap((dia) => [
  { dia, desde: "09:00", hasta: "13:00" },
  { dia, desde: "16:00", hasta: "20:00" },
]);

function minutes(label: string) {
  const [h, m] = label.split(":").map(Number);
  return h * 60 + m;
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function fechaArgentina(base: Date, dias: number) {
  const ymd = new Intl.DateTimeFormat("en-CA", {
    timeZone: ZONA,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(base);
  const [anio, mes, dia] = ymd.split("-").map(Number);
  const calendario = new Date(Date.UTC(anio, mes - 1, dia + dias));
  const isoDay = calendario.getUTCDay() === 0 ? 7 : calendario.getUTCDay();
  return { ymd: calendario.toISOString().slice(0, 10), isoDay };
}

function instante(ymd: string, totalMin: number) {
  const hora = pad(Math.floor(totalMin / 60));
  const minuto = pad(totalMin % 60);
  return new Date(`${ymd}T${hora}:${minuto}:00-03:00`);
}

function pisa(inicio: number, fin: number, ocupados: Ocupado[]) {
  return ocupados.some((ocupado) => {
    const desde = new Date(ocupado.inicio).getTime();
    const hasta = new Date(ocupado.fin).getTime();
    return inicio < hasta && fin > desde;
  });
}

export function armarHuecos(opts: {
  bloques: Bloque[];
  duracionMin: number;
  diasAdelante: number;
  desde?: Date;
  ocupados?: Ocupado[];
}): SlotPublico[] {
  const duracion = opts.duracionMin > 0 ? opts.duracionMin : 30;
  const dias = Math.min(Math.max(opts.diasAdelante || 14, 1), 60);
  const bloques = opts.bloques.length > 0 ? opts.bloques : DEFAULT_BLOCKS;
  const ocupados = opts.ocupados ?? [];
  const base = opts.desde ?? new Date();
  const slots: SlotPublico[] = [];

  for (let offset = 0; offset < dias; offset++) {
    const { ymd, isoDay } = fechaArgentina(base, offset);
    const delDia = bloques.filter((b) => b.dia === isoDay);
    for (const bloque of delDia) {
      for (let t = minutes(bloque.desde); t + duracion <= minutes(bloque.hasta); t += duracion) {
        const inicio = instante(ymd, t);
        const fin = instante(ymd, t + duracion);
        if (inicio.getTime() <= Date.now()) continue;
        const libre = !pisa(inicio.getTime(), fin.getTime(), ocupados);
        const etiqueta = inicio.toLocaleString("es-AR", {
          timeZone: ZONA,
          weekday: "short",
          day: "numeric",
          month: "short",
          hour: "2-digit",
          minute: "2-digit",
        });
        slots.push({ inicio: inicio.toISOString(), etiqueta, libre });
      }
    }
  }
  return slots;
}
