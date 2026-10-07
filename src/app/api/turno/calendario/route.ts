import { NextResponse } from "next/server";

function escapar(valor: string) {
  return valor.replace(/\\/g, "\\\\").replace(/\r?\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
}

function marca(fecha: Date) {
  return fecha.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const inicio = new Date(url.searchParams.get("inicio") ?? "");
  const minutos = Number(url.searchParams.get("min"));
  const profesional = url.searchParams.get("pro")?.trim() || "Profesional";
  const clinica = url.searchParams.get("cli")?.trim() || "Turno";
  if (Number.isNaN(inicio.getTime()) || !Number.isFinite(minutos) || minutos <= 0 || minutos > 24 * 60) {
    return NextResponse.json({ error: "El turno no se puede agregar a la agenda." }, { status: 400 });
  }

  const fin = new Date(inicio.getTime() + minutos * 60_000);
  const titulo = `Turno con ${profesional}`;
  const cuerpo = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Desarr//Turnero//ES",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${crypto.randomUUID()}@desarr.com`,
    `DTSTAMP:${marca(new Date())}`,
    `DTSTART:${marca(inicio)}`,
    `DTEND:${marca(fin)}`,
    `SUMMARY:${escapar(titulo)}`,
    `DESCRIPTION:${escapar(`${clinica}. Turno confirmado con seña.`)}`,
    "END:VEVENT",
    "END:VCALENDAR",
    "",
  ].join("\r\n");

  return new NextResponse(cuerpo, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'attachment; filename="turno.ics"',
    },
  });
}
