import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { filasAOcupados } from "@/lib/turno/ocupados";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const idClinica = url.searchParams.get("idClinica") ?? "";
  const idProfesional = url.searchParams.get("idProfesional") ?? "";
  const duracion = Number(url.searchParams.get("duracionMin"));
  const dias = Number(url.searchParams.get("dias"));
  if (!idClinica || !idProfesional) {
    return NextResponse.json({ error: "Faltan datos del profesional." }, { status: 400 });
  }

  const anon = await createSupabaseServerClient();
  const { data: profesional } = await anon
    .from("profesionales")
    .select("id_profesional")
    .eq("id_clinica", idClinica)
    .eq("id_profesional", idProfesional)
    .maybeSingle();
  if (!profesional) {
    return NextResponse.json({ error: "Ese profesional no está en la clínica." }, { status: 404 });
  }

  const supabase = createServiceClient();
  if (!supabase) {
    return NextResponse.json({ error: "No se pueden leer los turnos ocupados." }, { status: 503 });
  }

  const { data, error } = await supabase
    .from("historial_turnos")
    .select("fecha_turno, hora_turno, fecha_hora_turno, finaliza_turno, duracion_turno, estado_turno")
    .eq("id_profesional", idProfesional);

  if (error) {
    return NextResponse.json({ error: "No se pudieron leer los turnos ocupados." }, { status: 500 });
  }

  const ocupados = filasAOcupados(data ?? [], duracion > 0 ? duracion : 30, dias > 0 ? dias : 60);
  return NextResponse.json({ ocupados }, { headers: { "Cache-Control": "no-store" } });
}
