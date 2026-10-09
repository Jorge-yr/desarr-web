import type { Metadata } from "next";
import Link from "next/link";
import { ClinicFilterNote } from "@/components/admin/ClinicFilterNote";
import { LookerBoards } from "@/components/admin/LookerBoards";
import { lookerBoardSources } from "@/lib/looker";

export const metadata: Metadata = {
  title: "Tableros del Negocio | Administración",
};

export default function TablerosPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <Link href="/admin" className="text-sm font-medium text-[#1D4ED8] hover:underline">
        Volver al panel
      </Link>
      <h1 className="mt-3 text-2xl font-bold tracking-tight text-[#0F172A]">Tableros del Negocio</h1>
      <p className="mt-1 text-sm text-[#1D4ED8]">motor Looker</p>
      <ClinicFilterNote />
      <LookerBoards boards={lookerBoardSources()} />
    </main>
  );
}
