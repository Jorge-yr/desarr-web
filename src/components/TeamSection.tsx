"use client";
import Image from "next/image";

interface TechTag {
  name: string;
}

interface PartnerCardProps {
  name: string;
  role: string;
  pitch: string;
  bio: string;
  techStack: TechTag[];
  imageUrl: string;
}

const PARTNERS: PartnerCardProps[] = [
  {
    name: "Jorge Ramirez",
    role: "Managing Partner & Arquitecto de Datos",
    pitch: "Traduciendo la complejidad operativa en decisiones ejecutivas rentables.",
    bio: "Licenciado en Administración de Empresas con posgrado en Gestión Tecnológica y Vinculación. Miembro matriculado del CPCE Corrientes. Especialista en orquestar soluciones de Business Intelligence y Análisis Funcional en entornos corporativos multi-negocio, conectando la estrategia comercial y de retail con arquitecturas de datos inquebrantables.",
    techStack: [
      { name: "Power BI" },
      { name: "SQL" },
      { name: "Python" },
      { name: "Make" },
      { name: "Power Automate" },
    ],
    imageUrl: "/team/jorge-ramirez.jpg",
  },
  {
    name: "Maria Sol Romaniuk",
    role: "Managing Partner & Especialista en Procesos Administrativos",
    pitch: "Donde otros ven números sueltos, yo construyo el sistema que los conecta.",
    bio: "Contadora Pública con posgrado en Especialización en Tributación. Especialista en transformar operaciones administrativas y contables dispersas en estructuras únicas, capaces de sostener la toma de decisiones diaria. Su enfoque combina rigor contable-impositivo con desarrollo de herramientas propias de automatización, llevando la conciliación y facturación del trabajo manual al proceso inteligente.",
    techStack: [
      { name: "QuickBooks" },
      { name: "Odoo" },
      { name: "Excel Avanzado" },
      { name: "SQL" },
      { name: "Google Apps Script" },
    ],
    imageUrl: "/team/maria-sol.jpg",
  },
];

function PartnerCard({ partner }: { partner: PartnerCardProps }) {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-[#1E293B] bg-slate-900/40 p-6 transition-all duration-300 hover:border-[#1D4ED8]/50 hover:bg-slate-900/60 hover:shadow-[0_0_30px_rgba(29,78,216,0.15)] sm:p-8">
      <div className="absolute -top-24 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-[#1D4ED8] opacity-0 blur-[80px] transition-opacity duration-500 group-hover:opacity-20" />
      <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-slate-700 bg-slate-800 sm:h-32 sm:w-32">
          <Image
            src={partner.imageUrl}
            alt={`Fotografía de ${partner.name}`}
            fill
            className="object-cover object-center grayscale transition-all duration-500 group-hover:grayscale-0"
          />
        </div>
        <div className="flex-1">
          <h3 className="text-2xl font-bold tracking-tight text-[#F8FAFC]">
            {partner.name}
          </h3>
          <p className="mt-1 font-medium text-[#10B981]">
            {partner.role}
          </p>
          <blockquote className="mt-4 border-l-2 border-[#1D4ED8] pl-4 text-sm italic text-slate-300 sm:text-base">
            "{partner.pitch}"
          </blockquote>
          <p className="mt-4 text-sm leading-relaxed text-slate-400 sm:text-base">
            {partner.bio}
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {partner.techStack.map((tech) => (
              <span
                key={tech.name}
                className="inline-flex items-center rounded-md border border-[#1D4ED8]/30 bg-[#1D4ED8]/10 px-2.5 py-1 text-xs font-semibold text-[#93C5FD] transition-colors group-hover:border-[#1D4ED8]/50 group-hover:bg-[#1D4ED8]/20"
              >
                {tech.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TeamSection() {
  return (
    <section className="bg-[#0F172A] px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 max-w-2xl">
          <h2 className="text-sm font-bold uppercase tracking-widest text-[#1D4ED8]">
            Liderazgo Estratégico
          </h2>
          <p className="mt-3 text-3xl font-extrabold tracking-tight text-[#F8FAFC] sm:text-4xl">
            Los arquitectos detrás de tus datos
          </p>
          <p className="mt-4 text-lg text-slate-400">
            Combinamos rigor contable, visión de negocios y dominio tecnológico para transformar ecosistemas corporativos en maquinarias eficientes.
          </p>
        </div>
        <div className="grid gap-6 lg:gap-8">
          {PARTNERS.map((partner) => (
            <PartnerCard key={partner.name} partner={partner} />
          ))}
        </div>
      </div>
    </section>
  );
}
