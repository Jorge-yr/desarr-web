"use client";

import Link from "next/link";

type PlanCardProps = {
  name: string;
  caption: string;
  items: string[];
  featured?: boolean;
  whatsappHref: string;
};

export default function PlanCard({
  name,
  caption,
  items,
  featured,
  whatsappHref,
}: PlanCardProps) {
  return (
    <div
      className={`flex flex-col gap-5 rounded-2xl border p-8 transition-[border-color,border-width,box-shadow] duration-300 ${
        featured
          ? "border-2 border-[#1D4ED8] bg-[#0E1B3D] hover:border-[#34D399] hover:shadow-[0_0_0_1px_#34D399]"
          : "border border-[#1E2B45] bg-[#111C33] hover:border-2 hover:border-[#34D399] hover:shadow-[0_0_0_1px_#34D399]"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-xl font-bold">{name}</h3>
        {featured && (
          <span className="rounded-full bg-[#1D4ED8] px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-white">
            Más elegido
          </span>
        )}
      </div>
      <p className="text-sm text-slate-400">{caption}</p>
      <ul className="flex-grow list-disc space-y-2 pl-5 text-sm text-slate-300">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <Link
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        className={`rounded-lg py-3 text-center text-sm font-semibold transition-colors ${
          featured
            ? "bg-[#1D4ED8] text-white hover:bg-[#1E40AF]"
            : "border border-slate-700 text-slate-100 hover:bg-white/5"
        }`}
      >
        Consultar
      </Link>
    </div>
  );
}
