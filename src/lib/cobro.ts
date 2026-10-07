import { createServiceClient } from "@/lib/supabase/service";

export async function tokenDeClinica(idClinica: string, pasarela = "mercadopago") {
  const supabase = createServiceClient();
  if (!supabase) return process.env.MERCADOPAGO_ACCESS_TOKEN || null;

  const { data } = await supabase
    .from("cuentas_cobro")
    .select("access_token")
    .eq("id_clinica", idClinica)
    .eq("pasarela", pasarela)
    .eq("activa", true)
    .maybeSingle();

  return (data?.access_token as string | undefined) || process.env.MERCADOPAGO_ACCESS_TOKEN || null;
}

export async function tokenPorCuentaExterna(pasarela: string, cuentaExterna: string) {
  const supabase = createServiceClient();
  if (!supabase || !cuentaExterna) return process.env.MERCADOPAGO_ACCESS_TOKEN || null;

  const { data } = await supabase
    .from("cuentas_cobro")
    .select("access_token")
    .eq("pasarela", pasarela)
    .eq("cuenta_externa", cuentaExterna)
    .eq("activa", true)
    .maybeSingle();

  return (data?.access_token as string | undefined) || process.env.MERCADOPAGO_ACCESS_TOKEN || null;
}
