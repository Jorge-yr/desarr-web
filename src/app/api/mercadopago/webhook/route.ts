import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { tokenPorCuentaExterna } from "@/lib/cobro";
import { obtenerPago } from "@/lib/mercadopago";

export async function POST(request: Request) {
  const url = new URL(request.url);
  const body = (await request.json().catch(() => ({}))) as {
    data?: { id?: string };
    type?: string;
    user_id?: string | number;
  };
  const paymentId = body.data?.id || url.searchParams.get("data.id") || url.searchParams.get("id");
  if (!paymentId || (body.type && body.type !== "payment")) {
    return NextResponse.json({ ok: true });
  }

  const cuenta = String(body.user_id || url.searchParams.get("user_id") || "");
  const accessToken = await tokenPorCuentaExterna("mercadopago", cuenta);
  if (!accessToken) return NextResponse.json({ ok: true });

  const pago = await obtenerPago(accessToken, String(paymentId));
  if (!pago) return NextResponse.json({ ok: true });

  const reserva = pago.metadata ?? {};
  if (!reserva.id_clinica || !pago.external_reference) {
    return NextResponse.json({ ok: true });
  }

  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!serviceKey || !supabaseUrl) {
    console.error("[Mercado Pago] Falta SUPABASE_SERVICE_ROLE_KEY para registrar la seña.");
    return NextResponse.json({ ok: true });
  }

  const supabase = createClient(supabaseUrl, serviceKey);
  const { error } = await supabase.from("senas_pagos").upsert(
    {
      id: pago.external_reference,
      id_clinica: reserva.id_clinica,
      id_profesional: reserva.id_profesional,
      inicio_turno: reserva.inicio,
      dni: reserva.dni,
      nombre: reserva.nombre,
      apellido: reserva.apellido,
      whatsapp: reserva.whatsapp,
      importe: pago.transaction_amount,
      mp_payment_id: String(pago.id),
      estado: pago.status,
    },
    { onConflict: "id" },
  );

  if (error) console.error("[Mercado Pago] No se guardó la seña:", error.message);

  if (pago.status === "approved" && reserva.id_turno) {
    const confirmado = await supabase
      .from("historial_turnos")
      .update({ estado_turno: "Confirmado con Seña" })
      .eq("id_turno", reserva.id_turno)
      .eq("id_clinica", reserva.id_clinica);
    if (confirmado.error) console.error("[Mercado Pago] No se confirmó el turno:", confirmado.error.message);
  }

  return NextResponse.json({ ok: true });
}
