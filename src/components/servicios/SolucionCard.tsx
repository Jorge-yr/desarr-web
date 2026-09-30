"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type SolucionCardProps = {
  tag: string;
  pain: string;
  title: string;
  items: string[];
  accent: string;
  iconBg: string;
  icon: ReactNode;
};

export default function SolucionCard({
  tag,
  pain,
  title,
  items,
  accent,
  iconBg,
  icon,
}: SolucionCardProps) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const titleEl = titleRef.current;
    if (!titleEl) return;

    const evaluateReveal = () => {
      if (revealed) return;

      const rect = titleEl.getBoundingClientRect();
      const crossed =
        rect.bottom <= window.innerHeight * 0.55 &&
        rect.top < window.innerHeight * 0.85;

      if (crossed) {
        setRevealed(true);
      }
    };

    evaluateReveal();
    window.addEventListener("scroll", evaluateReveal, { passive: true });
    window.addEventListener("resize", evaluateReveal);

    return () => {
      window.removeEventListener("scroll", evaluateReveal);
      window.removeEventListener("resize", evaluateReveal);
    };
  }, [revealed]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setRevealed(true);
    }
  }, []);

  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-[#1E2B45] bg-[#111C33] p-7 sm:p-9">
      <div className="flex items-center justify-between">
        <div
          className={`${iconBg} ${accent} flex h-12 w-12 items-center justify-center rounded-xl`}
        >
          {icon}
        </div>
        <span className={`${accent} text-xs font-semibold uppercase tracking-wider`}>
          {tag}
        </span>
      </div>

      <p className="text-sm text-slate-400">
        <span className="font-semibold not-italic text-slate-300">Tu dolor:</span>{" "}
        <span className="italic">{pain}</span>
      </p>

      <h3
        ref={titleRef}
        className={`tracking-tight transition-all duration-700 ease-out ${
          revealed
            ? "text-2xl font-bold"
            : "text-3xl font-extrabold leading-tight sm:text-[2.125rem] sm:leading-tight"
        }`}
      >
        {title}
      </h3>

      <ul className="list-disc space-y-2 pl-5 text-slate-300">
        {items.map((item, index) => (
          <li
            key={item}
            className={`transition-all duration-500 ease-out ${
              revealed
                ? "translate-x-0 opacity-100"
                : "pointer-events-none translate-x-10 opacity-0"
            }`}
            style={{ transitionDelay: revealed ? `${index * 130}ms` : "0ms" }}
          >
            {item}
          </li>
        ))}
      </ul>
    </article>
  );
}
