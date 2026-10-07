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
  searchParams: Promise<{ resultado?: string }>;
}) {
  const { resultado } = await searchParams;
  const texto = TEXTOS[resultado ?? ""] ?? {
    titulo: "Volviste del pago",
    detalle: "Revisá el estado en Mercado Pago. Si la seña se acreditó, el turno queda confirmado.",
  };

  return (
    <main className="mx-auto min-h-full max-w-lg bg-slate-100 px-4 py-10 text-slate-900">
      <h1 className="text-2xl font-semibold">{texto.titulo}</h1>
      <p className="mt-3 text-sm text-slate-600">{texto.detalle}</p>
    </main>
  );
}
