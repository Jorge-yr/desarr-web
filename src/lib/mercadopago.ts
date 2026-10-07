type PreferenciaInput = {
  accessToken: string;
  titulo: string;
  importe: number;
  externalReference: string;
  metadata: Record<string, string>;
  successUrl: string;
  failureUrl: string;
  pendingUrl: string;
  notificationUrl: string;
};

export async function crearPreferencia(input: PreferenciaInput) {
  const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${input.accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      items: [
        {
          title: input.titulo,
          quantity: 1,
          currency_id: "ARS",
          unit_price: input.importe,
        },
      ],
      external_reference: input.externalReference,
      metadata: input.metadata,
      back_urls: {
        success: input.successUrl,
        failure: input.failureUrl,
        pending: input.pendingUrl,
      },
      auto_return: "approved",
      notification_url: input.notificationUrl,
    }),
  });

  const body = (await response.json()) as { init_point?: string; message?: string; error?: string };
  if (!response.ok || !body.init_point) {
    throw new Error(body.message || body.error || "Mercado Pago no creó la preferencia.");
  }
  return body.init_point;
}

export async function cuentaMercadoPago(accessToken: string) {
  const response = await fetch("https://api.mercadopago.com/users/me", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!response.ok) return null;
  const body = (await response.json()) as { id?: number };
  return body.id ? String(body.id) : null;
}

export async function obtenerPago(accessToken: string, paymentId: string) {
  const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!response.ok) return null;
  return (await response.json()) as {
    id: number;
    status: string;
    transaction_amount: number;
    external_reference: string | null;
    metadata?: Record<string, string>;
  };
}
