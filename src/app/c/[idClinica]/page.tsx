import type { Metadata } from "next";
import { ReservaPublica } from "@/components/turno/ReservaPublica";
import { getClinicaPublica } from "@/lib/supabase/public-clinic";
import { turnstileActivo } from "@/lib/turno/turnstile";

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
  // La clave pública llega por prop para leerla al ejecutar, sin variable NEXT_PUBLIC.
  const turnstileSiteKey = turnstileActivo() ? process.env.TURNSTILE_SITE_KEY : undefined;
  return <ReservaPublica clinica={clinica} turnstileSiteKey={turnstileSiteKey} />;
}
