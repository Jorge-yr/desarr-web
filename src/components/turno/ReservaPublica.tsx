"use client";

import { useEffect, useMemo, useState } from "react";
import type { ClinicaPublica } from "@/lib/supabase/public-clinic";
import { aplicarOcupados, type Ocupado } from "@/lib/turno/huecos";

type Paso = "profesional" | "horario" | "dni" | "datos" | "listo";

const DIAS_SEMANA = [
  { id: 1, label: "Lun" },
  { id: 2, label: "Mar" },
  { id: 3, label: "Mié" },
  { id: 4, label: "Jue" },
  { id: 5, label: "Vie" },
  { id: 6, label: "Sáb" },
  { id: 0, label: "Dom" },
] as const;

function minutosDe(hora: string) {
  if (!hora) return null;
  const [h, m] = hora.split(":").map(Number);
  if (!Number.isFinite(h) || !Number.isFinite(m)) return null;
  return h * 60 + m;
}

function diaSemanaEnArgentina(iso: string) {
  const nombre = new Date(iso).toLocaleDateString("en-US", {
    timeZone: "America/Argentina/Buenos_Aires",
    weekday: "short",
  });
  const indice = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(nombre);
  return indice;
}

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
  const [agendaEnMovil, setAgendaEnMovil] = useState(false);
  const [errorPago, setErrorPago] = useState("");
  const [ocupados, setOcupados] = useState<Ocupado[] | null>(null);
  const [avisoOcupados, setAvisoOcupados] = useState("");
  const [horaDesde, setHoraDesde] = useState("");
  const [horaHasta, setHoraHasta] = useState("");
  const [diasElegidos, setDiasElegidos] = useState<number[]>([]);

  const profesional = clinica.profesionales.find((p) => p.id === profId);
  const sena = profesional?.senaArs ?? clinica.senaArs;
  const huecosBase = clinica.huecos[profId] ?? [];
  const huecos = ocupados ? aplicarOcupados(huecosBase, ocupados, profesional?.duracionMin ?? clinica.duracionMin) : huecosBase;
  const elegido = huecos.find((h) => h.inicio === slot);
  const huecosVisibles = useMemo(() => {
    const desdeMin = minutosDe(horaDesde);
    const hastaMin = minutosDe(horaHasta);
    return huecos.filter((hueco) => {
      if (!hueco.libre) return false;
      const fecha = new Date(hueco.inicio);
      if (diasElegidos.length > 0 && !diasElegidos.includes(diaSemanaEnArgentina(hueco.inicio))) return false;
      const reloj = fecha.toLocaleTimeString("en-GB", {
        timeZone: "America/Argentina/Buenos_Aires",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
      const [hora, minuto] = reloj.split(":").map(Number);
      const marca = hora * 60 + minuto;
      if (desdeMin !== null && marca < desdeMin) return false;
      if (hastaMin !== null && marca >= hastaMin) return false;
      return true;
    });
  }, [huecos, diasElegidos, horaDesde, horaHasta]);
  const dias = useMemo(() => {
    const groups = new Map<string, { label: string; items: typeof huecosVisibles }>();
    for (const hueco of huecosVisibles) {
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
  }, [huecosVisibles]);

  useEffect(() => {
    if (!profId) return;
    const ctrl = new AbortController();
    setOcupados(null);
    setAvisoOcupados("");
    const duracion = profesional?.duracionMin ?? clinica.duracionMin;
    const params = new URLSearchParams({
      idClinica: clinica.idClinica,
      idProfesional: profId,
      duracionMin: String(duracion),
    });
    fetch(`/api/turno/ocupados?${params}`, { signal: ctrl.signal, cache: "no-store" })
      .then(async (res) => {
        const body = (await res.json()) as { ocupados?: Ocupado[]; error?: string };
        if (!res.ok) throw new Error(body.error || "No se pudieron leer los turnos.");
        setOcupados(body.ocupados ?? []);
      })
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setAvisoOcupados("No se pudieron marcar los horarios ya ocupados.");
        setOcupados([]);
      });
    return () => ctrl.abort();
  }, [profId, clinica.idClinica, clinica.duracionMin, profesional?.duracionMin]);

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
      const data = (await response.json()) as { idTurno?: string; nombre?: string; needsData?: boolean; error?: string };
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
      if (data.nombre?.trim()) setNombre(data.nombre.trim());
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

  function agregarAAgenda() {
    if (!slot) return;
    const inicio = new Date(slot);
    const minutos = profesional?.duracionMin ?? clinica.duracionMin;
    const fin = new Date(inicio.getTime() + minutos * 60_000);
    const marca = (fecha: Date) => fecha.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Clinex//Turno//ES",
      "CALSCALE:GREGORIAN",
      "BEGIN:VEVENT",
      `UID:${idTurno || inicio.toISOString()}@clinex`,
      `DTSTAMP:${marca(new Date())}`,
      `DTSTART:${marca(inicio)}`,
      `DTEND:${marca(fin)}`,
      `SUMMARY:Turno en ${clinica.nombre}`,
      `DESCRIPTION:Turno con ${profesional?.nombre ?? "la clínica"}. Pendiente de pago de seña.`,
      "BEGIN:VALARM",
      "TRIGGER:-P1D",
      "ACTION:DISPLAY",
      "DESCRIPTION:Tu turno es en 24 horas",
      "END:VALARM",
      "BEGIN:VALARM",
      "TRIGGER:-PT2H",
      "ACTION:DISPLAY",
      "DESCRIPTION:Tu turno es en 2 horas",
      "END:VALARM",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");
    const archivo = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(archivo);
    const enlace = document.createElement("a");
    enlace.href = url;
    enlace.download = "turno-clinex.ics";
    enlace.click();
    URL.revokeObjectURL(url);
  }

  useEffect(() => {
    const movil = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
    setEsEscritorio(!movil);
    setAgendaEnMovil(/Android|iPhone|iPad|iPod/i.test(navigator.userAgent));
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
      <p className="mt-6 text-xs font-semibold uppercase tracking-wide text-[#10B981]">Reservar turno:</p>
      <p className="mt-1 text-lg font-semibold">{clinica.nombre}</p>
      {paso === "listo" && <p className="mt-4 text-lg font-semibold">Hola: {nombre.trim()}</p>}
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
                setHoraDesde("");
                setHoraHasta("");
                setDiasElegidos([]);
                setPaso("horario");
              }}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-4 text-left font-medium shadow-sm"
            >
              <span className="block text-base">{p.nombre}</span>
            </button>
          ))}
        </section>
      )}

      {paso === "horario" && (
        <section className="mt-6">
          <button type="button" className="text-sm text-teal-800" onClick={() => setPaso("profesional")}>
            Cambiar profesional
          </button>
          <h2 className="mt-3 text-xl font-semibold text-slate-900">{profesional?.nombre}</h2>
          <p className="mt-1 text-xs text-slate-500">
            Solo se muestran los horarios libres. Si el rango no tiene lugar, no aparece ningún turno.
          </p>
          {avisoOcupados && <p className="mt-2 text-sm text-red-700">{avisoOcupados}</p>}
          <div className="mt-4 rounded-2xl border border-slate-300 bg-white p-4">
            <p className="text-xs font-medium text-slate-600">Día de la semana</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {DIAS_SEMANA.map((dia) => {
                const activo = diasElegidos.includes(dia.id);
                return (
                  <button
                    key={dia.id}
                    type="button"
                    aria-pressed={activo}
                    onClick={() =>
                      setDiasElegidos((actual) =>
                        actual.includes(dia.id) ? actual.filter((id) => id !== dia.id) : [...actual, dia.id],
                      )
                    }
                    className={`rounded-full border px-3 py-1.5 text-sm ${
                      activo ? "border-[#10B981] bg-[#10B981] text-white" : "border-slate-300 bg-white text-slate-700"
                    }`}
                  >
                    {dia.label}
                  </button>
                );
              })}
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <label className="flex flex-col gap-1 text-xs font-medium text-slate-600">
                Hora desde
                <input
                  type="time"
                  value={horaDesde}
                  onChange={(e) => setHoraDesde(e.target.value)}
                  className="rounded-lg border border-slate-300 bg-white px-2 py-2 text-sm"
                />
              </label>
              <label className="flex flex-col gap-1 text-xs font-medium text-slate-600">
                Hora hasta
                <input
                  type="time"
                  value={horaHasta}
                  onChange={(e) => setHoraHasta(e.target.value)}
                  className="rounded-lg border border-slate-300 bg-white px-2 py-2 text-sm"
                />
              </label>
            </div>
          </div>
          <div className="mt-4 flex flex-col gap-4">
            {ocupados === null && <p className="text-sm text-slate-500">Revisando turnos ocupados…</p>}
            {ocupados !== null && dias.length === 0 && <p className="text-sm text-slate-500">No hay horarios disponibles.</p>}
            {ocupados !== null && dias.map(([dia, grupo]) => (
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
                      className="rounded-full bg-[#10B981] px-3 py-2 text-sm font-medium text-white"
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
        <section className="mt-6">
          <button type="button" className="text-sm text-teal-800" onClick={() => setPaso("dni")}>
            Cambiar DNI
          </button>
          <p className="mt-3 text-sm text-slate-600">{profesional?.nombre}</p>
          <p className="text-sm font-medium">{elegido?.etiqueta}</p>
          <p className="mt-4 text-sm text-slate-600">
            Es tu primera vez en esta clínica. Completá tus datos para reservar el turno.
          </p>
          <label className="mt-4 flex flex-col gap-1 text-sm">
            <span>DNI</span>
            <input
              value={dni.replace(/\D/g, "")}
              readOnly
              className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-base text-slate-600"
            />
          </label>
          <label className="mt-4 flex flex-col gap-1 text-sm">
            <span>Nombre</span>
            <input
              autoComplete="given-name"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-3 text-base"
            />
          </label>
          <label className="mt-4 flex flex-col gap-1 text-sm">
            <span>Apellido</span>
            <input
              autoComplete="family-name"
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-3 text-base"
            />
          </label>
          <label className="mt-4 flex flex-col gap-1 text-sm">
            <span>WhatsApp</span>
            <input
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="Ej: 379 400-1206"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-3 text-base"
            />
          </label>
          <label className="mt-4 flex flex-col gap-1 text-sm">
            <span>Fecha de nacimiento</span>
            <input
              type="date"
              value={nacimiento}
              max={new Date().toISOString().slice(0, 10)}
              onChange={(e) => setNacimiento(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-3 text-base"
            />
          </label>
          <button
            type="button"
            disabled={!nombre.trim() || !apellido.trim() || whatsapp.trim().length < 8 || !nacimiento || guardando}
            onClick={() => void reservar(true)}
            className="mt-4 w-full rounded-lg bg-teal-700 px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
          >
            {guardando ? "Guardando turno…" : "Continuar"}
          </button>
          {errorTurno && <p className="mt-3 text-sm text-red-700">{errorTurno}</p>}
        </section>
      )}

      {paso === "listo" && (
        <section className="mt-4 rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="text-sm font-medium text-slate-800">Tu turno está Reservado en Estado pendiente de pago seña:</h2>
          <p className="mt-3 text-sm font-semibold text-slate-900">Profesional: {profesional?.nombre}</p>
          <p className="text-sm">{elegido?.etiqueta}</p>
          <p className="mt-2 text-sm">DNI {dni.replace(/\D/g, "")}</p>
          {nuevo && (
            <>
              <p className="text-sm">
                {nombre.trim()} {apellido.trim()}
              </p>
              <p className="text-sm text-slate-600">WhatsApp {whatsapp.trim()}</p>
            </>
          )}
          {agendaEnMovil && (
            <button
              type="button"
              onClick={agregarAAgenda}
              className="mt-4 rounded-lg bg-[#10B981] px-4 py-3 text-sm font-semibold text-white"
            >
              Agrega este evento a tu agenda
            </button>
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
