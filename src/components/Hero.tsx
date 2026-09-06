import Link from "next/link";

const DMT_VIGNETTES = [
  {
    label: "Tiempo requerido",
    value: "3 minutos.",
  },
  {
    label: "Entregable",
    value: "Radiografía inmediata de cuellos de botella y fugas operativas.",
  },
  {
    label: "Costo / Compromiso",
    value: "100% online y sin costo.",
  },
] as const;

function DMTDependencyTree() {
  return (
    <div
      className="mt-8 w-full max-w-xl"
      aria-label="Detalles del diagnóstico de madurez tecnológica"
    >
      <div className="hidden sm:block">
        <div className="mx-auto h-5 w-px bg-gradient-to-b from-[#1D4ED8]/50 to-slate-700/80" />
        <div className="relative mt-0 px-3">
          <div className="absolute left-[12%] right-[12%] top-0 h-px bg-slate-700/70" />
          <ul className="grid grid-cols-3 gap-3 pt-3">
            {DMT_VIGNETTES.map((item) => (
              <li key={item.label} className="flex flex-col items-center text-center">
                <div className="flex flex-col items-center">
                  <div className="h-3 w-px bg-slate-700/70" />
                  <span className="mt-1 h-2 w-2 rounded-full border border-[#10B981]/35 bg-[#10B981]/10" />
                </div>
                <p className="mt-2 text-[11px] leading-snug text-slate-500">
                  <span className="block font-medium text-slate-400">{item.label}</span>
                  <span className="mt-0.5 block text-slate-500">{item.value}</span>
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <ul className="space-y-0 sm:hidden">
        {DMT_VIGNETTES.map((item, index) => {
          const isLast = index === DMT_VIGNETTES.length - 1;

          return (
            <li key={item.label} className="flex gap-3">
              <div className="flex flex-col items-center pt-1">
                <span className="h-2 w-2 shrink-0 rounded-full border border-[#10B981]/35 bg-[#10B981]/10" />
                {!isLast && (
                  <span className="mt-1 w-px flex-1 min-h-6 bg-slate-700/70" />
                )}
              </div>
              <p className="pb-4 text-xs leading-relaxed text-slate-500">
                <span className="font-medium text-slate-400">{item.label}:</span>{" "}
                {item.value}
              </p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#0F172A] font-sans text-[#F8FAFC] selection:bg-[#1D4ED8] selection:text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900/50 via-[#0F172A] to-[#0F172A]"
      />

      <div className="relative mx-auto flex min-h-[85vh] max-w-5xl flex-col items-center justify-center px-4 py-20 text-center sm:px-6 lg:px-8">
        <div className="mb-8 inline-flex items-center rounded-full border border-slate-700/60 bg-slate-800/40 px-4 py-1.5 text-sm font-medium text-slate-300 backdrop-blur-sm">
          Consultoría B2B • Datos & Procesos
        </div>

        <h1 className="text-5xl font-extrabold leading-tight tracking-tight text-[#F8FAFC] sm:text-6xl lg:text-7xl">
          Transformamos tu presente, <br className="hidden md:block" />
          para escalar tu <span className="text-[#10B981]">futuro</span>.
        </h1>

        <h2 className="mx-auto mt-6 max-w-3xl text-center text-xl font-normal text-[#94A3B8] sm:mt-8 sm:text-2xl">
          Liberamos a tu equipo del trabajo manual orquestando flujos de datos
          automatizados, precisos y mejoramos tu inteligencia de negocios en tiempo
          real.
        </h2>

        {/* Separador Borde Láser */}
        <div
          aria-hidden="true"
          className="mx-auto my-12 h-px w-full max-w-3xl bg-gradient-to-r from-transparent via-slate-700/60 to-transparent"
        />

        <div className="mt-10 flex w-full flex-col items-center justify-center gap-4 sm:mt-12 sm:flex-row sm:items-start sm:justify-center sm:gap-6">
          <div className="flex w-full flex-col items-center sm:w-auto">
            <Link
              href="/auditoria-tecnologica"
              className="group relative flex w-full max-w-xl items-center justify-center gap-3 rounded-xl bg-[#1D4ED8] px-8 py-5 text-base font-semibold text-white shadow-[0_6px_0_#1e3a8a,0_15px_25px_rgba(29,78,216,0.4)] ring-1 ring-[#3B82F6]/40 transition-all duration-200 hover:bg-[#2563EB] hover:shadow-[0_6px_0_#1e3a8a,0_20px_35px_rgba(29,78,216,0.55)] hover:ring-[#60A5FA]/60 active:translate-y-1 active:shadow-[0_2px_0_#1e3a8a,0_8px_20px_rgba(29,78,216,0.35)] sm:w-auto sm:px-10 sm:text-lg"
            >
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute -inset-px rounded-xl bg-gradient-to-r from-[#1D4ED8]/0 via-[#10B981]/30 to-[#1D4ED8]/0 opacity-70 blur-sm"
            />

            <span className="absolute -top-3 right-4 animate-pulse rounded-full border border-[#10B981]/40 bg-[#10B981]/20 px-2.5 py-0.5 text-xs font-bold text-[#10B981]">
              GRATIS
            </span>

            <svg
              className="relative h-5 w-5 shrink-0 text-[#10B981] sm:h-6 sm:w-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>

            <span className="relative text-left leading-snug sm:text-center">
              Iniciar Diagnóstico Empresarial de Madurez Tecnológica
            </span>
            </Link>

            <DMTDependencyTree />
          </div>

          <Link
            href="/casos-de-uso"
            className="flex w-full items-center justify-center rounded-xl border border-slate-700 bg-transparent px-8 py-4 text-base font-semibold text-slate-300 transition-all duration-300 hover:bg-slate-800/50 hover:text-white sm:w-auto sm:text-lg"
          >
            Ver Casos de Uso
          </Link>
        </div>
      </div>
    </section>
  );
}
