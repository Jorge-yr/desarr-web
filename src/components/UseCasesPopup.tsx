"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";

const USE_CASES_DESCRIPTION =
  "Este relevamiento te permite en 3 minutos evaluar 7 dimensiones clave de tu arquitectura operativa (desde el registro diario hasta la capacidad de escala). Al completar las preguntas, obtendrás una evaluación de madurez y los pasos estratégicos sugeridos para digitalizar y automatizar tus procesos sin fricción.";

export default function UseCasesPopup() {
  const [open, setOpen] = useState(false);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    if (!open) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full items-center justify-center rounded-xl border border-slate-700 bg-transparent px-8 py-4 text-base font-semibold text-slate-300 transition-all duration-300 hover:bg-slate-800/50 hover:text-white sm:w-auto sm:text-lg"
      >
        Ver Casos de Uso
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={descriptionId}
        >
          <div
            className="absolute inset-0 bg-[#0F172A]/80 backdrop-blur-sm"
            aria-hidden="true"
          />

          <div className="relative w-full max-w-lg rounded-2xl border border-slate-700/80 bg-[#0F172A] p-6 shadow-2xl shadow-black/40 sm:p-8">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
              aria-label="Cerrar"
            >
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>

            <h3
              id={titleId}
              className="pr-10 text-left text-xl font-semibold text-[#F8FAFC]"
            >
              Casos de Uso
            </h3>

            <p
              id={descriptionId}
              className="mt-4 text-left text-base leading-relaxed text-[#94A3B8]"
            >
              {USE_CASES_DESCRIPTION}
            </p>

            <div className="mt-8">
              <Link
                href="/auditoria-tecnologica"
                onClick={() => setOpen(false)}
                className="flex w-full items-center justify-center rounded-xl bg-[#1D4ED8] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#2563EB] sm:text-base"
              >
                Iniciar Diagnóstico de Madurez Tecnológica
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
