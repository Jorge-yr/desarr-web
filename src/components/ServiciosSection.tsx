import Link from "next/link";
import type { ReactNode } from "react";

const WHATSAPP_BASE = "https://wa.me/5493794001206?text=";

function whatsappLink(mensaje: string) {
  return WHATSAPP_BASE + encodeURIComponent(mensaje);
}

type Solucion = {
  tag: string;
  pain: string;
  title: string;
  items: string[];
  accent: string;
  iconBg: string;
  icon: ReactNode;
};

const SOLUCIONES: Solucion[] = [
  {
    tag: "Solución estrella",
    pain: "“Pasamos horas cruzando extractos, Mercado Pago y el posnet.”",
    title: "Conciliaciones y cierre sin planillas",
    items: [
      "Conciliación de bancos y pasarelas de pago (MP, posnet, e-commerce).",
      "Lectura de facturas y tickets con IA.",
      "Todo entregado listo a tu estudio contable.",
    ],
    accent: "text-[#34D399]",
    iconBg: "bg-[#06281F]",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" aria-hidden="true">
        <path d="M4 7h11M12 4l3 3-3 3M20 17H9M12 14l-3 3 3 3" />
      </svg>
    ),
  },
  {
    tag: "Integración",
    pain: "“Copiamos y pegamos datos de un sistema a otro todos los días.”",
    title: "Sistemas conectados, datos en orden",
    items: [
      "Conectamos POS, tienda online, ERP/CRM y planillas.",
      "Una única fuente de verdad de clientes, proveedores y ventas.",
      "Se terminan los datos duplicados y la carga manual.",
    ],
    accent: "text-[#22D3EE]",
    iconBg: "bg-[#082F3B]",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" aria-hidden="true">
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
        <path d="M10 6.5h4a3 3 0 0 1 3 3V14M14 17.5h-4a3 3 0 0 1-3-3V10" />
      </svg>
    ),
  },
  {
    tag: "Inteligencia de negocio",
    pain: "“No sé cuánto gano realmente hasta que cierra el mes.”",
    title: "Tableros para decidir",
    items: [
      "Salud financiera: rentabilidad, márgenes y flujo de caja.",
      "Rendimiento comercial por sucursal, vendedor y producto.",
      "Reporte de cierre mensual automático.",
      "Inteligencia de precios: la competencia cruzada con tus márgenes.",
    ],
    accent: "text-[#60A5FA]",
    iconBg: "bg-[#0E1F4D]",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" aria-hidden="true">
        <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
      </svg>
    ),
  },
  {
    tag: "A medida",
    pain: "“Ningún sistema se adapta a cómo trabajamos.”",
    title: "Apps de gestión a medida",
    items: [
      "Caja y facturación: ingresos y egresos en tiempo real, con control del mostrador.",
      "Control de inventario desde el celular, con alertas automáticas de reposición.",
      "Todo lo que se carga alimenta tus tableros.",
    ],
    accent: "text-[#A5B4FC]",
    iconBg: "bg-[#1B2540]",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" aria-hidden="true">
        <rect x="6" y="2" width="12" height="20" rx="2.5" />
        <path d="M10 18h4M9 7h6M9 11h4" />
      </svg>
    ),
  },
];

type Plan = {
  name: string;
  caption: string;
  items: string[];
  featured?: boolean;
};

const PLANES: Plan[] = [
  {
    name: "Continuidad",
    caption: "Para que lo implementado no se caiga nunca.",
    items: ["Mantenimiento y monitoreo", "Soporte", "Ajustes ante cambios de APIs"],
  },
  {
    name: "Evolución Analítica",
    caption: "Para decidir con información nueva cada mes.",
    items: ["Todo lo de Continuidad", "Tableros y reportes nuevos", "Reunión mensual de análisis"],
    featured: true,
  },
  {
    name: "Arquitectura Integral",
    caption: "Para crecer con nuevas automatizaciones.",
    items: ["Todo lo de Evolución Analítica", "Automatizaciones nuevas", "Prioridad y SLA garantizado"],
  },
];

