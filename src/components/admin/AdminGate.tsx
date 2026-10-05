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
      <div className="grid min-h-full place-items-center bg-slate-100 text-sm text-slate-500">
        Comprobando sesión…
      </div>
    );
  }

  function logout() {
    clearAdminSession();
    router.replace("/login");
  }

  return (
    <div className="min-h-full bg-slate-100 text-slate-900">
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3">
          <p className="text-sm text-slate-600">
            <span className="font-medium text-slate-900">{session.clinica}</span>
            <span className="mx-2 text-slate-300">·</span>
            <span className="font-mono text-xs">{session.idClinica}</span>
            <span className="mx-2 text-slate-300">·</span>
            {session.email}
          </p>
          <button
            type="button"
            onClick={logout}
            className="text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
      <AdminClinicProvider idClinica={session.idClinica}>{children}</AdminClinicProvider>
    </div>
  );
}
