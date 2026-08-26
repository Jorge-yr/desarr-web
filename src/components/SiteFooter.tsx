import Link from "next/link";
import AnimatedLogo from "@/components/AnimatedLogo";

export default function SiteFooter() {
  return (
    <footer className="border-t border-white/5 bg-[#0F172A] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 text-center sm:flex-row sm:justify-between sm:text-left">
        <div className="flex flex-col items-center gap-3 sm:items-start">
          <AnimatedLogo />
          <p className="text-sm text-slate-400">
            Todos los derechos reservados.
          </p>
        </div>
        <div className="flex items-center gap-6">
          <Link
            href="https://instagram.com/desarrsoluciones"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm font-medium text-slate-300 transition-colors hover:text-[#10B981]"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
              <rect x="3" y="3" width="18" height="18" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
            </svg>
            @desarrsoluciones
          </Link>
          <Link
            href="mailto:desarrsoluciones@gmail.com"
            className="flex items-center gap-2 text-sm font-medium text-slate-300 transition-colors hover:text-[#10B981]"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="M3 7l9 6 9-6" />
            </svg>
            desarrsoluciones@gmail.com
          </Link>
        </div>
      </div>
    </footer>
  );
}
