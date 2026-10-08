import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminClinicProvider } from "@/components/admin/AdminClinicContext";
import { AdminGate } from "@/components/admin/AdminGate";
import { SignOutButton } from "@/components/admin/SignOutButton";
import { getAdminClinic } from "@/lib/supabase/admin-clinic";
import { isSupabaseConfigured } from "@/lib/supabase/server";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  if (!isSupabaseConfigured()) {
    return <AdminGate>{children}</AdminGate>;
  }

  const clinic = await getAdminClinic();
  if (!clinic) redirect("/login");

  return (
    <AdminClinicProvider clinic={clinic}>
      <div className="min-h-full bg-[#F8FAFC] font-sans text-[#0F172A]">
        <div className="h-1 bg-gradient-to-r from-[#1D4ED8] via-[#38BDF8] to-[#10B981]" />
        <div className="border-b border-slate-200 bg-[#0F172A] text-[#F8FAFC]">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3">
            <p className="text-sm text-slate-200">
              <span className="font-medium text-white">{clinic.clinica}</span>
              <span className="mx-2 text-slate-500">·</span>
              <span className="font-mono text-xs text-[#38BDF8]">{clinic.idClinica}</span>
              <span className="mx-2 text-slate-500">·</span>
              {clinic.email}
            </p>
            <SignOutButton />
          </div>
        </div>
        {children}
      </div>
    </AdminClinicProvider>
  );
}
