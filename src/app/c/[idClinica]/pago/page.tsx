import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pago de la seña",
  robots: { index: false, follow: false },
};

const TEXTOS: Record<string, { titulo: string; detalle: string }> = {
  aprobado: {
    titulo: "Seña acreditada",
    detalle: "Mercado Pago aprobó el pago. El turno queda confirmado con seña.",
  },
  pendiente: {
    titulo: "Pago pendiente",
    detalle: "Mercado Pago todavía no acreditó la seña. El turno sigue pendiente.",
  },
  rechazado: {
    titulo: "Pago no realizado",
    detalle: "La seña no se acreditó. El turno no quedó confirmado.",
  },
};

export default async function PagoSenaPage({
  searchParams,
}: {
  searchParams: Promise<{ resultado?: string; inicio?: string; min?: string; pro?: string; cli?: string }>;
}) {
  const params = await searchParams;
  const texto = TEXTOS[params.resultado ?? ""] ?? {
    titulo: "Volviste del pago",
    detalle: "Revisá el estado en Mercado Pago. Si la seña se acreditó, el turno queda confirmado.",
  };
  const inicio = new Date(params.inicio ?? "");
  const minutos = Number(params.min);
  const puedeAgendar = params.resultado === "aprobado" && !Number.isNaN(inicio.getTime()) && minutos > 0;
  const agenda = new URLSearchParams({
    inicio: params.inicio ?? "",
    min: params.min ?? "",
    pro: params.pro ?? "",
    cli: params.cli ?? "",
  });

  return (
    <main className="mx-auto min-h-full max-w-lg bg-slate-100 px-4 py-10 text-slate-900">
      <h1 className="text-2xl font-semibold">{texto.titulo}</h1>
      <p className="mt-3 text-sm text-slate-600">{texto.detalle}</p>
      {puedeAgendar && (
        <a
          href={`/api/turno/calendario?${agenda.toString()}`}
          className="mt-6 inline-block rounded-lg bg-teal-700 px-4 py-3 text-sm font-semibold text-white"
        >
          Agregar a mi agenda
        </a>
      )}
    </main>
  );
}
