import { createSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { armarHuecos, type Bloque, type Ocupado, type SlotPublico } from "@/lib/turno/huecos";
import { filasAOcupados } from "@/lib/turno/ocupados";

export type ProfesionalPublico = { id: string; nombre: string; duracionMin: number; senaArs: number };

export type ClinicaPublica = {
  idClinica: string;
  nombre: string;
  profesionales: ProfesionalPublico[];
  duracionMin: number;
  senaArs: number;
  huecos: Record<string, SlotPublico[]>;
  aviso: string | null;
};

export async function getClinicaPublica(idClinica: string): Promise<ClinicaPublica> {
  const vacia: ClinicaPublica = {
    idClinica,
    nombre: idClinica,
    profesionales: [],
    duracionMin: 30,
    senaArs: 0,
    huecos: {},
    aviso: null,
  };
  if (!isSupabaseConfigured()) {
    return { ...vacia, aviso: "Supabase no está configurado en este servidor." };
  }

  const supabase = await createSupabaseServerClient();
  const { data: clinica } = await supabase
    .from("maestro_administradores")
    .select("clinica_consultorio")
    .eq("id_clinica", idClinica)
    .maybeSingle();

  const { data: profesionales, error } = await supabase
    .from("profesionales")
    .select("id_profesional, nombre_completo, apellido_completo")
    .eq("id_clinica", idClinica);

  if (error || !Array.isArray(profesionales)) {
    return {
      ...vacia,
      nombre: clinica?.clinica_consultorio ?? idClinica,
      aviso: "La clínica todavía no se puede leer sin iniciar sesión.",
    };
  }

  const lista: ProfesionalPublico[] = [];
  const huecos: Record<string, SlotPublico[]> = {};
  for (const p of profesionales) {
    const id = String(p.id_profesional);
    const { data: config } = await supabase
      .from("configuracion_turnero")
      .select("duracion_turno_min, dias_visibles, importe_sena_ars")
      .eq("id_clinica", idClinica)
      .eq("id_profesional", id)
      .maybeSingle();
    const { data: bloques } = await supabase
      .from("horarios_profesionales")
      .select("dia_semana, hora_desde, hora_hasta")
      .eq("id_clinica", idClinica)
      .eq("id_profesional", id);

    const parsed: Bloque[] = Array.isArray(bloques)
      ? bloques.map((b) => ({
          dia: Number(b.dia_semana),
          desde: String(b.hora_desde).slice(0, 5),
          hasta: String(b.hora_hasta).slice(0, 5),
        }))
      : [];
    const duracionMin = Number(config?.duracion_turno_min ?? 30);
    const senaArs = Number(config?.importe_sena_ars ?? 0);
    const diasAdelante = Number(config?.dias_visibles ?? 21);
    const ocupados = await turnosOcupados(id, diasAdelante, duracionMin);

    lista.push({
      id,
      nombre: [p.nombre_completo, p.apellido_completo].filter(Boolean).join(" "),
      duracionMin,
      senaArs,
    });
    huecos[id] = armarHuecos({
      bloques: parsed,
      duracionMin,
      diasAdelante,
      ocupados,
    });
  }

  return {
    idClinica,
    nombre: clinica?.clinica_consultorio ?? idClinica,
    profesionales: lista,
    duracionMin: lista[0]?.duracionMin ?? 30,
    senaArs: lista[0]?.senaArs ?? 0,
    huecos,
    aviso: lista.length === 0 ? "Esta clínica no tiene profesionales cargados." : null,
  };
}

async function turnosOcupados(idProfesional: string, dias: number, duracionDefecto: number): Promise<Ocupado[]> {
  const supabase = createServiceClient();
  if (!supabase) return [];
  const { data } = await supabase
    .from("historial_turnos")
    .select("fecha_turno, hora_turno, fecha_hora_turno, finaliza_turno, duracion_turno, estado_turno")
    .eq("id_profesional", idProfesional);
  return filasAOcupados(data ?? [], duracionDefecto, dias);
}
