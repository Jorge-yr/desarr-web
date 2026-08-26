"use client";

import { useState } from "react";
import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";

export default function PageHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-white/5 bg-[#0F172A]/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">

        <div className="flex items-center gap-3">
          <button type="button" onClick={() => setMenuOpen((v) => !v)} aria-label="Abrir menú" aria-expanded={menuOpen} className="flex h-9 w-9 items-center justify-center rounded-md text-slate-300 transition-colors hover:text-white md:hidden">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-6 w-6">
              {menuOpen ? (
                <path d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          <Link
            href="/"
            className="transition-opacity hover:opacity-80"
            aria-label="Desarr Soluciones"
          >
            <BrandLogo />
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-sm font-medium text-slate-300 transition-colors hover:text-slate-200">Inicio</Link>
          <Link href="/servicios" className="text-sm font-medium text-slate-300 transition-colors hover:text-slate-200">Servicios</Link>
          <Link href="#casos-de-exito" className="text-sm font-medium text-slate-300 transition-colors hover:text-slate-200">Casos de Éxito</Link>
          <Link href="/equipo" className="text-sm font-medium text-slate-300 transition-colors hover:text-slate-200">Equipo</Link>
        </div>

        <div className="flex items-center gap-2 sm:gap-5">
          <Link href="/login" className="text-xs sm:text-sm font-medium text-slate-300 transition-colors hover:text-white">Log In</Link>
          <Link href="/registro" className="hidden rounded-lg border border-[#10B981]/40 bg-[#10B981]/10 px-4 py-2 text-sm font-medium text-[#10B981] transition-colors hover:bg-[#10B981]/20 sm:inline-flex">Regístrate</Link>
          <Link
            href="https://wa.me/5493794001206?text=Hola!%20Me%20gustar%C3%ADa%20agendar%20una%20llamada%20con%20Desarr%20Soluciones."
            target="_blank"
            rel="noopener noreferrer"
            className="whitespace-nowrap rounded-lg bg-[#1D4ED8] px-3 py-2 text-xs font-medium text-white shadow-sm transition-colors hover:bg-blue-600 sm:px-5 sm:text-sm"
          >
            <span className="sm:hidden">Agendar</span>
            <span className="hidden sm:inline">Agendar Llamada</span>
          </Link>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-white/5 bg-[#0F172A]/95 backdrop-blur-md md:hidden">
          <div className="flex flex-col gap-1 px-4 py-3">
            <Link href="/" onClick={() => setMenuOpen(false)} className="rounded-md px-3 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-white/5 hover:text-white">Inicio</Link>
            <Link href="/servicios" onClick={() => setMenuOpen(false)} className="rounded-md px-3 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-white/5 hover:text-white">Servicios</Link>
            <Link href="#casos-de-exito" onClick={() => setMenuOpen(false)} className="rounded-md px-3 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-white/5 hover:text-white">Casos de Éxito</Link>
            <Link href="/equipo" onClick={() => setMenuOpen(false)} className="rounded-md px-3 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-white/5 hover:text-white">Equipo</Link>
          </div>
        </div>
      )}
    </nav>
  );
}
