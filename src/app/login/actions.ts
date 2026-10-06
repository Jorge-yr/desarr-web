"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server";

export async function signInAdmin(_prev: { error: string } | null, formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "");
  const destination = next.startsWith("/admin") ? next : "/admin";

  if (!isSupabaseConfigured()) {
    return { error: "Falta la configuración de Supabase en el servidor." };
  }
  if (!email || password.length < 8) {
    return { error: "Ingresá el correo y una contraseña de al menos 8 caracteres." };
  }

  const supabase = await createSupabaseServerClient();
  const { data: authData, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !authData.user) {
    return { error: error?.message ?? "Auth no devolvió un usuario." };
  }

  const { data: admin, error: adminError } = await supabase
    .from("admin_usuarios")
    .select("id_clinica")
    .eq("user_id", authData.user.id)
    .maybeSingle();

  if (adminError) {
    await supabase.auth.signOut();
    return { error: adminError.message };
  }

  if (!admin?.id_clinica) {
    await supabase.auth.signOut();
    return { error: "Este usuario no está asociado a una clínica." };
  }

  redirect(destination);
}

export async function signOutAdmin() {
  if (!isSupabaseConfigured()) return;
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/login");
}
