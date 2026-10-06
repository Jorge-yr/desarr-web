import { createSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server";
import type { ClinicaAdmin } from "@/lib/clinicas";

export async function getAdminClinic(): Promise<ClinicaAdmin | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createSupabaseServerClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return null;

  const { data: admin } = await supabase
    .from("admin_usuarios")
    .select("id_clinica, maestro_administradores(clinica_consultorio)")
    .eq("user_id", auth.user.id)
    .maybeSingle();

  if (!admin?.id_clinica) return null;

  const clinicRow = admin.maestro_administradores as { clinica_consultorio?: string } | { clinica_consultorio?: string }[] | null;
  const clinica = Array.isArray(clinicRow) ? clinicRow[0]?.clinica_consultorio : clinicRow?.clinica_consultorio;

  const { data: profesionales } = await supabase
    .from("profesionales")
    .select("id_profesional, nombre, apellido")
    .eq("id_clinica", admin.id_clinica);

  const lista = Array.isArray(profesionales) ? profesionales : [];

  return {
    idClinica: admin.id_clinica,
    clinica: clinica || admin.id_clinica,
    email: auth.user.email ?? "",
    profesionales: lista.map((p) => ({
      id: String(p.id_profesional),
      nombre: [p.nombre, p.apellido].filter(Boolean).join(" "),
      especialidad: "",
    })),
  };
}
