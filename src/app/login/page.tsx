import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata: Metadata = {
  title: "Ingreso | Administración",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <main className="grid min-h-full place-items-center bg-slate-100 px-4 text-slate-900">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">Administración</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">Ingreso</h1>
        <p className="mt-2 text-sm text-slate-500">
          Acceso de la clínica para ver tableros de Looker o parametrizar el turnero.
        </p>
        <Suspense fallback={<p className="mt-6 text-sm text-slate-500">Cargando…</p>}>
          <LoginForm />
        </Suspense>
      </section>
    </main>
  );
}
