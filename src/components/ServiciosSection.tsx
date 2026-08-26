const PILARES = [
  {
    name: "Inteligencia de Negocios (BI)",
    caption: "Tableros Interactivos y Reportes Claros",
    color: "bg-[#1D4ED8]",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8">
        <path d="M4 19V9M10 19V5M16 19v-7M22 19H2" />
      </svg>
    ),
  },
  {
    name: "Automatización de Procesos",
    caption: "Flujos Personalizados y Eficientes",
    color: "bg-[#10B981]",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8">
        <circle cx="6" cy="6" r="2.5" />
        <circle cx="18" cy="6" r="2.5" />
        <circle cx="12" cy="18" r="2.5" />
        <path d="M8.2 7.3 10.5 16M15.8 7.3 13.5 16M8.5 6h7" />
      </svg>
    ),
  },
  {
    name: "Arquitectura de Datos",
    caption: "Modelos de Datos Sólidos y Escalables",
    color: "bg-[#7C3AED]",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8">
        <ellipse cx="12" cy="6" rx="8" ry="3" />
        <path d="M4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6" />
        <path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" />
      </svg>
    ),
  },
];

const SERVICIOS = [
  {
    name: "Sistematización de Flujos de Caja y Facturación",
    category: "Eficientización Administrativa",
    badge: "bg-[#06B6D4]/10 text-[#06B6D4]",
    border: "border-l-4 border-l-[#06B6D4]",
    description:
      "Aplicaciones de gestión a medida para registrar ingresos y egresos en tiempo real, con control total del mostrador.",
  },
  {
    name: "Gestión y Trazabilidad de Inventarios",
    category: "Arquitectura de Datos",
    badge: "bg-[#7C3AED]/10 text-[#7C3AED]",
    border: "border-l-4 border-l-[#7C3AED]",
    description:
      "Bases de datos conectadas a apps móviles para auditar stock sin errores de tipeo y recibir alertas automáticas de reposición.",
  },
  {
    name: "Conciliación Bancaria y Contable Automatizada",
    category: "Automatización de Procesos",
    badge: "bg-[#10B981]/10 text-[#10B981]",
    border: "border-l-4 border-l-[#10B981]",
    description:
      "Flujos que capturan, limpian y cruzan tickets, extractos y sistemas automáticamente, entregando todo listo al estudio contable.",
  },
  {
    name: "Normalización de Bases de Datos de Clientes y Proveedores",
    category: "Arquitectura de Datos",
    badge: "bg-[#7C3AED]/10 text-[#7C3AED]",
    border: "border-l-4 border-l-[#7C3AED]",
    description:
      "Estructuras de datos confiables y centralizadas, para tener una única fuente de verdad comercial.",
  },
  {
    name: "Dashboards Directivos de Salud Financiera",
    category: "Business Intelligence",
    badge: "bg-[#1D4ED8]/10 text-[#1D4ED8]",
    border: "border-l-4 border-l-[#1D4ED8]",
    description:
      "Tableros ejecutivos en Power BI o Looker Studio que muestran rentabilidad, costos y márgenes de un solo vistazo.",
  },
  {
    name: "Sincronización de Sistemas Aislados",
    category: "Integración y Automatización",
    badge: "bg-[#F59E0B]/10 text-[#F59E0B]",
    border: "border-l-4 border-l-[#F59E0B]",
    description:
      "Conectamos tus plataformas por API o Make, para dejar de copiar y pegar información a mano entre sistemas.",
  },
  {
    name: "Automatización de Reportes de Gestión Mensual",
    category: "BI y Automatización",
    badge: "bg-[#1D4ED8]/10 text-[#1D4ED8]",
    border: "border-l-4 border-l-[#1D4ED8]",
    description:
      "Flujos ETL que alimentan tableros analíticos en tiempo real, sin armar el informe de cierre a mano cada mes.",
  },
  {
    name: "Inteligencia de Precios Competitivos",
    category: "Data Analytics Avanzado",
    badge: "bg-[#06B6D4]/10 text-[#06B6D4]",
    border: "border-l-4 border-l-[#06B6D4]",
    description:
      "Extracción automática de precios de la competencia (web scraping) para ajustar tus márgenes con agilidad.",
  },
  {
    name: "Tableros Analíticos de Rendimiento Comercial",
    category: "Business Intelligence",
    badge: "bg-[#1D4ED8]/10 text-[#1D4ED8]",
    border: "border-l-4 border-l-[#1D4ED8]",
    description:
      "Reportes interactivos que desagregan las ventas por sucursal, vendedor y producto, con conclusiones claras para decidir.",
  },
  {
    name: "Consultoría y Auditoría en Transformación Digital",
    category: "Servicio Integral",
    badge: "bg-[#7C3AED]/10 text-[#7C3AED]",
    border: "border-l-4 border-l-[#7C3AED]",
    description:
      "Auditoría de madurez tecnológica y un plan de acción a medida para escalar tu gestión de forma sostenible.",
  },
];

export default function ServiciosSection() {
  return (
    <main className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-14 text-center">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-[#10B981]">
          Servicios
        </p>
        <h1 className="text-4xl font-extrabold tracking-tight text-[#F8FAFC] sm:text-5xl">
          Nuestros Pilares de Valor
        </h1>
      </div>

      <div className="mb-20 grid grid-cols-1 gap-6 sm:grid-cols-3">
        {PILARES.map((pilar) => (
          <div key={pilar.name} className={`${pilar.color} rounded-2xl p-6 text-white shadow-lg`}>
            <div className="mb-4">{pilar.icon}</div>
            <h3 className="mb-2 text-lg font-bold">{pilar.name}</h3>
            <p className="text-sm text-white/85">{pilar.caption}</p>
          </div>
        ))}
      </div>

      <div className="mb-14 text-center">
        <h2 className="text-3xl font-extrabold tracking-tight text-[#F8FAFC] sm:text-4xl">
          Qué Hacemos
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-[#94A3B8]">
          Un portfolio de soluciones a medida, pensado para las necesidades reales de una PyME.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {SERVICIOS.map((servicio) => (
          <div
            key={servicio.name}
            className={`${servicio.border} rounded-2xl bg-slate-800/30 p-6`}
          >
            <span className={`${servicio.badge} mb-3 inline-block rounded-full px-3 py-1 text-xs font-semibold`}>
              {servicio.category}
            </span>
            <h3 className="mb-2 text-lg font-bold text-[#F8FAFC]">{servicio.name}</h3>
            <p className="text-sm text-[#94A3B8]">{servicio.description}</p>
          </div>
        ))}
      </div>

      <div className="mt-16 rounded-2xl border border-[#7C3AED]/30 bg-slate-800/30 p-6 sm:p-10">
        <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-[#7C3AED]">
              Caso de ejemplo
            </p>
            <h3 className="mb-4 text-2xl font-bold text-[#F8FAFC]">Clinex</h3>
            <p className="text-[#94A3B8]">
              Una app a medida que desarrollamos para digitalizar y ordenar procesos puntuales del negocio: un ejemplo de cómo una solución hecha a medida resuelve una necesidad específica.
            </p>
          </div>
          <div className="mx-auto aspect-[9/16] w-full max-w-[280px] overflow-hidden rounded-xl bg-black">
            <iframe
              src="https://www.youtube.com/embed/NE2UM285Ntw"
              title="Clinex - Desarr Soluciones"
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </main>
  );
}
