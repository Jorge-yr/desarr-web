"use client";

import { FormEvent, useActionState, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signInAdmin } from "@/app/login/actions";
import { writeAdminSession } from "@/lib/admin-session";
import { clinicaPorEmail } from "@/lib/clinicas";

export function LoginForm({ mode }: { mode: "supabase" | "demo" }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("admin@clinica.demo");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [authState, authAction, pending] = useActionState(signInAdmin, null);

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    const clinic = clinicaPorEmail(email);
    if (!clinic || password.length < 4) {
      setError("Correo de administrador no reconocido, o contraseña de menos de 4 caracteres.");
      return;
    }
    writeAdminSession({
      email: clinic.email,
      clinica: clinic.clinica,
      idClinica: clinic.idClinica,
    });
    const next = searchParams.get("next");
    router.replace(next && next.startsWith("/admin") ? next : "/admin");
  }

  if (mode === "supabase") {
    return (
      <form action={authAction} className="mt-6 flex flex-col gap-4">
        <input type="hidden" name="next" value={searchParams.get("next") ?? ""} />
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-slate-600">Correo</span>
          <input
            name="email"
            type="email"
            autoComplete="username"
            required
            className="rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-slate-600">Contraseña</span>
          <input
            name="password"
            type="password"
            autoComplete="current-password"
            required
            minLength={8}
            className="rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>
        {authState?.error && <p className="text-sm text-red-700">{authState.error}</p>}
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-800 disabled:opacity-60"
        >
          Entrar
        </button>
        <p className="text-xs text-slate-500">
          La contraseña la valida Supabase Auth. La clínica sale de admin_usuarios, no del navegador.
        </p>
      </form>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-4">
      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium text-slate-600">Correo</span>
        <input
          type="email"
          autoComplete="username"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium text-slate-600">Contraseña</span>
        <input
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2"
        />
      </label>
      {error && <p className="text-sm text-red-700">{error}</p>}
      <button
        type="submit"
        className="rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-800"
      >
        Entrar
      </button>
      <p className="text-xs text-slate-500">
        Maqueta: admin@clinica.demo (CL001) o admin@norte.demo (CL002), con cualquier contraseña de 4 caracteres. Cada ingreso queda fijado a su id_clinica.
      </p>
    </form>
  );
}
