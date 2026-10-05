"use client";

import { createContext, useContext } from "react";
import { CLINICAS, type ClinicaAdmin } from "@/lib/clinicas";

const AdminClinicContext = createContext<ClinicaAdmin | null>(null);

export function AdminClinicProvider({
  idClinica,
  children,
}: {
  idClinica: string;
  children: React.ReactNode;
}) {
  const clinic = CLINICAS.find((c) => c.idClinica === idClinica) ?? null;
  if (!clinic) return null;
  return <AdminClinicContext.Provider value={clinic}>{children}</AdminClinicContext.Provider>;
}

export function useAdminClinic() {
  const clinic = useContext(AdminClinicContext);
  if (!clinic) {
    throw new Error("useAdminClinic debe usarse dentro de la sesión de la clínica.");
  }
  return clinic;
}
