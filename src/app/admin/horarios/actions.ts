"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export type BloqueGuardado = {
  idProfesional: string;
  dia: number;
  desde: string;
  hasta: string;
};

export type ConfigGuardada = {
  idProfesional: string;
  duracionMin: number;
  diasAdelante: number;
  senaArs: number;
};

export async function leerConfiguracionTurnero(): Promise<{
  configs: ConfigGuardada[];
  bloques: BloqueGuardado[];
  error: string | null;
}> {
  const supabase = await createSupabaseServerClient();
  const { data: configs, error: configError } = await supabase
    .from("configuracion_turnero")
    .select("id_profesional, duracion_turno_min, dias_visibles, importe_sena_ars");
  const { data: bloques, error: bloqueError } = await supabase
    .from("horarios_profesionales")
    .select("id_profesional, dia_semana, hora_desde, hora_hasta");

  if (configError || bloqueError) {
    return { configs: [], bloques: [], error: configError?.message || bloqueError?.message || "No se pudo leer." };
  }

  return {
    configs: (configs ?? []).map((row) => ({
      idProfesional: String(row.id_profesional),
      duracionMin: Number(row.duracion_turno_min),
      diasAdelante: Number(row.dias_visibles),
      senaArs: Number(row.importe_sena_ars),
    })),
    bloques: (bloques ?? []).map((row) => ({
      idProfesional: String(row.id_profesional),
      dia: Number(row.dia_semana),
      desde: String(row.hora_desde).slice(0, 5),
      hasta: String(row.hora_hasta).slice(0, 5),
    })),
    error: null,
  };
}

export async function guardarConfiguracionTurnero(input: ConfigGuardada & { bloques: Omit<BloqueGuardado, "idProfesional">[] }) {
  const supabase = await createSupabaseServerClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return { error: "La sesión venció." };

  const { data: admin } = await supabase
    .from("admin_usuarios")
    .select("id_clinica")
    .eq("user_id", auth.user.id)
    .maybeSingle();
  if (!admin?.id_clinica) return { error: "Este usuario no está asociado a una clínica." };

  const { error: configError } = await supabase.from("configuracion_turnero").upsert(
    {
      id_clinica: admin.id_clinica,
      id_profesional: input.idProfesional,
      duracion_turno_min: input.duracionMin,
      dias_visibles: input.diasAdelante,
      importe_sena_ars: input.senaArs,
    },
    { onConflict: "id_clinica,id_profesional" },
  );
  if (configError) return { error: configError.message };

  const { error: borrar } = await supabase
    .from("horarios_profesionales")
    .delete()
    .eq("id_clinica", admin.id_clinica)
    .eq("id_profesional", input.idProfesional);
  if (borrar) return { error: borrar.message };

  if (input.bloques.length > 0) {
    const { error: insertar } = await supabase.from("horarios_profesionales").insert(
      input.bloques.map((bloque) => ({
        id_clinica: admin.id_clinica,
        id_profesional: input.idProfesional,
        dia_semana: bloque.dia,
        hora_desde: bloque.desde,
        hora_hasta: bloque.hasta,
      })),
    );
    if (insertar) return { error: insertar.message };
  }

  return { error: null };
}
