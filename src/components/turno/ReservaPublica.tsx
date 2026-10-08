"use client";

import { useMemo, useState } from "react";
import type { ClinicaPublica } from "@/lib/supabase/public-clinic";

type Paso = "profesional" | "horario" | "dni" | "datos" | "listo";

export function ReservaPublica({ clinica }: { clinica: ClinicaPublica }) {
  const [paso, setPaso] = useState<Paso>("profesional");
  const [profId, setProfId] = useState("");
  const [slot, setSlot] = useState("");
  const [dni, setDni] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [nacimiento, setNacimiento] = useState("");
  const [nuevo, setNuevo] = useState(false);
  const [idTurno, setIdTurno] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [errorTurno, setErrorTurno] = useState("");
  const [pagando, setPagando] = useState(false);
  const [errorPago, setErrorPago] = useState("");

  const profesional = clinica.profesionales.find((p) => p.id === profId);
  const huecos = clinica.huecos[profId] ?? [];
  const elegido = huecos.find((h) => h.inicio === slot);
  const dias = useMemo(() => {
    const groups = new Map<string, { label: string; items: typeof huecos }>();
    for (const hueco of huecos) {
      const date = new Date(hueco.inicio);
      const key = date.toLocaleDateString("en-CA");
      const label = date.toLocaleDateString("es-AR", {
        weekday: "short",
        day: "numeric",
        month: "short",
      });
      const current = groups.get(key) ?? { label, items: [] };
      current.items.push(hueco);
      groups.set(key, current);
    }
    return [...groups.entries()].sort((a, b) => b[0].localeCompare(a[0]));
  }, [huecos]);

  async function reservar(datosNuevos: boolean) {
    const limpio = dni.replace(/\D/g, "");
    if (limpio.length < 7 || !slot) return;
    setGuardando(true);
    setErrorTurno("");
    try {
      const response = await fetch("/api/turno/reservar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idClinica: clinica.idClinica,
          idProfesional: profId,
          inicio: slot,
          duracionMin: profesional?.duracionMin ?? clinica.duracionMin,
          dni: limpio,
          nombre: datosNuevos ? nombre : "",
          apellido: datosNuevos ? apellido : "",
          whatsapp: datosNuevos ? whatsapp : "",
          nacimiento: datosNuevos ? nacimiento : "",
        }),
      });
      const data = (await response.json()) as { idTurno?: string; needsData?: boolean; error?: string };
      if (data.needsData) {
        setNuevo(true);
        setPaso("datos");
        return;
      }
      if (!response.ok || !data.idTurno) {
        setErrorTurno(data.error ?? "No se pudo guardar el turno.");
        return;
      }
      setNuevo(datosNuevos);
      setIdTurno(data.idTurno);
      setPaso("listo");
    } catch {
      setErrorTurno("No se pudo guardar el turno.");
    } finally {
      setGuardando(false);
    }
  }

  function seguirDni() {
    void reservar(false);
  }

  async function pagar() {
    setPagando(true);
    setErrorPago("");
    try {
      const response = await fetch("/api/mercadopago/preferencia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idClinica: clinica.idClinica,
          idProfesional: profId,
          profesional: profesional?.nombre,
          clinica: clinica.nombre,
          duracionMin: profesional?.duracionMin ?? clinica.duracionMin,
          inicio: slot,
          dni,
          nombre,
          apellido,
          whatsapp,
          importe: profesional?.senaArs ?? clinica.senaArs,
          idTurno,
        }),
      });
      const data = (await response.json()) as { initPoint?: string; error?: string };
      if (!response.ok || !data.initPoint) {
        setErrorPago(data.error ?? "No se pudo abrir Mercado Pago.");
        setPagando(false);
        return;
      }
      window.location.href = data.initPoint;
    } catch {
      setErrorPago("No se pudo abrir Mercado Pago.");
      setPagando(false);
    }
  }

  return (
    <main className="mx-auto min-h-full max-w-lg bg-slate-100 px-4 py-8 text-slate-900">
      <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">Reservar turno</p>
      <h1 className="mt-1 text-2xl font-semibold tracking-tight">{clinica.nombre}</h1>
      {clinica.aviso && <p className="mt-3 text-sm text-slate-500">{clinica.aviso}</p>}

      {paso === "profesional" && (
        <section className="mt-6 flex flex-col gap-3">
          <h2 className="text-sm font-medium text-slate-600">Elegí profesional</h2>
          {clinica.profesionales.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => {
                setProfId(p.id);
                setSlot("");
                setPaso("horario");
              }}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-4 text-left font-medium shadow-sm"
            >
              {p.nombre}
            </button>
          ))}
        </section>
      )}

      {paso === "horario" && (
        <section className="mt-6">
          <button type="button" className="text-sm text-teal-800" onClick={() => setPaso("profesional")}>
            Cambiar profesional
          </button>
          <h2 className="mt-3 text-sm font-medium text-slate-600">{profesional?.nombre}</h2>
          <p className="mt-1 text-xs text-slate-500">
            Se muestran los huecos libres. Un turno ocupado o pendiente no aparece.
          </p>
          <div className="mt-4 flex flex-col gap-4">
            {dias.length === 0 && <p className="text-sm text-slate-500">No hay horarios disponibles.</p>}
            {dias.map(([dia, grupo]) => (
              <div key={dia}>
                <p className="text-xs font-semibold uppercase text-slate-400">{grupo.label}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {grupo.items.map((item) => (
                    <button
                      key={item.inicio}
                      type="button"
                      onClick={() => {
                        setSlot(item.inicio);
                        setPaso("dni");
                      }}
                      className="rounded-full bg-white px-3 py-2 text-sm shadow-sm ring-1 ring-slate-200"
                    >
                      {new Date(item.inicio).toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {paso === "dni" && (
        <section className="mt-6">
          <button type="button" className="text-sm text-teal-800" onClick={() => setPaso("horario")}>
            Cambiar horario
          </button>
          <p className="mt-3 text-sm text-slate-600">{profesional?.nombre}</p>
          <p className="text-sm font-medium">{elegido?.etiqueta}</p>
          <label className="mt-4 flex flex-col gap-1 text-sm">
            <span>DNI</span>
            <input
              inputMode="numeric"
              value={dni}
              onChange={(e) => setDni(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-3 text-base"
            />
          </label>
          <button
            type="button"
            onClick={seguirDni}
            disabled={guardando}
            className="mt-4 w-full rounded-lg bg-teal-700 px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
          >
            {guardando ? "Guardando turno…" : "Continuar"}
          </button>
          {errorTurno && <p className="mt-3 text-sm text-red-700">{errorTurno}</p>}
        </section>
      )}

      {paso === "datos" && (
        <section className="mt-6 flex flex-col gap-3">
          <p className="text-sm text-slate-600">No encontramos ese DNI en esta clínica. Completá tus datos.</p>
          <input
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-3"
          />
          <input
            placeholder="Apellido"
            value={apellido}
            onChange={(e) => setApellido(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-3"
          />
          <input
            placeholder="WhatsApp"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-3"
          />
          <label className="flex flex-col gap-1 text-sm text-slate-600">
            <span>Fecha de nacimiento</span>
            <input
              type="date"
              value={nacimiento}
              max={new Date().toISOString().slice(0, 10)}
              onChange={(e) => setNacimiento(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-3"
            />
          </label>
          <button
            type="button"
            disabled={!nombre.trim() || !apellido.trim() || whatsapp.trim().length < 8 || !nacimiento || guardando}
            onClick={() => void reservar(true)}
            className="rounded-lg bg-teal-700 px-4 py-3 text-sm font-semibold text-white disabled:opacity-50"
          >
            {guardando ? "Guardando turno…" : "Continuar"}
          </button>
          {errorTurno && <p className="text-sm text-red-700">{errorTurno}</p>}
        </section>
      )}

      {paso === "listo" && (
        <section className="mt-6 rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold">Turno reservado para la seña</h2>
          <p className="mt-2 text-sm text-slate-600">{profesional?.nombre}</p>
          <p className="text-sm">{elegido?.etiqueta}</p>
          <p className="mt-2 text-sm">DNI {dni.replace(/\D/g, "")}</p>
          {nuevo && (
            <p className="text-sm">
              {nombre} {apellido} · {whatsapp} · {nacimiento}
            </p>
          )}
          <p className="mt-4 text-sm text-slate-500">
            Seña {(profesional?.senaArs ?? clinica.senaArs) > 0 ? `ARS ${profesional?.senaArs ?? clinica.senaArs}` : "sin importe configurado"}. El turno queda
            pendiente hasta que Mercado Pago acredite la seña.
          </p>
          {(profesional?.senaArs ?? clinica.senaArs) > 0 && (
            <button
              type="button"
              onClick={pagar}
              disabled={pagando || !idTurno}
              className="mt-4 w-full rounded-lg bg-teal-700 px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
            >
              {pagando ? "Abriendo Mercado Pago…" : "Pagar seña"}
            </button>
          )}
          {errorPago && <p className="mt-3 text-sm text-red-700">{errorPago}</p>}
        </section>
      )}
    </main>
  );
}
