import type { Metadata } from "next";
import Link from "next/link";
import { ClinicFilterNote } from "@/components/admin/ClinicFilterNote";
import { LookerBoards } from "@/components/admin/LookerBoards";
import { TablerosNegocio } from "@/components/admin/TablerosNegocio";
import { lookerBoardSources } from "@/lib/looker";
import { cargarTableroNegocio } from "@/lib/supabase/negocio-tablero";
import { getAdminClinic } from "@/lib/supabase/admin-clinic";

export const metadata: Metadata = {
  title: "Tableros del Negocio | Administración",
};

export default async function TablerosPage() {
  const clinic = await getAdminClinic();
  const datos = clinic ? await cargarTableroNegocio(clinic.idClinica) : null;
  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <Link href="/admin" className="text-sm font-medium text-[#1D4ED8] hover:underline">
        Volver al panel
      </Link>
      <h1 className="mt-3 text-2xl font-bold tracking-tight text-[#0F172A]">Tableros del Negocio</h1>
      <p className="mt-1 text-sm text-[#1D4ED8]">motor Looker</p>
      <ClinicFilterNote />
      {datos && <TablerosNegocio datos={datos} />}
      <LookerBoards boards={lookerBoardSources()} />
    </main>
  );
}
