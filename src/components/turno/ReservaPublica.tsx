"use client";

import { useEffect, useMemo, useState } from "react";
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
  const [initPoint, setInitPoint] = useState("");
  const [qrPago, setQrPago] = useState("");
  const [esEscritorio, setEsEscritorio] = useState(false);
  const [errorPago, setErrorPago] = useState("");

  const profesional = clinica.profesionales.find((p) => p.id === profId);
  const sena = profesional?.senaArs ?? clinica.senaArs;
  const huecos = clinica.huecos[profId] ?? [];
  const elegido = huecos.find((h) => h.inicio === slot);
  const dias = useMemo(() => {
    const groups = new Map<string, { label: string; items: typeof huecos }>();
    for (const hueco of huecos) {
      const date = new Date(hueco.inicio);
      const key = date.toLocaleDateString("en-CA", { timeZone: "America/Argentina/Buenos_Aires" });
      const label = date.toLocaleDateString("es-AR", {
        timeZone: "America/Argentina/Buenos_Aires",
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

  useEffect(() => {
    const movil = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
    setEsEscritorio(!movil);
  }, []);

  useEffect(() => {
    if (paso !== "listo" || sena <= 0 || !idTurno || initPoint) return;
    let cancelado = false;
    void (async () => {
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
            importe: sena,
            idTurno,
          }),
        });
        const data = (await response.json()) as { initPoint?: string; qr?: string; error?: string };
        if (cancelado) return;
        if (!response.ok || !data.initPoint) {
          setErrorPago(data.error ?? "No se pudo preparar el pago.");
          return;
        }
        setInitPoint(data.initPoint);
        setQrPago(data.qr ?? "");
      } catch {
        if (!cancelado) setErrorPago("No se pudo preparar el pago.");
      } finally {
        if (!cancelado) setPagando(false);
      }
    })();
    return () => {
      cancelado = true;
    };
  }, [paso, sena, idTurno, initPoint, clinica.idClinica, clinica.nombre, profId, profesional?.nombre, profesional?.duracionMin, clinica.duracionMin, slot, dni, nombre, apellido, whatsapp]);

  return (
    <main className="mx-auto min-h-full max-w-lg bg-slate-100 px-4 py-8 text-slate-900">
      <header className="text-center">
        <img src="/clinex.png" alt="Clinex" className="mx-auto h-16 w-auto" />
        <h1 className="mt-4 text-2xl font-semibold tracking-tight">
          Sistema de reserva de turnos
          <sup className="ml-0.5 text-xs">®</sup>
        </h1>
        <p className="mt-1 text-sm text-slate-600">Un producto de Desarr Soluciones.</p>
      </header>
      <p className="mt-6 text-lg font-semibold">{clinica.nombre}</p>
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
            En verde podés reservar. En gris el horario ya está tomado.
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
                      disabled={!item.libre}
                      onClick={() => {
                        if (!item.libre) return;
                        setSlot(item.inicio);
                        setPaso("dni");
                      }}
                      className={`rounded-full px-3 py-2 text-sm font-medium ${
                        item.libre
                          ? "bg-[#10B981] text-white"
                          : "cursor-not-allowed bg-slate-300 text-slate-500"
                      }`}
                    >
                      {new Date(item.inicio).toLocaleTimeString("es-AR", {
                        timeZone: "America/Argentina/Buenos_Aires",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
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
            Seña {sena > 0 ? `ARS ${sena}` : "sin importe configurado"}. El turno queda pendiente hasta que Mercado
            Pago acredite la seña.
          </p>
          {sena > 0 && (
            <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center">
              {initPoint ? (
                <a
                  href={initPoint}
                  className="rounded-lg bg-teal-700 px-4 py-3 text-center text-sm font-semibold text-white"
                >
                  Pagar seña
                </a>
              ) : (
                <p className="text-sm text-slate-500">{pagando ? "Preparando Mercado Pago…" : "El pago no está listo."}</p>
              )}
              {esEscritorio && qrPago && (
                <img src={qrPago} alt="QR para pagar la seña con el celular" className="h-36 w-36 rounded-lg bg-white" />
              )}
            </div>
          )}
          {esEscritorio && qrPago && (
            <p className="mt-3 text-xs text-slate-500">
              Si estás en una computadora, escaneá el QR con el celular. El pago entra en la cuenta de Mercado Pago de la clínica.
            </p>
          )}
          {errorPago && <p className="mt-3 text-sm text-red-700">{errorPago}</p>}
        </section>
      )}
      <footer className="mt-10 border-t border-slate-200 pt-6 text-center text-sm text-slate-600">
        <p className="font-semibold text-[#0F172A]">Desarr Soluciones</p>
        <p className="mt-2">
          <a href="mailto:desarrsoluciones@gmail.com" className="text-[#1D4ED8]">
            desarrsoluciones@gmail.com
          </a>
        </p>
        <p className="mt-1">
          <a href="https://instagram.com/desarrsoluciones" className="text-[#1D4ED8]" target="_blank" rel="noopener noreferrer">
            @desarrsoluciones
          </a>
        </p>
        <p className="mt-3">
          <a href="https://www.desarr.com" className="font-medium text-[#1D4ED8]">
            www.desarr.com
          </a>
        </p>
      </footer>
    </main>
  );
}
