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
      <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">Panel principal</p>
      <h1 className="mt-1 text-2xl font-semibold tracking-tight">¿Qué querés ver?</h1>
      <ClinicFilterNote />
      <LinkParaPacientes />
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Link
          href="/admin/tableros"
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-teal-600"
        >
          <h2 className="text-lg font-semibold">Tableros del Negocio</h2>
          <p className="mt-1 text-sm text-slate-500">motor Looker</p>
          <p className="mt-2 text-sm text-slate-500">
            Ocupación, turnos y señas de la clínica.
          </p>
        </Link>
        <Link
          href="/admin/horarios"
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-teal-600"
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Turnero</p>
          <h2 className="mt-2 text-lg font-semibold">Gestionar turnero</h2>
          <p className="mt-2 text-sm text-slate-500">
            Elegí un profesional y parametrizá duración, días visibles, seña y la grilla semanal.
          </p>
        </Link>
      </div>
      <CuentaCobro />
    </main>
  );
}