export default function ServiciosSection() {
  return (
    <main className="text-[#F8FAFC]">
      {/* Encabezado */}
      <section className="mx-auto max-w-6xl px-4 pb-14 pt-16 sm:px-6 sm:pt-24 lg:px-8">
        <span className="inline-block rounded-full border border-[#164E63] bg-[#0C2A3A] px-3.5 py-2 text-xs font-semibold uppercase tracking-widest text-[#22D3EE]">
          Servicios
        </span>
        <h1 className="mt-6 max-w-4xl text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl">
          Menos planillas.{" "}
          <span className="bg-gradient-to-r from-[#60A5FA] via-[#22D3EE] to-[#34D399] bg-clip-text text-transparent">
            Más claridad para decidir.
          </span>
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-slate-300 sm:text-xl">
          Optimizamos tus procesos y tus datos para liberar tu tiempo y dar claridad a tu negocio. Pensamos como
          contadores y ejecutamos como desarrolladores.
        </p>
      </section>

      {/* Qué resolvemos */}
      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Qué resolvemos</h2>
          <p className="text-slate-400">Cuatro soluciones, un mismo objetivo: que tu operación funcione sola.</p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {SOLUCIONES.map((s) => (
            <article key={s.title} className="flex flex-col gap-4 rounded-2xl border border-[#1E2B45] bg-[#111C33] p-7 sm:p-9">
              <div className="flex items-center justify-between">
                <div className={`${s.iconBg} ${s.accent} flex h-12 w-12 items-center justify-center rounded-xl`}>{s.icon}</div>
                <span className={`${s.accent} text-xs font-semibold uppercase tracking-wider`}>{s.tag}</span>
              </div>
              <p className="text-sm italic text-slate-400">{s.pain}</p>
              <h3 className="text-2xl font-bold tracking-tight">{s.title}</h3>
              <ul className="list-disc space-y-2 pl-5 text-slate-300">
                {s.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      {/* Cómo trabajamos */}
      <section className="border-y border-slate-800 bg-[#0B1324]">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Cómo trabajamos</h2>
          <p className="mt-3 text-lg text-slate-400">Tres pasos, sin sorpresas.</p>
          <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="flex flex-col gap-4 rounded-2xl border border-[#1E2B45] bg-[#0F172A] p-8">
              <span className="text-4xl font-extrabold text-[#1E3A8A]">01</span>
              <h3 className="text-xl font-bold">Diagnóstico</h3>
              <p className="leading-relaxed text-slate-300">
                Empezás con el test online gratuito. Después, un diagnóstico profundo con prueba piloto para medir las
                horas que estás perdiendo.
              </p>
            </div>

            <div className="flex flex-col gap-4 rounded-2xl border border-[#1E2B45] bg-[#0F172A] p-8">
              <span className="text-4xl font-extrabold text-[#155E75]">02</span>
              <h3 className="text-xl font-bold">Implementación</h3>
              <div className="flex flex-col gap-1.5 rounded-xl border border-[#155E75] bg-[#082F3B] p-4">
                <div className="flex items-center gap-2 text-[#22D3EE]">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
                    <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z" />
                  </svg>
                  <span className="font-bold">Quick Win</span>
                </div>
                <p className="text-sm leading-relaxed text-slate-300">
                  Una solución rápida para un proceso concreto. La desarrollamos a tu medida, rápido y con una
                  inversión mínima.
                </p>
              </div>
              <div className="flex flex-col gap-1.5 rounded-xl border border-[#1E2B45] p-4">
                <span className="font-bold">Implementación completa</span>
                <p className="text-sm leading-relaxed text-slate-300">
                  Armamos tus automatizaciones, conexiones y tableros. Un único pago, calculado según lo que te ahorra.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-4 rounded-2xl border border-[#10B981] bg-[#0A1F1C] p-8">
              <div className="flex items-center justify-between">
                <span className="text-4xl font-extrabold text-[#047857]">03</span>
                <span className="rounded-full border border-[#047857] px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-[#34D399]">
                  Opcional
                </span>
              </div>
              <h3 className="text-xl font-bold">Departamento de Datos Externo</h3>
              <p className="leading-relaxed text-slate-300">
                Un abono mensual para que todo siga funcionando, se mantenga al día y crezca con tu negocio.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Planes de suscripción */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Tu Departamento de Datos, por suscripción</h2>
          <p className="mt-3 text-lg text-slate-400">Elegí el nivel de acompañamiento que necesita tu empresa.</p>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {PLANES.map((plan) => (
            <div
              key={plan.name}
              className={`flex flex-col gap-5 rounded-2xl p-8 ${
                plan.featured ? "border-2 border-[#1D4ED8] bg-[#0E1B3D]" : "border border-[#1E2B45] bg-[#111C33]"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-xl font-bold">{plan.name}</h3>
                {plan.featured && (
                  <span className="rounded-full bg-[#1D4ED8] px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-white">
                    Más elegido
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-400">{plan.caption}</p>
              <ul className="flex-grow list-disc space-y-2 pl-5 text-sm text-slate-300">
                {plan.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <Link
                href={whatsappLink(`Hola! Quiero consultar por el plan ${plan.name} de Desarr Soluciones.`)}
                target="_blank"
                rel="noopener noreferrer"
                className={`rounded-lg py-3 text-center text-sm font-semibold transition-colors ${
                  plan.featured
                    ? "bg-[#1D4ED8] text-white hover:bg-[#1E40AF]"
                    : "border border-slate-700 text-slate-100 hover:bg-white/5"
                }`}
              >
                Consultar
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Estudio contable + Casos */}
      <section className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 pb-20 sm:px-6 md:grid-cols-2 lg:px-8">
        <div className="flex items-start gap-5 rounded-2xl border border-[#1E2B45] bg-[#111C33] p-8">
          <svg viewBox="0 0 24 24" fill="none" stroke="#34D399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-9 w-9 flex-shrink-0" aria-hidden="true">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            <circle cx="9" cy="7" r="4" />
          </svg>
          <div>
            <h3 className="text-lg font-bold">Trabajamos junto a tu estudio contable</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">
              Le entregamos la información ordenada y conciliada, lista para liquidar.
            </p>
          </div>
        </div>
        <div className="flex flex-col items-start justify-between gap-5 rounded-2xl border border-[#1E2B45] bg-[#111C33] p-8 sm:flex-row sm:items-center">
          <div>
            <h3 className="text-lg font-bold">Mirá un caso real</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">Cómo lo implementamos en Clinex.</p>
          </div>
          <Link
            href="/casos-de-exito"
            className="whitespace-nowrap rounded-lg border border-[#22D3EE] px-5 py-2.5 text-sm font-semibold text-[#22D3EE] transition-colors hover:bg-[#22D3EE]/10"
          >
            Ver Casos de Éxito
          </Link>
        </div>
      </section>

      {/* Llamado final */}
      <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 rounded-3xl bg-gradient-to-br from-[#1D4ED8] via-[#0E7490] to-[#047857] p-8 sm:p-14 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              ¿Cuántas horas por mes pierde tu equipo?
            </h2>
            <p className="mt-3 text-lg text-sky-100">
              Hacé el Diagnóstico de Madurez Tecnológica gratis y descubrilo en 5 minutos.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <Link
              href="/auditoria-tecnologica"
              className="rounded-xl bg-white px-7 py-4 text-center font-bold text-[#0F172A] transition-colors hover:bg-slate-100"
            >
              Hacer el diagnóstico
            </Link>
            <Link
              href={whatsappLink("Hola! Me gustaría agendar una llamada con Desarr Soluciones.")}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-white px-7 py-4 text-center font-semibold text-white transition-colors hover:bg-white/10"
            >
              Agendar Llamada
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
