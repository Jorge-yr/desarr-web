import { createServiceClient } from "@/lib/supabase/service";

export type VisitaFila = {
  pacienteId: string;
  paciente: string;
  mes: string;
  profesionalId: string;
};

export type AtencionFila = {
  mes: string;
  profesionalId: string;
  pacienteId: string;
  paciente: string;
  productoId: string;
  producto: string;
  categoria: string;
};

export type CobroFila = {
  mes: string;
  profesionalId: string;
  pacienteId: string;
  paciente: string;
  productoId: string;
  producto: string;
  categoria: string;
  medio: string;
  importe: number;
};

export type TableroNegocio = {
  profesionales: { id: string; nombre: string }[];
  categorias: string[];
  visitas: VisitaFila[];
  atenciones: AtencionFila[];
  cobros: CobroFila[];
  aviso: string | null;
};

const CANCELADO = /cancel|anul/i;

function mesDe(valor: string | null | undefined) {
  if (!valor) return "";
  const texto = String(valor);
  return texto.length >= 7 ? texto.slice(0, 7) : "";
}

function nombreDe(row: { nombre?: string | null; apellido?: string | null; nombre_completo?: string | null; apellido_completo?: string | null; titulo?: string | null }) {
  return [row.titulo, row.nombre_completo ?? row.nombre, row.apellido_completo ?? row.apellido].filter(Boolean).join(" ");
}

export async function cargarTableroNegocio(idClinica: string): Promise<TableroNegocio> {
  const vacio: TableroNegocio = { profesionales: [], categorias: [], visitas: [], atenciones: [], cobros: [], aviso: null };
  const supabase = createServiceClient();
  if (!supabase) return { ...vacio, aviso: "Falta la clave de servicio para leer los tableros." };

  const [profesionales, turnos, pacientes, tratamientos, cobros, movimientos, productos] = await Promise.all([
    supabase.from("profesionales").select("id_profesional, titulo, nombre_completo, apellido_completo").eq("id_clinica", idClinica),
    supabase.from("historial_turnos").select("id_paciente, id_profesional, fecha_turno, fecha_hora_turno, estado_turno").eq("id_clinica", idClinica).limit(5000),
    supabase.from("pacientes").select("id_paciente, nombre, apellido").eq("id_clinica", idClinica).limit(5000),
    supabase.from("tratamientos_realizados").select("id_tratamiento, fecha_tratamiento, id_profesional, id_paciente, id_producto").eq("id_clinica", idClinica).limit(5000),
    supabase.from("historial_cobros").select("fecha_mov_cobro, importe, id_transaccion, id_paciente, id_tratamiento, medio_cobro, id_medio_cobro").eq("id_clinica", idClinica).limit(5000),
    supabase.from("movimientos").select("id_transaccion, id_profesional").eq("id_clinica", idClinica).limit(5000),
    supabase.from("productos").select("id_producto, producto, categoria_principal").eq("id_clinica", idClinica).limit(5000),
  ]);

  const error = profesionales.error || turnos.error || pacientes.error || tratamientos.error || cobros.error || movimientos.error || productos.error;
  if (error) return { ...vacio, aviso: error.message };

  const nombresProf = new Map<string, string>();
  for (const row of profesionales.data ?? []) {
    nombresProf.set(String(row.id_profesional), nombreDe(row) || String(row.id_profesional));
  }
  const nombresPac = new Map<string, string>();
  for (const row of pacientes.data ?? []) {
    nombresPac.set(String(row.id_paciente), nombreDe(row) || String(row.id_paciente));
  }
  const nombresProd = new Map<string, string>();
  const categoriaPorProducto = new Map<string, string>();
  const categorias = new Set<string>();
  for (const row of productos.data ?? []) {
    const id = String(row.id_producto);
    nombresProd.set(id, String(row.producto || id));
    const categoria = String(row.categoria_principal ?? "").trim();
    if (categoria) {
      categoriaPorProducto.set(id, categoria);
      categorias.add(categoria);
    }
  }
  const productoPorTratamiento = new Map<string, string>();
  const profPorMovimiento = new Map<string, string>();
  for (const row of movimientos.data ?? []) {
    if (row.id_transaccion && row.id_profesional) profPorMovimiento.set(String(row.id_transaccion), String(row.id_profesional));
  }

  const visitas: VisitaFila[] = [];
  for (const row of turnos.data ?? []) {
    if (CANCELADO.test(String(row.estado_turno ?? ""))) continue;
    const mes = mesDe(row.fecha_turno ?? row.fecha_hora_turno);
    if (!mes || !row.id_paciente) continue;
    const pacienteId = String(row.id_paciente);
    visitas.push({
      pacienteId,
      paciente: nombresPac.get(pacienteId) || pacienteId,
      mes,
      profesionalId: String(row.id_profesional ?? ""),
    });
  }

  const atenciones: AtencionFila[] = [];
  for (const row of tratamientos.data ?? []) {
    const mes = mesDe(row.fecha_tratamiento);
    if (!mes) continue;
    const productoId = String(row.id_producto ?? "");
    if (row.id_tratamiento) productoPorTratamiento.set(String(row.id_tratamiento), productoId);
    const pacienteId = String(row.id_paciente ?? "");
    atenciones.push({
      mes,
      profesionalId: String(row.id_profesional ?? ""),
      pacienteId,
      paciente: nombresPac.get(pacienteId) || pacienteId || "Sin paciente",
      productoId,
      producto: nombresProd.get(productoId) || productoId || "Sin producto",
      categoria: categoriaPorProducto.get(productoId) || "Sin categoría",
    });
  }

  const cobrosFilas: CobroFila[] = [];
  for (const row of cobros.data ?? []) {
    const mes = mesDe(row.fecha_mov_cobro);
    if (!mes) continue;
    const profesionalId = row.id_transaccion ? profPorMovimiento.get(String(row.id_transaccion)) ?? "" : "";
    if (profesionalId && !nombresProf.has(profesionalId)) nombresProf.set(profesionalId, profesionalId);
    const pacienteId = String(row.id_paciente ?? "");
    const productoId = row.id_tratamiento ? productoPorTratamiento.get(String(row.id_tratamiento)) ?? "" : "";
    cobrosFilas.push({
      mes,
      profesionalId,
      pacienteId,
      paciente: nombresPac.get(pacienteId) || pacienteId || "Sin paciente",
      productoId,
      producto: nombresProd.get(productoId) || productoId || "Sin producto",
      categoria: categoriaPorProducto.get(productoId) || "Sin categoría",
      medio: String(row.medio_cobro || row.id_medio_cobro || "Sin medio"),
      importe: Number(row.importe ?? 0),
    });
  }

  return {
    profesionales: [...nombresProf.entries()].map(([id, nombre]) => ({ id, nombre })).sort((a, b) => a.nombre.localeCompare(b.nombre, "es")),
    categorias: [...categorias].sort((a, b) => a.localeCompare(b, "es")),
    visitas,
    atenciones,
    cobros: cobrosFilas,
    aviso: null,
  };
}
