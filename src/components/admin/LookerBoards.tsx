"use client";

import { useAdminClinic } from "@/components/admin/AdminClinicContext";
import { lookerEmbedUrl } from "@/lib/looker";

export type LookerBoardSource = {
  key: string;
  title: string;
  detail: string;
  src: string;
};

export function LookerBoards({ boards }: { boards: LookerBoardSource[] }) {
  const clinic = useAdminClinic();

  return (
    <div className="mt-8 grid gap-4">
      {boards.map((board) => {
        const src = board.src ? lookerEmbedUrl(board.src, clinic.idClinica) : null;
        return (
          <article key={board.key} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-5 py-4">
              <h2 className="font-semibold text-[#0F172A]">{board.title}</h2>
              <p className="mt-1 text-sm text-slate-600">{board.detail}</p>
            </div>
            {src ? (
              <iframe
                title={`${board.title} · ${clinic.clinica}`}
                src={src}
                className="h-[520px] w-full bg-white"
                allow="fullscreen"
                referrerPolicy="strict-origin-when-cross-origin"
              />
            ) : (
              <div className="grid h-40 place-items-center bg-slate-50 px-6 text-center text-sm text-slate-500">
                Este tablero todavía no tiene un informe de Looker publicado para {clinic.idClinica}.
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}
