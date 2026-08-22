import Image from "next/image";

export default function Hero() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0F172A] font-sans text-[#F8FAFC]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(29,78,216,0.14)_0%,_transparent_55%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(16,185,129,0.1)_0%,_transparent_45%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px 128px",
        }}
      />

      <nav className="sticky top-0 z-50 border-b border-white/5 bg-[#0F172A]/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <a href="/" className="flex items-center">
            <Image
              src="/logo-desarr.png"
              alt="Desarr Soluciones"
              width={1024}
              height={1024}
              className="h-26 w-auto sm:h-26"
              priority
            />
          </a>

          <div className="flex items-center gap-2 sm:gap-4">
            <button
              type="button"
              className="rounded-lg px-3 py-2 text-sm font-medium text-[#F8FAFC] transition-colors hover:bg-white/5 sm:px-4 sm:text-base"
            >
              Log In
            </button>
            <button
              type="button"
              className="rounded-lg bg-[#10B981] px-3 py-2 text-sm font-semibold text-[#0F172A] transition-colors hover:bg-[#34D399] sm:px-5 sm:text-base"
            >
              Regístrate
            </button>
          </div>
        </div>
      </nav>

      <section className="relative mx-auto flex min-h-[80vh] max-w-4xl flex-col items-center justify-center px-4 py-16 text-center sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl">
          Transformamos tu presente, para escalar tu{" "}
          <span className="text-[#10B981]">futuro</span>
        </h1>

        <h2 className="mt-5 max-w-2xl text-base font-normal text-gray-400 sm:mt-6 sm:text-xl">
          Business Intelligence • Automatización de Procesos • Arquitectura de
          Datos
        </h2>

        <button
          type="button"
          className="mt-10 rounded-lg bg-[#1D4ED8] px-8 py-4 text-base font-semibold text-white shadow-lg shadow-[#1D4ED8]/25 transition-all duration-300 hover:bg-[#2563EB] hover:shadow-[#1D4ED8]/40 sm:mt-12 sm:px-10 sm:py-4 sm:text-lg"
        >
          Realizar Auditoría Tecnológica
        </button>
      </section>
    </div>
  );
}
