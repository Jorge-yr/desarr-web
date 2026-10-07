"use server";

import { getAdminClinic } from "@/lib/supabase/admin-clinic";
import { createServiceClient } from "@/lib/supabase/service";
import { cuentaMercadoPago } from "@/lib/mercadopago";

const PASARELA = "mercadopago";

export async function estadoCuentaCobro() {
  const clinic = await getAdminClinic();
  const supabase = createServiceClient();
  if (!clinic || !supabase) return { conectada: false, cuenta: "" };

  const { data } = await supabase
    .from("cuentas_cobro")
    .select("cuenta_externa")
    .eq("id_clinica", clinic.idClinica)
    .eq("pasarela", PASARELA)
    .eq("activa", true)
    .maybeSingle();

  return { conectada: Boolean(data), cuenta: (data?.cuenta_externa as string | undefined) ?? "" };
}

export async function guardarCuentaMercadoPago(token: string) {
  const clinic = await getAdminClinic();
  if (!clinic) return { error: "La sesión venció." };

  const limpio = token.trim();
  if (limpio.length < 20) return { error: "Pegá el Access Token de la cuenta de Mercado Pago." };

  const cuenta = await cuentaMercadoPago(limpio);
  if (!cuenta) return { error: "Mercado Pago no reconoció ese Access Token." };

  const supabase = createServiceClient();
  if (!supabase) return { error: "No se puede guardar la cuenta." };

  const { error } = await supabase.from("cuentas_cobro").upsert(
    {
      id_clinica: clinic.idClinica,
      pasarela: PASARELA,
      access_token: limpio,
      cuenta_externa: cuenta,
      activa: true,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id_clinica,pasarela" },
  );

  if (error) return { error: error.message };
  return { conectada: true, cuenta };
}
