const ZONA = "America/Argentina/Buenos_Aires";

type Partes = { day: number; month: number; year: string; hour: number; minute: string; second: string };

function partes(fecha: Date): Partes {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: ZONA,
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(fecha);
  const valor = (type: Intl.DateTimeFormatPartTypes) => parts.find((p) => p.type === type)?.value ?? "0";
  return {
    day: Number(valor("day")),
    month: Number(valor("month")),
    year: valor("year"),
    hour: Number(valor("hour")) % 24,
    minute: valor("minute").padStart(2, "0"),
    second: valor("second").padStart(2, "0"),
  };
}

export function ahoraRegistro(fecha = new Date()) {
  const p = partes(fecha);
  return `${p.day}/${p.month}/${p.year} ${p.hour}:${p.minute}:${p.second}`;
}

export function ahoraTimestamp(fecha = new Date()) {
  const p = partes(fecha);
  const mes = String(p.month).padStart(2, "0");
  const dia = String(p.day).padStart(2, "0");
  const hora = String(p.hour).padStart(2, "0");
  return `${p.year}-${mes}-${dia} ${hora}:${p.minute}:${p.second}`;
}

const textoPorColumna = new Map<string, boolean>();

type LectorFecha = {
  from: (tabla: string) => {
    select: (columnas: string) => {
      not: (columna: string, op: string, valor: null) => {
        limit: (n: number) => {
          maybeSingle: () => PromiseLike<{ data: Record<string, unknown> | null }>;
        };
      };
    };
  };
};

export async function fechaDeRegistro(supabase: LectorFecha, tabla: string, columna: string) {
  const clave = `${tabla}.${columna}`;
  let esTexto = textoPorColumna.get(clave);
  if (esTexto === undefined) {
    const { data } = await supabase.from(tabla).select(columna).not(columna, "is", null).limit(1).maybeSingle();
    const muestra = String(data?.[columna] ?? "");
    esTexto = /^\d{1,2}\/\d{1,2}\/\d{4}/.test(muestra);
    if (muestra) textoPorColumna.set(clave, esTexto);
  }
  return esTexto ? ahoraRegistro() : ahoraTimestamp();
}
