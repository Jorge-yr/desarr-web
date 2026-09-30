"use client";

import { useEffect, useState } from "react";

const HEADLINE = "Menos planillas. Más claridad para decidir.";
const GRADIENT_START = "Menos planillas. ".length;
const TYPE_DURATION_MS = 800;

export default function ServiciosHeroIntro() {
  const [charCount, setCharCount] = useState(0);
  const [showParagraph, setShowParagraph] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setCharCount(HEADLINE.length);
      setShowParagraph(true);
      return;
    }

    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / TYPE_DURATION_MS, 1);
      setCharCount(Math.floor(progress * HEADLINE.length));

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        setShowParagraph(true);
      }
    };

    requestAnimationFrame(tick);
  }, []);

  const typed = HEADLINE.slice(0, charCount);
  const plainPart = typed.slice(0, Math.min(typed.length, GRADIENT_START));
  const gradientPart = typed.slice(GRADIENT_START);

  return (
    <>
      <span className="inline-block rounded-full border border-[#164E63] bg-[#0C2A3A] px-3.5 py-2 text-xs font-semibold uppercase tracking-widest text-[#22D3EE]">
        Servicios
      </span>
      <h1 className="mt-6 max-w-4xl text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl">
        {plainPart}
        {gradientPart && (
          <span className="bg-gradient-to-r from-[#60A5FA] via-[#22D3EE] to-[#34D399] bg-clip-text text-transparent">
            {gradientPart}
          </span>
        )}
        {!showParagraph && (
          <span
            className="ml-0.5 inline-block h-[0.9em] w-[2px] animate-pulse bg-[#34D399] align-[-0.05em]"
            aria-hidden
          />
        )}
      </h1>
      <p
        className={`mt-6 max-w-3xl text-lg leading-relaxed text-slate-300 sm:text-xl ${
          showParagraph ? "block opacity-100" : "hidden opacity-0"
        }`}
      >
        Optimizamos tus procesos y tus datos para liberar tu tiempo y dar claridad a tu
        negocio. Pensamos como contadores y ejecutamos como desarrolladores.
      </p>
    </>
  );
}
