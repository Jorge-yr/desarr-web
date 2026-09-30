"use client";

import type { ReactNode } from "react";

type PasoCardProps = {
  children: ReactNode;
  className?: string;
};

export default function PasoCard({ children, className = "" }: PasoCardProps) {
  return (
    <div
      className={`flex flex-col gap-4 rounded-2xl transition-transform duration-300 ease-out will-change-transform hover:scale-[1.06] ${className}`}
    >
      {children}
    </div>
  );
}
