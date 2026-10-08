import type { Metadata } from "next";
import Link from "next/link";
import { ClinicFilterNote } from "@/components/admin/ClinicFilterNote";

export const metadata: Metadata = {
  title: "Tableros del Negocio | Administración",
};

const BOARDS = [
  { title: "Ocupación de agenda", detail: "Huecos libres y turnos tomados por profesional." },
  { title: "Señas y cobros", detail: "Señas de Mercado Pago contra turnos confirmados." },
  { title: "Origen de turnos", detail: "Web autogestionada frente a carga desde la clínica." },
];

export default function TablerosPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <Link href="/admin" className="text-sm font-medium text-[#1D4ED8] hover:underline">
        Volver al panel
      </Link>
      <h1 className="mt-3 text-2xl font-bold tracking-tight text-[#0F172A]">Tableros del Negocio</h1>
      <p className="mt-1 text-sm text-[#1D4ED8]">motor Looker</p>
      <ClinicFilterNote />
      <div className="mt-8 grid gap-4">
        {BOARDS.map((board) => (
          <article key={board.title} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-5 py-4">
              <h2 className="font-semibold text-[#0F172A]">{board.title}</h2>
              <p className="mt-1 text-sm text-slate-600">{board.detail}</p>
            </div>
            <div className="grid h-40 place-items-center bg-slate-50 text-sm text-slate-500">
              Embed de Looker
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
