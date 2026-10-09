import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { tokenPorCuentaExterna } from "@/lib/cobro";
import { obtenerPago } from "@/lib/mercadopago";
import { fechaDeRegistro } from "@/lib/turno/ahora";

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

    const { data: turno } = await supabase
      .from("historial_turnos")
      .select("id_paciente, id_profesional")
      .eq("id_turno", reserva.id_turno)
      .eq("id_clinica", reserva.id_clinica)
      .maybeSingle();

    const { data: profesional } = turno?.id_profesional
      ? await supabase
          .from("profesionales")
          .select("id_clinica")
          .eq("id_profesional", turno.id_profesional)
          .maybeSingle()
      : { data: null };
    const idClinica = profesional?.id_clinica || reserva.id_clinica;

    const idCobro = `mp-${pago.id}`;
    const { data: yaCobrado } = await supabase.from("historial_cobros").select("id_cobro").eq("id_cobro", idCobro).maybeSingle();
    const { data: medios } = await supabase
      .from("medios_cobro")
      .select("id_medio_cobro, tipo_medio_cobro, detalle_medio_cobro, cuotas, interes_a_aplicar, entidad_emisora")
      .eq("id_clinica", idClinica);
    const medio = (medios ?? []).find((row) =>
      String(row.detalle_medio_cobro ?? "").replace(/\s+/g, "").toLowerCase() === "mercadopago",
    );
    if (turno?.id_paciente && !yaCobrado) {
      const fechaMovimiento = await fechaDeRegistro(supabase, "movimientos", "fecha_hora");
      const fechaCobro = await fechaDeRegistro(supabase, "historial_cobros", "fecha_mov_cobro");
      const importe = pago.transaction_amount;
      const interes = Number(medio?.interes_a_aplicar ?? 0);
      const neto = Math.round(importe * (1 + interes) * 100) / 100;
      const idTransaccion = crypto.randomUUID();
      const movimiento = await supabase.from("movimientos").insert({
        id_transaccion: idTransaccion,
        id_paciente: turno.id_paciente,
        id_profesional: turno.id_profesional,
        id_clinica: idClinica,
        fecha_hora: fechaMovimiento,
        tipo_movimiento: "Solo Cobro",
        medio_pago: medio?.tipo_medio_cobro ?? null,
      });
      if (movimiento.error) {
        console.error("[Mercado Pago] No se creó el movimiento del cobro:", movimiento.error.message);
      } else {
        const cobro = await supabase.from("historial_cobros").insert({
          id_cobro: idCobro,
          id_transaccion: idTransaccion,
          id_paciente: turno.id_paciente,
          medio_cobro: medio?.tipo_medio_cobro ?? null,
          medio_cobro_detalle: medio?.detalle_medio_cobro ?? null,
          cuotas: medio?.cuotas ?? null,
          fecha_mov_cobro: fechaCobro,
          importe,
          id_clinica: idClinica,
          concepto_haber: "Otros",
          importe_haber: importe,
          id_medio_cobro: medio?.id_medio_cobro ?? null,
          tipo_ingreso: "Solo Cobro",
          controlado: false,
          acreditado: true,
          comentario: "Pago Automático rebido por Turnero en Mercado Pago",
          interes_cobro: interes,
          neto_mas_interes: neto,
          entidad_emisora: medio?.entidad_emisora ?? null,
        });
        if (cobro.error) console.error("[Mercado Pago] No se registró el cobro:", cobro.error.message);
      }
    }
  }

  return NextResponse.json({ ok: true });
}
