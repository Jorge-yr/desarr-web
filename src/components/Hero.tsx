import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0F172A] font-sans text-[#F8FAFC] selection:bg-[#1D4ED8] selection:text-white">
      {/* Gradiente Radial Sutil (Lienzo Mate Profundo) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900/50 via-[#0F172A] to-[#0F172A]"
      />

      {/* Navegación Superior (Sticky + Backdrop Blur) */}
      <nav className="sticky top-0 z-50 border-b border-white/5 bg-[#0F172A]/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          
          {/* Izquierda: Branding */}
          <Link
            href="/"
            className="flex items-center gap-3 transition-opacity hover:opacity-80"
          >
            <Image
              src="/logo.png"
              alt="Desarr Soluciones"
              width={40}
              height={40}
              className="object-contain"
              priority
            />
            <span className="text-xl font-bold tracking-tight">
              <span className="text-[#1D4ED8]">Desarr</span>{" "}
              <span className="text-[#10B981]">Soluciones</span>
            </span>
          </Link>

          {/* Centro: Enlaces Desktop */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="#servicios"
              className="text-sm font-medium text-slate-300 transition-colors hover:text-slate-200"
            >
              Servicios
            </Link>
            <Link
              href="#casos-de-exito"
              className="text-sm font-medium text-slate-300 transition-colors hover:text-slate-200"
            >
              Casos de Éxito
            </Link>
            <Link
              href="#auditoria"
              className="text-sm font-medium text-slate-300 transition-colors hover:text-slate-200"
            >
              Auditoría
            </Link>
          </div>

          {/* Derecha: Acciones B2B */}
          <div className="flex items-center gap-3 sm:gap-5">
            <Link
              href="/login"
              className="text-sm font-medium text-slate-300 transition-colors hover:text-white"
            >
              Log In
            </Link>
            <Link
              href="/registro"
              className="hidden rounded-lg border border-[#10B981]/40 bg-[#10B981]/10 px-4 py-2 text-sm font-medium text-[#10B981] transition-colors hover:bg-[#10B981]/20 sm:inline-flex"
            >
              Regístrate
            </Link>
            <Link
              href="/agendar"
              className="rounded-lg bg-[#1D4ED8] px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-600 sm:px-5"
            >
              Agendar Llamada
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section (Layout Centrado) */}
      <section className="relative mx-auto flex min-h-[85vh] max-w-5xl flex-col items-center justify-center px-4 py-20 text-center sm:px-6 lg:px-8">
        
        {/* Badge Superior */}
        <div className="mb-8 inline-flex items-center rounded-full border border-slate-700/60 bg-slate-800/40 px-4 py-1.5 text-sm font-medium text-slate-300 backdrop-blur-sm">
          Consultoría B2B • Datos & Procesos
        </div>

        {/* Titular Principal H1 */}
        <h1 className="text-5xl font-extrabold leading-tight tracking-tight text-[#F8FAFC] sm:text-6xl lg:text-7xl">
          Transformamos tu presente, <br className="hidden md:block" />
          para escalar tu <span className="text-[#10B981]">futuro</span>.
        </h1>

        {/* Subtítulo H2 */}
        <h2 className="mt-6 max-w-3xl text-xl font-normal text-[#94A3B8] sm:mt-8 sm:text-2xl">
          Business Intelligence • Automatización de Procesos • Arquitectura de Datos
        </h2>

        {/* Contenedor de CTAs */}
        <div className="mt-10 flex w-full flex-col items-center justify-center gap-4 sm:mt-12 sm:flex-row sm:gap-6">
          <Link
            href="/auditoria-tecnologica"
            className="flex w-full items-center justify-center rounded-lg bg-[#1D4ED8] px-8 py-4 text-base font-semibold text-white shadow-[0_0_20px_rgba(29,78,216,0.3)] transition-all duration-300 hover:bg-blue-600 hover:shadow-[0_0_30px_rgba(29,78,216,0.5)] sm:w-auto sm:text-lg"
          >
            Realizar Auditoría Tecnológica
          </Link>
          <Link
            href="/casos-de-uso"
            className="flex w-full items-center justify-center rounded-lg border border-slate-700 bg-transparent px-8 py-4 text-base font-semibold text-slate-300 transition-all duration-300 hover:bg-slate-800/50 hover:text-white sm:w-auto sm:text-lg"
          >
            Ver Casos de Uso
          </Link>
        </div>
      </section>
    </div>
  );
}