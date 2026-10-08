import type { Metadata } from "next";
import Link from "next/link";
import { ClinicFilterNote } from "@/components/admin/ClinicFilterNote";
import { CuentaCobro } from "@/components/admin/CuentaCobro";
import { LinkParaPacientes } from "@/components/admin/LinkParaPacientes";

export const metadata: Metadata = {
  title: "Panel | Administración",
};

export default function AdminHomePage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <p className="text-xs font-medium uppercase tracking-wide text-[#1D4ED8]">Panel principal</p>
      <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#0F172A]">¿Qué querés ver?</h1>
      <ClinicFilterNote />
      <LinkParaPacientes />
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Link
          href="/admin/tableros"
          className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-[#1D4ED8]"
        >
          <h2 className="text-lg font-semibold text-[#0F172A]">Tableros del Negocio</h2>
          <p className="mt-1 text-sm text-[#1D4ED8]">motor Looker</p>
          <p className="mt-2 text-sm text-slate-600">
            Ocupación, turnos y señas de la clínica.
          </p>
        </Link>
        <Link
          href="/admin/horarios"
          className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-[#1D4ED8]"
        >
          <p className="text-xs font-medium uppercase tracking-wide text-[#1D4ED8]">Turnero</p>
          <h2 className="mt-2 text-lg font-semibold text-[#0F172A]">Gestionar turnero</h2>
          <p className="mt-2 text-sm text-slate-600">
            Elegí un profesional y parametrizá duración, días visibles, seña y la grilla semanal.
          </p>
        </Link>
      </div>
      <CuentaCobro />
    </main>
  );
}
