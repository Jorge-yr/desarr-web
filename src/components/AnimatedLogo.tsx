/**
 * <AnimatedLogo />
 * Componente funcional para Next.js - Header B2B
 * Implementa secuencia SVG de trazado lineal y revelado de texto por barrido.
 *
 * - Tipografía: Inter / Sans-serif geométrica.
 * - Azul Cobalto: #1D4ED8 (Acción, interacción).
 * - Verde Menta: #10B981 (Acento, evolución, resultados).
 * - Optimizado para fondo Grafito Profundo (#0F172A).
 */

export default function AnimatedLogo() {
  return (
    <div className="flex items-center gap-2 sm:gap-4 bg-transparent select-none font-sans">
      {/*
        Inyección de CSS puro para la coreografía de animación.
        Mantiene el componente modular e independiente de hojas de estilo externas.
      */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
          /* Ciclo 10s: 6s coreografía + 4s estático. linear para que % = tiempo real. */
          .beam-path {
            stroke-dasharray: 280;
            stroke-dashoffset: 280;
            animation: drawBeamOuter 10s linear infinite;
          }

          .beam-inner {
            stroke-dasharray: 120;
            stroke-dashoffset: 120;
            animation: drawBeamInner 10s linear infinite;
          }

          .beam-node {
            opacity: 0;
            animation: nodeAppear 10s linear infinite;
          }

          .sweep-reveal {
            clip-path: inset(0 100% 0 0);
            animation: sweepText 10s linear infinite;
          }

          @keyframes drawBeamOuter {
            0% {
              stroke-dashoffset: 280;
              animation-timing-function: cubic-bezier(0.25, 1, 0.5, 1);
            }
            30%, 100% { stroke-dashoffset: 0; }
          }

          @keyframes drawBeamInner {
            0%, 8% {
              stroke-dashoffset: 120;
              animation-timing-function: cubic-bezier(0.25, 1, 0.5, 1);
            }
            32%, 100% { stroke-dashoffset: 0; }
          }

          @keyframes nodeAppear {
            0% { opacity: 0; }
            3%, 100% { opacity: 1; }
          }

          @keyframes sweepText {
            0%, 32% {
              clip-path: inset(0 100% 0 0);
              animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
            }
            60%, 100% { clip-path: inset(0 0 0 0); }
          }
        `,
        }}
      />

      {/* 1. El Haz de Energía (Isotipo 'D') */}
      <div className="relative flex-shrink-0 w-9 h-9 sm:w-12 sm:h-12 md:w-14 md:h-14">
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-lg"
        >
          {/* Nodo conector inicial (Diseño tecnológico) */}
          <circle
            cx="25"
            cy="15"
            r="4"
            fill="#1D4ED8"
            className="beam-node"
          />

          {/* Trazado principal de la 'D' (Azul Cobalto) */}
          <path
            d="M 25 15 L 25 85 C 25 88 28 90 30 90 L 55 90 C 78 90 90 72 90 50 C 90 28 78 10 55 10 L 30 10 C 28 10 25 12 25 15 Z"
            stroke="#1D4ED8"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="beam-path"
          />

          {/* Trazado interior para refuerzo de la estructura de datos */}
          <path
            d="M 40 30 L 40 70 L 50 70 C 62 70 70 60 70 50 C 70 40 62 30 50 30 Z"
            stroke="#10B981"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeOpacity="0.8"
            className="beam-inner"
          />
        </svg>
      </div>

      {/* 2. El Barrido (Logotipo Texto) */}
      <div className="sweep-reveal flex items-center overflow-hidden py-2">
        <span className="whitespace-nowrap text-base sm:text-2xl md:text-3xl font-extrabold tracking-tight">
          <span className="text-[#1D4ED8]">Desarr</span>
          <span className="text-[#10B981] ml-1 sm:ml-2">Soluciones</span>
        </span>
      </div>
    </div>
  );
}
