"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { clearAdminSession, readAdminSession, type AdminSession } from "@/lib/admin-session";
import { AdminClinicProvider } from "@/components/admin/AdminClinicContext";

export function AdminGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [session, setSession] = useState<AdminSession | null | undefined>(undefined);

  useEffect(() => {
    const current = readAdminSession();
    if (!current) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }
    setSession(current);
  }, [pathname, router]);

  if (!session) {
    return (
      <div className="grid min-h-full place-items-center bg-[#F8FAFC] text-sm text-slate-600">
        Comprobando sesión…
      </div>
    );
  }

  function logout() {
    clearAdminSession();
    router.replace("/login");
  }

  return (
    <div className="min-h-full bg-[#F8FAFC] text-[#0F172A]">
      <div className="h-1 bg-gradient-to-r from-[#1D4ED8] via-[#38BDF8] to-[#10B981]" />
      <div className="border-b border-slate-200 bg-[#0F172A] text-[#F8FAFC]">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3">
          <p className="text-sm text-slate-200">
            <span className="font-medium text-white">{session.clinica}</span>
            <span className="mx-2 text-slate-500">·</span>
            <span className="font-mono text-xs text-[#38BDF8]">{session.idClinica}</span>
            <span className="mx-2 text-slate-500">·</span>
            {session.email}
          </p>
          <button
            type="button"
            onClick={logout}
            className="text-sm font-medium text-slate-200 hover:text-white"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
      <AdminClinicProvider idClinica={session.idClinica}>{children}</AdminClinicProvider>
    </div>
  );
}
