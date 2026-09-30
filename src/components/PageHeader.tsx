"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";

type NavChild = {
  label: string;
  href: string;
};

type NavGroup = {
  label: string;
  href: string;
  children: NavChild[];
};

const NAV_GROUPS: NavGroup[] = [
  {
    label: "Servicios",
    href: "/servicios",
    children: [
      { label: "Qué Resolvemos", href: "/servicios#que-resolvemos" },
      { label: "Cómo Trabajamos", href: "/servicios#como-trabajamos" },
      { label: "Packs de Servicios", href: "/servicios#packs-de-servicios" },
    ],
  },
  {
    label: "Casos de Éxito",
    href: "/casos-de-exito",
    children: [
      { label: "Casos de Éxito", href: "/casos-de-exito" },
      { label: "Testimonios de Clientes", href: "/#testimonios-clientes" },
    ],
  },
  {
    label: "Equipo",
    href: "/equipo",
    children: [
      { label: "Nuestro Equipo", href: "/equipo#nuestro-equipo" },
      { label: "Socios Estratégicos", href: "/equipo#socios-estrategicos" },
    ],
  },
];

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

function DesktopNavDropdown({
  group,
  isOpen,
  onToggle,
  onClose,
}: {
  group: NavGroup;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className="flex items-center gap-1 text-sm font-medium text-slate-300 transition-colors hover:text-slate-200"
      >
        {group.label}
        <ChevronDownIcon
          className={`h-4 w-4 opacity-70 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      {isOpen && (
        <div className="absolute left-0 top-full z-50 pt-2">
          <div className="min-w-[220px] rounded-lg border border-white/10 bg-[#0F172A] py-2 shadow-xl">
            {group.children.map((child) => (
              <Link
                key={child.href}
                href={child.href}
                onClick={onClose}
                className="block px-4 py-2 text-sm text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
              >
                {child.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function MobileNavGroup({
  group,
  onNavigate,
}: {
  group: NavGroup;
  onNavigate: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="py-1">
      <button
        type="button"
        onClick={() => setExpanded((value) => !value)}
        aria-expanded={expanded}
        className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-semibold text-slate-200 transition-colors hover:bg-white/5 hover:text-white"
      >
        {group.label}
        <ChevronDownIcon
          className={`h-4 w-4 opacity-70 transition-transform ${expanded ? "rotate-180" : ""}`}
        />
      </button>
      {expanded && (
        <div className="mt-1 flex flex-col gap-0.5 pl-3">
          {group.children.map((child) => (
            <Link
              key={child.href}
              href={child.href}
              onClick={onNavigate}
              className="rounded-md px-3 py-2 text-sm font-medium text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
            >
              {child.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function PageHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const closeMenu = () => setMenuOpen(false);
  const closeDropdown = () => setOpenDropdown(null);

  const toggleDropdown = (label: string) => {
    setOpenDropdown((current) => (current === label ? null : label));
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-white/5 bg-[#0F172A]/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Abrir menú"
            aria-expanded={menuOpen}
            className="flex h-9 w-9 items-center justify-center rounded-md text-slate-300 transition-colors hover:text-white md:hidden"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              className="h-6 w-6"
            >
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

        <div className="hidden items-center gap-8 md:flex">
          <Link
            href="/"
            className="text-sm font-medium text-slate-300 transition-colors hover:text-slate-200"
          >
            Inicio
          </Link>
          {NAV_GROUPS.map((group) => (
            <DesktopNavDropdown
              key={group.label}
              group={group}
              isOpen={openDropdown === group.label}
              onToggle={() => toggleDropdown(group.label)}
              onClose={closeDropdown}
            />
          ))}
        </div>

        <div className="flex items-center gap-2 sm:gap-5">
          <Link
            href="/login"
            className="hidden text-xs font-medium text-slate-300 transition-colors hover:text-white sm:text-sm"
          >
            Log In
          </Link>
          <Link
            href="/registro"
            className="hidden rounded-lg border border-[#10B981]/40 bg-[#10B981]/10 px-4 py-2 text-sm font-medium text-[#10B981] transition-colors hover:bg-[#10B981]/20 sm:inline-flex"
          >
            Regístrate
          </Link>
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
            <Link
              href="/"
              onClick={closeMenu}
              className="rounded-md px-3 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
            >
              Inicio
            </Link>
            {NAV_GROUPS.map((group) => (
              <MobileNavGroup key={group.label} group={group} onNavigate={closeMenu} />
            ))}
            <Link
              href="/registro"
              onClick={closeMenu}
              className="rounded-md px-3 py-2 text-sm font-medium text-[#10B981] transition-colors hover:bg-white/5"
            >
              Regístrate
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
