/** Base embed URLs (Looker Studio). Each report should expose a parameter `id_clinica`. */
export const LOOKER_BOARDS = [
  {
    key: "ocupacion",
    title: "Ocupación de agenda",
    detail: "Huecos libres y turnos tomados por profesional.",
    env: "LOOKER_STUDIO_OCUPACION",
  },
  {
    key: "senas",
    title: "Señas y cobros",
    detail: "Señas de Mercado Pago contra turnos confirmados.",
    env: "LOOKER_STUDIO_SENAS",
  },
  {
    key: "origen",
    title: "Origen de turnos",
    detail: "Web autogestionada frente a carga desde la clínica.",
    env: "LOOKER_STUDIO_ORIGEN",
  },
] as const;

const ALLOWED_HOSTS = new Set(["lookerstudio.google.com", "looker.com", "datastudio.google.com"]);

export function lookerBoardSources() {
  return LOOKER_BOARDS.map((board) => ({
    key: board.key,
    title: board.title,
    detail: board.detail,
    src: process.env[board.env]?.trim() || "",
  }));
}

/** Appends the clinic filter Looker Studio reads as a report parameter. */
export function lookerEmbedUrl(base: string, idClinica: string) {
  let url: URL;
  try {
    url = new URL(base);
  } catch {
    return null;
  }
  if (!ALLOWED_HOSTS.has(url.hostname)) return null;
  const params = JSON.stringify({
    id_clinica: idClinica,
    "ds0.id_clinica": idClinica,
  });
  url.searchParams.set("params", params);
  return url.toString();
}
