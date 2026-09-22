const CASOS = [
  {
    name: "Clinex",
    tag: "App a Medida",
    tagColor: "bg-[#7C3AED]/10 text-[#7C3AED]",
    description:
      "Una app a medida que desarrollamos para digitalizar y ordenar procesos puntuales del negocio: un ejemplo de cómo una solución hecha a medida resuelve una necesidad específica.",
    videoUrl: "https://www.youtube.com/embed/NE2UM285Ntw",
    videoTitle: "Clinex - Desarr Soluciones",
  },
];

export default function CasosExitoSection() {
  return (
    <main className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-14 text-center">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-[#10B981]">
          Casos de Éxito
        </p>
        <h1 className="text-4xl font-extrabold tracking-tight text-[#F8FAFC] sm:text-5xl">
          Resultados Reales para Negocios Reales
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-[#94A3B8]">
          Soluciones a medida que ya están funcionando en el día a día de nuestros clientes.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {CASOS.map((caso) => (
          <div
            key={caso.name}
            className="overflow-hidden rounded-2xl border border-[#7C3AED]/30 bg-slate-800/30 p-6"
          >
            <span className={`${caso.tagColor} mb-3 inline-block rounded-full px-3 py-1 text-xs font-semibold`}>
              {caso.tag}
            </span>
            <h3 className="mb-2 text-xl font-bold text-[#F8FAFC]">{caso.name}</h3>
            <p className="mb-5 text-sm text-[#94A3B8]">{caso.description}</p>
            <div className="mx-auto aspect-[9/16] w-full max-w-[280px] overflow-hidden rounded-xl bg-black">
              <iframe
                src={caso.videoUrl}
                title={caso.videoTitle}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
