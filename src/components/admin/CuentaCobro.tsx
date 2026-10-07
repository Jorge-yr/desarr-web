"use client";

import { useEffect, useState } from "react";
import { estadoCuentaCobro, guardarCuentaMercadoPago } from "@/app/admin/cobro/actions";

export function CuentaCobro() {
  const [token, setToken] = useState("");
  const [conectada, setConectada] = useState(false);
  const [cuenta, setCuenta] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    void estadoCuentaCobro().then((estado) => {
      setConectada(estado.conectada);
      setCuenta(estado.cuenta);
    });
  }, []);

  async function guardar() {
    setGuardando(true);
    setError("");
    setMensaje("");
    const resultado = await guardarCuentaMercadoPago(token);
    setGuardando(false);
    if ("error" in resultado && resultado.error) {
      setError(resultado.error);
      return;
    }
    setConectada(true);
    setCuenta(resultado.cuenta ?? "");
    setToken("");
    setMensaje("Mercado Pago quedó conectado a esta cuenta.");
  }

  return (
    <section className="mt-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Cuentas de cobro</p>
      <h2 className="mt-2 text-lg font-semibold">Mercado Pago</h2>
      <p className="mt-2 text-sm text-slate-500">
        Pegá el Access Token de la cuenta donde esta clínica quiere recibir las señas. El token no se vuelve a mostrar.
      </p>
      <p className="mt-3 text-sm">
        {conectada ? (
          <span className="font-medium text-teal-800">Conectada{cuenta ? ` · cuenta ${cuenta}` : ""}</span>
        ) : (
          <span className="text-slate-500">Sin conectar</span>
        )}
      </p>
      <label className="mt-4 flex flex-col gap-1 text-sm">
        <span>{conectada ? "Reemplazar Access Token" : "Access Token"}</span>
        <input
          type="password"
          autoComplete="off"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          className="rounded-lg border border-slate-300 bg-white px-3 py-3"
        />
      </label>
      <button
        type="button"
        onClick={() => void guardar()}
        disabled={guardando || token.trim().length < 20}
        className="mt-4 rounded-lg bg-teal-700 px-4 py-3 text-sm font-semibold text-white disabled:opacity-50"
      >
        {guardando ? "Verificando…" : "Guardar cuenta"}
      </button>
      {mensaje && <p className="mt-3 text-sm text-teal-800">{mensaje}</p>}
      {error && <p className="mt-3 text-sm text-red-700">{error}</p>}
    </section>
  );
}
