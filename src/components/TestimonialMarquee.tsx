"use client";

import Image from "next/image";
import Link from "next/link";

export interface Testimonial {
  id: string;
  content: string;
  author: string;
  role: string;
  company: string;
  imageUrl: string;
  socialType: "LinkedIn" | "Instagram";
  socialUrl: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "1",
    content:
      "Teníamos procesos ineficientes, falta de organización y perdíamos mucho tiempo en Excel. Trabajan con absoluta responsabilidad y eficiencia. Su mayor diferencial es el valor agregado que le ponen a cada desarrollo y sus profundos conocimientos técnicos.",
    author: "Augusto Acosta",
    role: "Gerente de Compras",
    company: "Previsora el Parana SRL",
    imageUrl: "/testimonials/Testimonio_1.jpg",
    socialType: "LinkedIn",
    socialUrl: "https://www.linkedin.com/in/augusto-acosta-62b43342/",
  },
  {
    id: "2",
    content:
      "Buscábamos mejorar nuestros procesos aplicando la tecnología disponible. Destaco su cordialidad, claridad y rapidez. Son profesionales confiables, altamente capacitados y 100% comprometidos con cada proyecto que llevan adelante.",
    author: "Lorena E. Meza",
    role: "Analista de Administración",
    company: "Forestal Argentina S.A.",
    imageUrl: "/testimonials/Testimonio_2.jpg",
    socialType: "LinkedIn",
    socialUrl: "https://www.linkedin.com/in/lorena-elizabet-meza-334b40363/",
  },
  {
    id: "3",
    content:
      "Teníamos procesos ineficientes. Destaco el acompañamiento y su excelente predisposición. Tienen una visión transversal de la empresa, gran observación de los detalles y un enorme profesionalismo.",
    author: "Myrna Zayas",
    role: "Gerente de Finanzas",
    company: "Teo Pet Shop",
    imageUrl: "/testimonials/Testimonio_3.jpg",
    socialType: "Instagram",
    socialUrl: "https://www.instagram.com/teo.petshop",
  },
  {
    id: "4",
    content:
      "Necesitábamos mejorar el análisis de nuestros productos. Destaco su forma ordenada y clara de trabajar; las soluciones implementadas fueron prácticas y adaptadas a nosotros. Su capacidad para entender el negocio y resolver problemas es excelente.",
    author: "Florencia Padrón",
    role: "Jefa de Marketing",
    company: "Club San Martín",
    imageUrl: "/testimonials/Testimonio_4.jpg",
    socialType: "Instagram",
    socialUrl: "https://www.instagram.com/florr.padron/",
  },
];

function SocialIcon({ type }: { type: Testimonial["socialType"] }) {
  const className = "h-4 w-4 shrink-0";

  if (type === "LinkedIn") {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    );
  }

  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <article className="flex w-[340px] shrink-0 flex-col rounded-2xl border border-[#1E293B] bg-slate-900/50 p-6 shadow-lg shadow-black/10 backdrop-blur-sm transition-colors duration-300 hover:border-[#1D4ED8]/30 sm:w-[380px]">
      <svg
        className="mb-4 h-6 w-6 text-[#10B981]/60"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden
      >
        <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.29l.665 1.332-1.078 1.132C6.988 8.672 6 10.773 6 12.011c0 1.357.474 2.394 1.378 3.24.173.16.345.307.517.466l-1.312 1.604zm13 0c-1.03-1.094-1.583-2.321-1.583-4.31 0-3.5 2.457-6.637 6.03-8.29l.665 1.332-1.078 1.132c-.989.828-1.977 2.929-1.977 4.167 0 1.357.474 2.394 1.378 3.24.173.16.345.307.517.466l-1.312 1.604z" />
      </svg>

      <p className="flex-1 text-sm leading-relaxed text-slate-300 sm:text-[0.9375rem]">
        {testimonial.content}
      </p>

      <div className="mt-6 flex items-center gap-3 border-t border-[#1E293B] pt-5">
        <div className="relative h-12 w-12 shrink-0">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-700 bg-slate-800">
            <span className="text-lg font-semibold text-[#93C5FD]">
              {testimonial.author.charAt(0)}
            </span>
          </div>
          <Image
            src={testimonial.imageUrl}
            alt={testimonial.author}
            fill
            className="absolute inset-0 rounded-full object-cover"
            onError={(e) => {
              e.currentTarget.style.opacity = "0";
            }}
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate text-sm font-semibold text-[#F8FAFC]">
              {testimonial.author}
            </p>
            <Link
              href={testimonial.socialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 transition-colors hover:text-[#10B981]"
              aria-label={`Perfil de ${testimonial.author} en ${testimonial.socialType}`}
            >
              <SocialIcon type={testimonial.socialType} />
            </Link>
          </div>
          <p className="truncate text-xs text-slate-400">{testimonial.role}</p>
          <p className="truncate text-xs font-medium text-[#93C5FD]/80">
            {testimonial.company}
          </p>
        </div>
      </div>
    </article>
  );
}

export default function TestimonialMarquee() {
  const marqueeItems = [...TESTIMONIALS, ...TESTIMONIALS];

  return (
    <section className="bg-[#0F172A] py-16 sm:py-20">
      <div className="mx-auto mb-10 max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <p className="text-sm font-medium uppercase tracking-wider text-[#10B981]">
          Casos de Éxito
        </p>
        <h2 className="mt-2 text-2xl font-bold text-[#F8FAFC] sm:text-3xl">
          Lo que dicen nuestros clientes
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-400 sm:text-base">
          Resultados reales de empresas que confiaron en Desarr Soluciones para
          transformar sus operaciones.
        </p>
      </div>

      <div
        className="group relative overflow-hidden testimonial-marquee-mask"
        aria-label="Testimonios de clientes"
      >
        <div className="testimonial-marquee-track flex w-max gap-5 px-4 sm:gap-6 sm:px-6">
          {marqueeItems.map((testimonial, index) => (
            <TestimonialCard
              key={`${testimonial.id}-${index}`}
              testimonial={testimonial}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
