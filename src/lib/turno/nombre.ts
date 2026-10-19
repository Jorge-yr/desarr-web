// Primera letra de cada palabra en mayúscula, igual que initcap en la base.
export function formatoCapital(texto: string) {
  return texto
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase()
    .replace(/(^|[^\p{L}\p{N}])(\p{L})/gu, (_, separador: string, letra: string) => separador + letra.toUpperCase());
}
