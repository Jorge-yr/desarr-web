"use client";

import { useState } from "react";
import PhoneCountrySelect, {
  formatPhoneNumber,
} from "@/components/PhoneCountrySelect";

interface RegistroFormData {
  fullName: string;
  email: string;
  phoneCountryCode: string;
  phoneNumber: string;
  company: string;
  contactHourStart: number;
  contactHourEnd: number;
}

const INPUT_CLASS =
  "w-full rounded-lg border border-slate-300 bg-[#F8FAFC] px-4 py-3 text-[#0F172A] placeholder:text-slate-500 outline-none transition-colors focus:border-[#10B981] focus:ring-2 focus:ring-[#10B981]/20";

const RANGE_CLASS =
  "h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-700 accent-[#10B981]";

const EMPTY_FORM: RegistroFormData = {
  fullName: "",
  email: "",
  phoneCountryCode: "+549",
  phoneNumber: "",
  company: "",
  contactHourStart: 9,
  contactHourEnd: 18,
};

function formatHour(hour: number): string {
  return `${String(hour).padStart(2, "0")}:00`;
}

export default function RegistroForm() {
  const [form, setForm] = useState<RegistroFormData>(EMPTY_FORM);
  const [submitState, setSubmitState] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const handleStartChange = (value: number) => {
    setForm((prev) => ({
      ...prev,
      contactHourStart: value,
      contactHourEnd: Math.max(value, prev.contactHourEnd),
    }));
  };

  const handleEndChange = (value: number) => {
    setForm((prev) => ({
      ...prev,
      contactHourEnd: value,
      contactHourStart: Math.min(value, prev.contactHourStart),
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitState("loading");

    const whatsapp = formatPhoneNumber(form.phoneCountryCode, form.phoneNumber);
    const contactTimeRange = `${formatHour(form.contactHourStart)} — ${formatHour(form.contactHourEnd)}`;

    try {
      const response = await fetch("/api/registro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.fullName,
          email: form.email,
          whatsapp,
          phoneCountryCode: form.phoneCountryCode,
          phoneNumber: form.phoneNumber,
          company: form.company,
          contactTimeRange,
          contactHourStart: form.contactHourStart,
          contactHourEnd: form.contactHourEnd,
        }),
      });

      if (!response.ok) throw new Error("Submit failed");

      setSubmitState("success");
      setForm(EMPTY_FORM);
    } catch {
      setSubmitState("error");
    }
  };

  return (
    <section className="relative mx-auto w-full max-w-lg px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="text-center">
        <p className="text-sm font-medium uppercase tracking-wider text-[#10B981]">
          Registro
        </p>
        <h1 className="mt-2 text-2xl font-bold text-[#F8FAFC] sm:text-3xl">
          Creá tu cuenta en Desarr Soluciones
        </h1>
        <p className="mt-3 text-sm text-slate-400 sm:text-base">
          Completá tus datos y un consultor se pondrá en contacto contigo.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-10 space-y-5 rounded-2xl border border-[#1E293B] bg-slate-900/40 p-6 shadow-xl shadow-black/20 sm:p-8"
      >
        <label className="block">
          <span className="mb-1.5 block text-sm text-slate-300">Nombre</span>
          <input
            required
            type="text"
            value={form.fullName}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, fullName: e.target.value }))
            }
            className={INPUT_CLASS}
            placeholder="Tu nombre completo"
            autoComplete="name"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm text-slate-300">Email</span>
          <input
            required
            type="email"
            value={form.email}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, email: e.target.value }))
            }
            className={INPUT_CLASS}
            placeholder="nombre@empresa.com"
            autoComplete="email"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm text-slate-300">WhatsApp</span>
          <div className="flex gap-2">
            <PhoneCountrySelect
              value={form.phoneCountryCode}
              onChange={(code) =>
                setForm((prev) => ({ ...prev, phoneCountryCode: code }))
              }
            />
            <input
              required
              type="tel"
              value={form.phoneNumber}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, phoneNumber: e.target.value }))
              }
              className={INPUT_CLASS}
              placeholder="11 0000 0000"
              autoComplete="tel-national"
            />
          </div>
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm text-slate-300">Empresa</span>
          <input
            required
            type="text"
            value={form.company}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, company: e.target.value }))
            }
            className={INPUT_CLASS}
            placeholder="Nombre de tu organización"
            autoComplete="organization"
          />
        </label>

        <fieldset className="block space-y-4 rounded-xl border border-[#1E293B] bg-slate-900/30 p-4">
          <legend className="px-1 text-sm text-slate-300">
            Horario de preferencia para el contacto
          </legend>

          <p className="text-center text-sm font-medium text-[#10B981]">
            {formatHour(form.contactHourStart)} — {formatHour(form.contactHourEnd)} hs
          </p>

          <div>
            <div className="mb-1.5 flex items-center justify-between text-xs text-slate-500">
              <span>Desde</span>
              <span>{formatHour(form.contactHourStart)}</span>
            </div>
            <input
              type="range"
              min={8}
              max={20}
              step={1}
              value={form.contactHourStart}
              onChange={(e) => handleStartChange(Number(e.target.value))}
              className={RANGE_CLASS}
              aria-label="Hora de inicio preferida para contacto"
            />
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between text-xs text-slate-500">
              <span>Hasta</span>
              <span>{formatHour(form.contactHourEnd)}</span>
            </div>
            <input
              type="range"
              min={8}
              max={20}
              step={1}
              value={form.contactHourEnd}
              onChange={(e) => handleEndChange(Number(e.target.value))}
              className={RANGE_CLASS}
              aria-label="Hora de fin preferida para contacto"
            />
          </div>
        </fieldset>

        <button
          type="submit"
          disabled={submitState === "loading" || submitState === "success"}
          className="w-full rounded-lg bg-[#1D4ED8] px-6 py-4 text-base font-semibold text-white transition-all duration-300 hover:bg-[#2563EB] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitState === "loading" ? "Enviando..." : "Registrarme"}
        </button>

        {submitState === "success" && (
          <p className="rounded-lg border border-[#10B981]/30 bg-[#10B981]/10 px-4 py-3 text-sm text-[#10B981]">
            ¡Registro enviado! Te contactaremos pronto.
          </p>
        )}

        {submitState === "error" && (
          <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            Hubo un error al enviar. Por favor, intentá nuevamente.
          </p>
        )}
      </form>
    </section>
  );
}
