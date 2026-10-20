const VERIFICACION = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

// La verificación solo se pide cuando están las dos claves.
export function turnstileActivo() {
  return Boolean(process.env.TURNSTILE_SITE_KEY && process.env.TURNSTILE_SECRET_KEY);
}

// Devuelve false solo si Cloudflare dice que el código no es válido.
// Si Cloudflare no responde, la reserva sigue y queda el aviso en el log.
export async function verificarTurnstile(token: unknown, ip: string | null) {
  if (!turnstileActivo()) return true;
  const respuesta = typeof token === "string" ? token.trim() : "";
  if (!respuesta || respuesta.length > 2048) return false;

  const formulario = new URLSearchParams({
    secret: process.env.TURNSTILE_SECRET_KEY as string,
    response: respuesta,
  });
  if (ip) formulario.set("remoteip", ip);

  try {
    const res = await fetch(VERIFICACION, {
      method: "POST",
      body: formulario,
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) {
      console.error(`[turnero] Turnstile respondió ${res.status}; se deja pasar la reserva.`);
      return true;
    }
    const datos = (await res.json()) as { success?: boolean };
    return datos.success === true;
  } catch (error) {
    console.error("[turnero] No se pudo consultar Turnstile; se deja pasar la reserva.", error);
    return true;
  }
}
