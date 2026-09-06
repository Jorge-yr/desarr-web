"use client";

import { useEffect, useRef, useState } from "react";

interface PhoneCountry {
  code: string;
  label: string;
}

export const PHONE_COUNTRIES: PhoneCountry[] = [
  { code: "+549", label: "Argentina" },
  { code: "+598", label: "Uruguay" },
  { code: "+56", label: "Chile" },
  { code: "+57", label: "Colombia" },
  { code: "+52", label: "México" },
  { code: "+51", label: "Perú" },
  { code: "+55", label: "Brasil" },
  { code: "+593", label: "Ecuador" },
  { code: "+595", label: "Paraguay" },
  { code: "+591", label: "Bolivia" },
  { code: "+34", label: "España" },
  { code: "+1", label: "Estados Unidos" },
  { code: "+44", label: "Reino Unido" },
];

export default function PhoneCountrySelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (code: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`flex h-full min-w-[5.5rem] items-center justify-between gap-1 rounded-lg border border-slate-300 bg-[#F8FAFC] px-3 py-3 text-sm font-semibold text-[#0F172A] transition-colors hover:border-[#10B981] ${open ? "border-[#10B981] ring-2 ring-[#10B981]/20" : ""}`}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span>{value}</span>
        <svg className="h-4 w-4 text-slate-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute left-0 top-[calc(100%+0.35rem)] z-20 max-h-52 w-56 overflow-y-auto rounded-lg border border-slate-200 bg-white py-1 shadow-xl"
        >
          {PHONE_COUNTRIES.map((country) => (
            <li key={country.code} role="option" aria-selected={value === country.code}>
              <button
                type="button"
                onClick={() => {
                  onChange(country.code);
                  setOpen(false);
                }}
                className={`flex w-full items-center justify-between px-3 py-2.5 text-left text-sm transition-colors hover:bg-slate-100 ${value === country.code ? "bg-[#10B981]/10 font-medium text-[#0F172A]" : "text-slate-700"}`}
              >
                <span>{country.label}</span>
                <span className="text-slate-500">{country.code}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function formatPhoneNumber(countryCode: string, phoneNumber: string): string {
  return `${countryCode}${phoneNumber.replace(/\s/g, "")}`;
}
