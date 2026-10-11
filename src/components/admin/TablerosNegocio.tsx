"use client";

import { Fragment, useMemo, useState, type ReactNode } from "react";
import type { TableroNegocio } from "@/lib/supabase/negocio-tablero";

function etiquetaMes(mes: string) {
  const [anio, numero] = mes.split("-");
  const fecha = new Date(Number(anio), Number(numero) - 1, 1);
  return fecha.toLocaleDateString("es-AR", { month: "short", year: "numeric" });
}

function plata(valor: number) {
  return valor.toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });
}

function nombreProf(datos: TableroNegocio, id: string) {
  if (!id) return "Sin profesional";
  return datos.profesionales.find((p) => p.id === id)?.nombre || id;
}

export function TablerosNegocio({ datos }: { datos: TableroNegocio }) {
  const meses = useMemo(() => {
    const set = new Set<string>();
    for (const fila of [...datos.visitas, ...datos.atenciones, ...datos.cobros]) set.add(fila.mes);
    return [...set].sort();
  }, [datos]);
  const [desde, setDesde] = useState(meses[0] ?? "");
  const [hasta, setHasta] = useState(meses.at(-1) ?? "");
  const [profesionalId, setProfesionalId] = useState("");
  const [paciente, setPaciente] = useState("");
  const [medio, setMedio] = useState("");
  const [categorias, setCategorias] = useState<string[]>([]);
  const [corteAtencion, setCorteAtencion] = useState<"profesional" | "paciente" | "producto">("profesional");
  const [corteCobro, setCorteCobro] = useState<"profesional" | "paciente" | "medio" | "producto">("profesional");
  const [abierto, setAbierto] = useState("");

  const enPeriodo = (mes: string) => (!desde || mes >= desde) && (!hasta || mes <= hasta);
  const delProfesional = (id: string) => !profesionalId || id === profesionalId;
  const deCategoria = (categoria: string) => categorias.length === 0 || categorias.includes(categoria);

  const visitas = useMemo(() => {
    const busqueda = paciente.trim().toLocaleLowerCase("es");
    const conCategoria = new Set<string>();
    if (categorias.length > 0) {
      for (const fila of datos.atenciones) {
        if (deCategoria(fila.categoria)) conCategoria.add(`${fila.pacienteId}|${fila.mes}`);
      }
    }
    const grupos = new Map<string, { pacienteId: string; paciente: string; mes: string; visitas: number }>();
    for (const fila of datos.visitas) {
      if (!enPeriodo(fila.mes) || !delProfesional(fila.profesionalId)) continue;
      if (busqueda && !fila.paciente.toLocaleLowerCase("es").includes(busqueda)) continue;
      if (categorias.length > 0 && !conCategoria.has(`${fila.pacienteId}|${fila.mes}`)) continue;
      const clave = `${fila.pacienteId}|${fila.mes}`;
      const actual = grupos.get(clave) ?? { pacienteId: fila.pacienteId, paciente: fila.paciente, mes: fila.mes, visitas: 0 };
      actual.visitas += 1;
      grupos.set(clave, actual);
    }
    return [...grupos.values()];
  }, [datos.visitas, datos.atenciones, desde, hasta, profesionalId, paciente, categorias]);

  const mapaVisitas = useMemo(() => {
    const columnas = [...new Set(visitas.map((fila) => fila.mes))].sort();
    const filas = new Map<string, { paciente: string; celdas: Map<string, number> }>();
    let max = 1;
    for (const fila of visitas) {
      const actual = filas.get(fila.pacienteId) ?? { paciente: fila.paciente, celdas: new Map() };
      const total = (actual.celdas.get(fila.mes) ?? 0) + fila.visitas;
      actual.celdas.set(fila.mes, total);
      if (total > max) max = total;
      filas.set(fila.pacienteId, actual);
    }
    const pacientes = [...filas.entries()]
      .map(([id, fila]) => ({
        id,
        ...fila,
        total: [...fila.celdas.values()].reduce((suma, valor) => suma + valor, 0),
      }))
      .sort((a, b) => b.total - a.total || a.paciente.localeCompare(b.paciente, "es"));
    return { columnas, pacientes, max };
  }, [visitas]);

  const atenciones = useMemo(() => {
    const grupos = new Map<string, { etiqueta: string; mes: string; atenciones: number }>();
    for (const fila of datos.atenciones) {
      if (!enPeriodo(fila.mes) || !delProfesional(fila.profesionalId) || !deCategoria(fila.categoria)) continue;
      const etiqueta = corteAtencion === "paciente" ? fila.paciente : corteAtencion === "producto" ? fila.producto : nombreProf(datos, fila.profesionalId);
      const clave = `${etiqueta}|${fila.mes}`;
      const actual = grupos.get(clave) ?? { etiqueta, mes: fila.mes, atenciones: 0 };
      actual.atenciones += 1;
      grupos.set(clave, actual);
    }
    return [...grupos.values()].sort((a, b) => b.mes.localeCompare(a.mes) || b.atenciones - a.atenciones);
  }, [datos, desde, hasta, profesionalId, corteAtencion, categorias]);

  const recaudacion = useMemo(() => {
    const grupos = new Map<string, { etiqueta: string; mes: string; importe: number; medios: Map<string, number> }>();
    for (const fila of datos.cobros) {
      if (!enPeriodo(fila.mes) || !delProfesional(fila.profesionalId) || !deCategoria(fila.categoria)) continue;
      if (medio && fila.medio !== medio) continue;
      const etiqueta =
        corteCobro === "paciente" ? fila.paciente : corteCobro === "producto" ? fila.producto : corteCobro === "medio" ? fila.medio : nombreProf(datos, fila.profesionalId);
      const clave = `${etiqueta}|${fila.mes}`;
      const actual = grupos.get(clave) ?? { etiqueta, mes: fila.mes, importe: 0, medios: new Map() };
      actual.importe += fila.importe;
      actual.medios.set(fila.medio, (actual.medios.get(fila.medio) ?? 0) + fila.importe);
      grupos.set(clave, actual);
    }
    return [...grupos.values()].sort((a, b) => b.mes.localeCompare(a.mes) || b.importe - a.importe);
  }, [datos, desde, hasta, profesionalId, medio, corteCobro, categorias]);

  const medios = useMemo(() => [...new Set(datos.cobros.map((fila) => fila.medio))].sort((a, b) => a.localeCompare(b, "es")), [datos.cobros]);
  const maxAtenciones = Math.max(1, ...atenciones.map((fila) => fila.atenciones));

  return (
    <div className="mt-8 flex flex-col gap-6">
      {datos.aviso && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{datos.aviso}</p>}
      <div className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-4">
        <label className="flex flex-col gap-1 text-xs font-medium text-slate-600">
          Desde
          <input type="month" value={desde} onChange={(e) => setDesde(e.target.value)} className="rounded-lg border border-slate-300 px-2 py-2 text-sm" />
        </label>
        <label className="flex flex-col gap-1 text-xs font-medium text-slate-600">
          Hasta
          <input type="month" value={hasta} min={desde || undefined} onChange={(e) => setHasta(e.target.value)} className="rounded-lg border border-slate-300 px-2 py-2 text-sm" />
        </label>
        <label className="flex flex-col gap-1 text-xs font-medium text-slate-600">
          Profesional
          <select value={profesionalId} onChange={(e) => setProfesionalId(e.target.value)} className="rounded-lg border border-slate-300 px-2 py-2 text-sm">
            <option value="">Todos</option>
            {datos.profesionales.map((p) => (
              <option key={p.id} value={p.id}>{p.nombre}</option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs font-medium text-slate-600">
          Paciente
          <input value={paciente} onChange={(e) => setPaciente(e.target.value)} placeholder="Buscar en visitas" className="rounded-lg border border-slate-300 px-2 py-2 text-sm" />
        </label>
        <div className="flex flex-col gap-1 text-xs font-medium text-slate-600 sm:col-span-4">
          Categorías de producto
          <div className="flex flex-wrap gap-2">
            {datos.categorias.map((categoria) => {
              const activa = categorias.includes(categoria);
              return (
                <button
                  key={categoria}
                  type="button"
                  aria-pressed={activa}
                  onClick={() =>
                    setCategorias((actual) =>
                      actual.includes(categoria) ? actual.filter((item) => item !== categoria) : [...actual, categoria],
                    )
                  }
                  className={`rounded-full border px-3 py-1.5 text-sm ${
                    activa ? "border-[#1D4ED8] bg-[#1D4ED8] text-white" : "border-slate-300 bg-white text-slate-700"
                  }`}
                >
                  {categoria}
                </button>
              );
            })}
            {datos.categorias.length === 0 && <span className="py-1.5 text-sm font-normal text-slate-500">No hay categorías cargadas.</span>}
          </div>
        </div>
      </div>

      <Seccion titulo="Visitas por usuario" detalle="Cada celda es la cantidad de visitas del paciente en ese mes. El color crece con la cantidad. Sin categorías marcadas se ven todas.">
        {mapaVisitas.pacientes.length === 0 ? <Vacio /> : (
          <div className="overflow-x-auto">
            <table className="w-full border-separate border-spacing-1 text-left text-sm">
              <thead>
                <tr>
                  <th className="sticky left-0 bg-white px-3 py-2 text-xs font-medium uppercase tracking-wide text-slate-500">Paciente</th>
                  {mapaVisitas.columnas.map((mes) => (
                    <th key={mes} className="px-2 py-2 text-center text-xs font-medium uppercase tracking-wide text-slate-500">{etiquetaMes(mes)}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {mapaVisitas.pacientes.map((fila) => (
                  <tr key={fila.id}>
                    <th className="sticky left-0 bg-white px-3 py-2 text-left font-medium text-slate-800">{fila.paciente}</th>
                    {mapaVisitas.columnas.map((mes) => {
                      const valor = fila.celdas.get(mes) ?? 0;
                      return (
                        <td key={mes} className={`rounded-md px-2 py-2 text-center tabular-nums ${tonoVisita(valor, mapaVisitas.max)}`}>
                          {valor || ""}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Seccion>

      <Seccion titulo="Atenciones por mes" detalle="Tratamientos registrados. El corte puede ser profesional, paciente o producto.">
        <Corte
          value={corteAtencion}
          onChange={(value) => setCorteAtencion(value as typeof corteAtencion)}
          opciones={[["profesional", "Profesional"], ["paciente", "Paciente"], ["producto", "Producto"]]}
        />
        {atenciones.length === 0 ? <Vacio /> : (
          <Tabla encabezados={["Corte", "Mes", "Atenciones"]}>
            {atenciones.map((fila) => (
              <tr key={`${fila.etiqueta}-${fila.mes}`} className="border-t border-slate-100">
                <td className="px-4 py-2">{fila.etiqueta}</td>
                <td className="px-4 py-2">{etiquetaMes(fila.mes)}</td>
                <td className="px-4 py-2"><Barra valor={fila.atenciones} max={maxAtenciones} /></td>
              </tr>
            ))}
          </Tabla>
        )}
      </Seccion>

      <Seccion titulo="Recaudación por mes" detalle="Importe cobrado. El producto sale del tratamiento asociado al cobro. Abrí una fila para ver el medio.">
        <Corte
          value={corteCobro}
          onChange={(value) => { setCorteCobro(value as typeof corteCobro); setAbierto(""); }}
          opciones={[["profesional", "Profesional"], ["paciente", "Paciente"], ["producto", "Producto"], ["medio", "Medio de cobro"]]}
        />
        <label className="mb-3 flex max-w-xs flex-col gap-1 text-xs font-medium text-slate-600">
          Medio de cobro
          <select value={medio} onChange={(e) => setMedio(e.target.value)} className="rounded-lg border border-slate-300 px-2 py-2 text-sm">
            <option value="">Todos</option>
            {medios.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </label>
        {recaudacion.length === 0 ? <Vacio /> : (
          <Tabla encabezados={["Corte", "Mes", "Recaudación"]}>
            {recaudacion.map((fila) => {
              const clave = `${fila.etiqueta}|${fila.mes}`;
              const abierta = abierto === clave;
              return (
                <Fragment key={clave}>
                  <tr className="border-t border-slate-100">
                    <td className="px-4 py-2">{fila.etiqueta}</td>
                    <td className="px-4 py-2">{etiquetaMes(fila.mes)}</td>
                    <td className="px-4 py-2">
                      <button type="button" className="font-medium text-[#1D4ED8]" onClick={() => setAbierto(abierta ? "" : clave)}>
                        {plata(fila.importe)} {abierta ? "▴" : "▾"}
                      </button>
                    </td>
                  </tr>
                  {abierta && (
                    <tr className="bg-slate-50">
                      <td colSpan={3} className="px-4 py-2">
                        <ul className="flex flex-col gap-1 text-sm">
                          {[...fila.medios.entries()].sort((a, b) => b[1] - a[1]).map(([nombre, importe]) => (
                            <li key={nombre} className="flex justify-between gap-4">
                              <span>{nombre}</span>
                              <span>{plata(importe)}</span>
                            </li>
                          ))}
                        </ul>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </Tabla>
        )}
      </Seccion>
    </div>
  );
}

function Corte({ value, onChange, opciones }: { value: string; onChange: (value: string) => void; opciones: [string, string][] }) {
  return (
    <label className="mb-3 flex max-w-xs flex-col gap-1 text-xs font-medium text-slate-600">
      Corte
      <select value={value} onChange={(e) => onChange(e.target.value)} className="rounded-lg border border-slate-300 px-2 py-2 text-sm">
        {opciones.map(([id, label]) => <option key={id} value={id}>{label}</option>)}
      </select>
    </label>
  );
}

function Seccion({ titulo, detalle, children }: { titulo: string; detalle: string; children: ReactNode }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="font-semibold text-[#0F172A]">{titulo}</h2>
      <p className="mt-1 text-sm text-slate-600">{detalle}</p>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Tabla({ encabezados, children }: { encabezados: string[]; children: ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="text-xs uppercase tracking-wide text-slate-500">
          <tr>{encabezados.map((item) => <th key={item} className="px-4 py-2 font-medium">{item}</th>)}</tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

function tonoVisita(valor: number, max: number) {
  if (!valor) return "bg-slate-50 text-slate-300";
  const peso = valor / max;
  if (peso > 0.75) return "bg-[#1D4ED8] text-white";
  if (peso > 0.5) return "bg-[#3B82F6] text-white";
  if (peso > 0.25) return "bg-[#93C5FD] text-slate-900";
  return "bg-[#DBEAFE] text-slate-900";
}

function Barra({ valor, max }: { valor: number; max: number }) {
  return (
    <span className="flex items-center gap-2">
      <span className="h-2 rounded-full bg-[#1D4ED8]" style={{ width: `${Math.max(8, (valor / max) * 120)}px` }} />
      <span className="tabular-nums">{valor}</span>
    </span>
  );
}

function Vacio() {
  return <p className="text-sm text-slate-500">No hay datos en el período elegido.</p>;
}
