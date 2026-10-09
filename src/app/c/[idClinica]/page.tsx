import type { Metadata } from "next";
import { ReservaPublica } from "@/components/turno/ReservaPublica";
import { getClinicaPublica } from "@/lib/supabase/public-clinic";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Sistema de reserva de turnos",
  robots: { index: false, follow: false },
};

export default async function ReservaClinicaPage({
  params,
}: {
  params: Promise<{ idClinica: string }>;
}) {
  const { idClinica } = await params;
  const clinica = await getClinicaPublica(idClinica);
  return <ReservaPublica clinica={clinica} />;
}
