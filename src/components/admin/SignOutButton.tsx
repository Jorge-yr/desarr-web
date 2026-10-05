"use client";

import { signOutAdmin } from "@/app/login/actions";

export function SignOutButton() {
  return (
    <form action={signOutAdmin}>
      <button type="submit" className="text-sm font-medium text-slate-600 hover:text-slate-900">
        Cerrar sesión
      </button>
    </form>
  );
}
