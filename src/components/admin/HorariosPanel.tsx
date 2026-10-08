"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { LinkParaPacientes } from "@/components/admin/LinkParaPacientes";
import { useAdminClinic } from "@/components/admin/AdminClinicContext";
import { guardarConfiguracionTurnero, leerConfiguracionTurnero } from "@/app/admin/horarios/actions";

const DAYS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"] as const;

const START_MIN = 7 * 60;
const END_MIN = 22 * 60;
const STEP = 30;

type Block = { dia: number; desde: string; hasta: string };

type Config = {
  duracionMin: number;
  diasAdelante: number;
  senaArs: number;
  slots: boolean[][];
};

function slotCount() {
  return (END_MIN - START_MIN) / STEP;
}

function emptySlots(): boolean[][] {
  return DAYS.map(() => Array.from({ length: slotCount() }, () => false));
}

function defaultConfig(): Config {
  const slots = emptySlots();
  for (let day = 0; day < 5; day++) {
    paintRange(slots, day, "09:00", "13:00");
    paintRange(slots, day, "16:00", "20:00");
  }
  return { duracionMin: 30, diasAdelante: 21, senaArs: 5000, slots };
}

function minutesToLabel(total: number) {
  const h = Math.floor(total / 60);
  const m = total % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function labelToIndex(label: string) {
  const [h, m] = label.split(":").map(Number);
  return (h * 60 + m - START_MIN) / STEP;
}

function paintRange(slots: boolean[][], day: number, desde: string, hasta: string) {
  const a = labelToIndex(desde);
  const b = labelToIndex(hasta);
  if (!Number.isFinite(a) || !Number.isFinite(b) || day < 0 || day >= slots.length) return;
  for (let i = Math.max(0, a); i < Math.min(slots[day].length, b); i++) slots[day][i] = true;
}

function blocksFromSlots(slots: boolean[][]): Block[] {
  const blocks: Block[] = [];
  slots.forEach((daySlots, dia) => {
    let start: number | null = null;
    daySlots.forEach((on, i) => {
      if (on && start === null) start = i;
      if (!on && start !== null) {
        blocks.push({
          dia,
          desde: minutesToLabel(START_MIN + start * STEP),
          hasta: minutesToLabel(START_MIN + i * STEP),
        });
        start = null;
      }
    });
    if (start !== null) {
      blocks.push({
        dia,
        desde: minutesToLabel(START_MIN + start * STEP),
        hasta: minutesToLabel(END_MIN),
      });
    }
  });
  return blocks;
}

function storageKey(idClinica: string) {
  return `turnero-horarios-${idClinica}`;
}

function loadAll(idClinica: string): Record<string, Config> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(storageKey(idClinica));
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, Config>;
  } catch {
    return {};
  }
}

