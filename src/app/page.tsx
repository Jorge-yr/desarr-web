export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 text-zinc-100 p-6">
      <div className="max-w-xl text-center space-y-4">
        <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-800 rounded-full">
          Proyecto Activo
        </span>
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
          desarr-web
        </h1>
        <p className="text-zinc-400 text-base sm:text-lg">
          Primera página web creada con Next.js, React y Tailwind CSS.
        </p>
        <div className="pt-4 flex justify-center gap-3">
          <button className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition-colors shadow-sm">
            Comenzar
          </button>
          <button className="px-5 py-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium text-sm transition-colors border border-zinc-700">
            Documentación
          </button>
        </div>
      </div>
    </main>
  );
}