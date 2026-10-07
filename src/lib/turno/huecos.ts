export type Bloque = { dia: number; desde: string; hasta: string };

export type SlotPublico = { inicio: string; etiqueta: string };

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

export function armarHuecos(opts: {
  bloques: Bloque[];
  duracionMin: number;
  diasAdelante: number;
  desde?: Date;
}): SlotPublico[] {
  const duracion = opts.duracionMin > 0 ? opts.duracionMin : 30;
  const dias = Math.min(Math.max(opts.diasAdelante || 14, 1), 60);
  const bloques = opts.bloques.length > 0 ? opts.bloques : DEFAULT_BLOCKS;
  const start = opts.desde ?? new Date();
  start.setHours(0, 0, 0, 0);
  const slots: SlotPublico[] = [];

  for (let offset = 0; offset < dias; offset++) {
    const day = new Date(start);
    day.setDate(start.getDate() + offset);
    const isoDay = day.getDay() === 0 ? 7 : day.getDay();
    const delDia = bloques.filter((b) => b.dia === isoDay);
    for (const bloque of delDia) {
      for (let t = minutes(bloque.desde); t + duracion <= minutes(bloque.hasta); t += duracion) {
        const inicio = new Date(day);
        inicio.setHours(Math.floor(t / 60), t % 60, 0, 0);
        if (inicio.getTime() <= Date.now()) continue;
        const etiqueta = inicio.toLocaleString("es-AR", {
          weekday: "short",
          day: "numeric",
          month: "short",
          hour: "2-digit",
          minute: "2-digit",
        });
        slots.push({ inicio: inicio.toISOString(), etiqueta });
      }
    }
  }
  return slots;
}
