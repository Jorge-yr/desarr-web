"use client";

import { useEffect, useRef, useState } from "react";

type TurnstileApi = {
  render: (
    contenedor: HTMLElement,
    opciones: {
      sitekey: string;
      language?: string;
      callback: (token: string) => void;
      "expired-callback": () => void;
      "error-callback": () => void;
    },
  ) => string;
  reset: (id: string) => void;
  remove: (id: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

let cargando: Promise<void> | null = null;

function cargarScript() {
  if (window.turnstile) return Promise.resolve();
  cargando ??= new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      cargando = null;
      reject(new Error("No se pudo cargar Turnstile."));
    };
    document.head.appendChild(script);
  });
  return cargando;
}

// Cada código sirve una sola vez: al cambiar resetKey se pide uno nuevo.
export function TurnstileWidget({
  siteKey,
  onToken,
  resetKey,
}: {
  siteKey: string;
  onToken: (token: string) => void;
  resetKey: number;
}) {
  const contenedor = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const alToken = useRef(onToken);
  const [fallo, setFallo] = useState(false);

  useEffect(() => {
    alToken.current = onToken;
  });

  useEffect(() => {
    let cancelado = false;
    cargarScript()
      .then(() => {
        if (cancelado || !contenedor.current || !window.turnstile) return;
        widgetId.current = window.turnstile.render(contenedor.current, {
          sitekey: siteKey,
          language: "es",
          callback: (token) => alToken.current(token),
          "expired-callback": () => alToken.current(""),
          "error-callback": () => alToken.current(""),
        });
      })
      .catch(() => {
        if (!cancelado) setFallo(true);
      });
    return () => {
      cancelado = true;
      if (widgetId.current && window.turnstile) window.turnstile.remove(widgetId.current);
      widgetId.current = null;
    };
  }, [siteKey]);

  useEffect(() => {
    if (resetKey === 0 || !widgetId.current || !window.turnstile) return;
    window.turnstile.reset(widgetId.current);
  }, [resetKey]);

  return (
    <div className="mt-3">
      <div ref={contenedor} />
      {fallo && (
        <p className="text-sm text-red-700">No se pudo cargar la verificación. Recargá la página e intentá de nuevo.</p>
      )}
    </div>
  );
}
