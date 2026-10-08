"use client";

import { useEffect, useState } from "react";
import { useAdminClinic } from "@/components/admin/AdminClinicContext";

export function LinkParaPacientes({ className = "mt-8" }: { className?: string }) {
  const clinic = useAdminClinic();
  const [url, setUrl] = useState("");
  const [copiado, setCopiado] = useState(false);

  useEffect(() => {
    setUrl(`${window.location.origin}/c/${clinic.idClinica}`);
  }, [clinic.idClinica]);

  async function copiar() {
    if (!url) return;
    await navigator.clipboard.writeText(url);
    setCopiado(true);
  }

  const texto = `Reservá tu turno en ${clinic.clinica}: ${url}`;
  const whatsapp = `https://wa.me/?text=${encodeURIComponent(texto)}`;

  return (
    <section className={`${className} rounded-xl border border-slate-200 bg-white p-6 shadow-sm`}>
      <h2 className="text-lg font-semibold text-[#0F172A]">Link para tus pacientes</h2>
      <p className="mt-1 text-sm text-slate-600">
        Este es el enlace de {clinic.clinica}. Copialo y publicalo en Instagram o WhatsApp.
      </p>
      <p className="mt-4 break-all rounded-lg bg-slate-50 px-3 py-3 font-mono text-sm text-[#0F172A]">
        {url || `/c/${clinic.idClinica}`}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={copiar}
          className="rounded-lg bg-[#1D4ED8] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1e40af]"
        >
          {copiado ? "Copiado" : "Copiar link"}
        </button>
        <a
          href={url ? whatsapp : undefined}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-[#0F172A]"
        >
          Compartir por WhatsApp
        </a>
      </div>
    </section>
  );
}
