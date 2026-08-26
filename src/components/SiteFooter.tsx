import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="border-t border-white/5 bg-[#0F172A] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
        <p className="text-sm text-slate-400">
          Desarr Soluciones. Todos los derechos reservados.
        </p>
        <div className="flex items-center gap-6">
          <Link
            href="https://instagram.com/desarrsoluciones"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-slate-300 transition-colors hover:text-[#10B981]"
          >
            Instagram
          </Link>
          <Link
            href="mailto:desarrsoluciones@gmail.com"
            className="text-sm font-medium text-slate-300 transition-colors hover:text-[#10B981]"
          >
            desarrsoluciones@gmail.com
          </Link>
        </div>
      </div>
    </footer>
  );
}