export function HorariosPanel() {
  const clinic = useAdminClinic();
  const professionals = clinic.profesionales;
  const [profId, setProfId] = useState(professionals[0]?.id ?? "");
  const [configs, setConfigs] = useState<Record<string, Config>>(() => {
    const next: Record<string, Config> = {};
    for (const p of professionals) next[p.id] = defaultConfig();
    return next;
  });
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);
  const [errorGuardado, setErrorGuardado] = useState("");
  const drag = useRef<{ painting: boolean; active: boolean } | null>(null);

  useEffect(() => {
    if (professionals.length === 0) return;
    let cancelado = false;
    void (async () => {
      const stored = loadAll(clinic.idClinica);
      const remoto = await leerConfiguracionTurnero();
      if (cancelado) return;
      const next: Record<string, Config> = {};
      for (const p of professionals) {
        const config = remoto.configs.find((c) => c.idProfesional === p.id);
        const bloques = remoto.bloques.filter((b) => b.idProfesional === p.id);
        if (config) {
          const slots = emptySlots();
          for (const bloque of bloques) {
            const day = bloque.dia - 1;
            if (day >= 0 && day < slots.length) paintRange(slots, day, bloque.desde, bloque.hasta);
          }
          next[p.id] = {
            duracionMin: config.duracionMin,
            diasAdelante: config.diasAdelante,
            senaArs: config.senaArs,
            slots,
          };
        } else {
          next[p.id] = stored[p.id] ?? defaultConfig();
        }
      }
      setConfigs(next);
      setErrorGuardado(remoto.error ?? "");
      setProfId((actual) => (professionals.some((p) => p.id === actual) ? actual : professionals[0].id));
    })();
    return () => {
      cancelado = true;
    };
  }, [clinic.idClinica, professionals]);

  const config = configs[profId] ?? defaultConfig();
  const hours = useMemo(() => {
    const labels: string[] = [];
    for (let t = START_MIN; t < END_MIN; t += 60) labels.push(minutesToLabel(t));
    return labels;
  }, []);

  function update(partial: Partial<Config>) {
    setConfigs((prev) => ({ ...prev, [profId]: { ...prev[profId], ...partial } }));
    setSavedAt(null);
  }

  function setSlot(day: number, index: number, value: boolean) {
    setConfigs((prev) => {
      const current = prev[profId];
      const slots = current.slots.map((row) => row.slice());
      slots[day][index] = value;
      return { ...prev, [profId]: { ...current, slots } };
    });
    setSavedAt(null);
  }

  function onPointerDown(day: number, index: number) {
    const painting = !config.slots[day][index];
    drag.current = { painting, active: true };
    setSlot(day, index, painting);
  }

  function onPointerEnter(day: number, index: number) {
    if (!drag.current?.active) return;
    setSlot(day, index, drag.current.painting);
  }

  function endDrag() {
    if (drag.current) drag.current.active = false;
  }

  function clearDay(day: number) {
    setConfigs((prev) => {
      const current = prev[profId];
      const slots = current.slots.map((row) => row.slice());
      slots[day] = slots[day].map(() => false);
      return { ...prev, [profId]: { ...current, slots } };
    });
    setSavedAt(null);
  }

  async function save() {
    setGuardando(true);
    setErrorGuardado("");
    setSavedAt(null);
    const all = { ...configs, [profId]: config };
    localStorage.setItem(storageKey(clinic.idClinica), JSON.stringify(all));
    const bloques = blocksFromSlots(config.slots).map((b) => ({
      dia: b.dia + 1,
      desde: b.desde,
      hasta: b.hasta,
    }));
    const resultado = await guardarConfiguracionTurnero({
      idProfesional: profId,
      duracionMin: config.duracionMin,
      diasAdelante: config.diasAdelante,
      senaArs: config.senaArs,
      bloques,
    });
    setGuardando(false);
    if (resultado.error) {
      setErrorGuardado(resultado.error);
      return;
    }
    setSavedAt(new Date().toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" }));
  }

  const blocks = blocksFromSlots(config.slots);
  const prof = professionals.find((p) => p.id === profId) ?? professionals[0];

  if (!prof) {
    return <p className="p-6 text-sm text-slate-700">Esta clínica no tiene profesionales cargados.</p>;
  }

  return (
    <div
      className="min-h-full text-[#0F172A]"
      onPointerUp={endDrag}
      onPointerLeave={endDrag}
    >
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-end justify-between gap-4 px-6 py-5">
          <div>
            <Link href="/admin" className="text-xs font-medium uppercase tracking-wide text-[#1D4ED8] hover:underline">
              Panel · Gestionar turnero
            </Link>
            <h1 className="text-2xl font-bold tracking-tight">Gestión de horarios</h1>
            <p className="mt-1 text-sm text-slate-600">
              Panel de control del profesional. Pintá los rangos en los que atiende.
            </p>
          </div>
          <label className="flex min-w-64 flex-col gap-1 text-sm">
            <span className="font-medium text-slate-700">Profesional</span>
            <select
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-[#0F172A]"
              value={profId}
              onChange={(e) => {
                setProfId(e.target.value);
                setSavedAt(null);
                setErrorGuardado("");
              }}
            >
              {professionals.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nombre} — {p.especialidad}
                </option>
              ))}
            </select>
          </label>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-6 px-6 py-6 lg:grid-cols-[340px_1fr]">
        <div className="flex flex-col gap-4">
        <section className="h-fit rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-[#0F172A]">Reglas de negocio</h2>
          <p className="mt-1 text-xs text-slate-600">{prof.nombre}</p>
          <div className="mt-4 flex flex-col gap-4">
            <label className="flex flex-col gap-1 text-sm">
              <span>Duración del turno (minutos)</span>
              <input
                type="number"
                min={5}
                max={240}
                step={5}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-[#0F172A]"
                value={config.duracionMin}
                onChange={(e) => update({ duracionMin: Number(e.target.value) })}
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span>Mostrar turnos disponibles hasta X días hacia adelante</span>
              <input
                type="number"
                min={1}
                max={180}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-[#0F172A]"
                value={config.diasAdelante}
                onChange={(e) => update({ diasAdelante: Number(e.target.value) })}
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span>Importe de seña requerida (ARS)</span>
              <input
                type="number"
                min={0}
                step={100}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-[#0F172A]"
                value={config.senaArs}
                onChange={(e) => update({ senaArs: Number(e.target.value) })}
              />
            </label>
          </div>
          <button
            type="button"
            onClick={() => void save()}
            disabled={guardando}
            className="mt-6 w-full rounded-lg bg-[#1D4ED8] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#1e40af] disabled:opacity-60"
          >
            {guardando ? "Guardando…" : "Guardar configuración"}
          </button>
          {savedAt && (
            <p className="mt-3 text-xs text-[#10B981]">
              Guardada a las {savedAt} en Supabase. El paciente ya ve esta seña y estos horarios.
            </p>
          )}
          {errorGuardado && <p className="mt-3 text-xs text-red-700">{errorGuardado}</p>}
        </section>
        <LinkParaPacientes className="mt-0" />
        </div>

        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
            <h2 className="text-sm font-semibold">Semana de atención</h2>
            <p className="text-xs text-slate-600">Clic o arrastre para pintar. Volvé a pintar para borrar.</p>
          </div>
          <div className="overflow-x-auto">
            <div className="min-w-[720px] select-none p-3">
              <div className="grid grid-cols-[52px_repeat(7,1fr)] gap-1">
                <div />
                {DAYS.map((day, dayIndex) => (
                  <div key={day} className="px-1 pb-1 text-center">
                    <p className="text-xs font-semibold">{day.slice(0, 3)}</p>
                    <button
                      type="button"
                      className="text-[10px] text-slate-500 hover:text-[#0F172A]"
                      onClick={() => clearDay(dayIndex)}
                    >
                      limpiar
                    </button>
                  </div>
                ))}
                {hours.map((label) => {
                  const startIndex = (labelToIndex(label));
                  const cells = [0, 1];
                  return (
                    <div key={label} className="contents">
                      <div className="pr-1 text-right text-[10px] leading-none text-slate-400">{label}</div>
                      {DAYS.map((day, dayIndex) => (
                        <div key={`${day}-${label}`} className="grid grid-rows-2 gap-px">
                          {cells.map((offset) => {
                            const index = startIndex + offset;
                            const on = config.slots[dayIndex]?.[index];
                            return (
                              <button
                                key={offset}
                                type="button"
                                aria-label={`${day} ${minutesToLabel(START_MIN + index * STEP)}`}
                                aria-pressed={on}
                                className={`h-4 rounded-sm ${on ? "bg-[#1D4ED8]" : "bg-slate-100 hover:bg-slate-200"}`}
                                onPointerDown={() => onPointerDown(dayIndex, index)}
                                onPointerEnter={() => onPointerEnter(dayIndex, index)}
                              />
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="border-t border-slate-200 px-4 py-3">
            <p className="text-xs font-medium text-slate-700">Rangos</p>
            {blocks.length === 0 ? (
              <p className="mt-1 text-xs text-slate-400">Sin horarios pintados.</p>
            ) : (
              <ul className="mt-2 flex flex-wrap gap-2">
                {blocks.map((b) => (
                  <li
                    key={`${b.dia}-${b.desde}`}
                    className="rounded-full bg-[#1D4ED8]/10 px-2.5 py-1 text-xs font-medium text-[#1D4ED8]"
                  >
                    {DAYS[b.dia].slice(0, 3)} {b.desde}–{b.hasta}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
