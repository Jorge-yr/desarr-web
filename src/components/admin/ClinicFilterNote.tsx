"use client";

import { useAdminClinic } from "@/components/admin/AdminClinicContext";

export function ClinicFilterNote() {
  const clinic = useAdminClinic();
  return (
    <p className="mt-2 max-w-xl text-sm text-slate-600">
      Datos de {clinic.clinica}, filtrados por{" "}
      <span className="font-mono text-[#1D4ED8]">{clinic.idClinica}</span>. Otra clínica no aparece en este panel.
    </p>
  );
}
