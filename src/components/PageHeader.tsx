import Link from "next/link";
import AnimatedLogo from "@/components/AnimatedLogo";

export default function PageHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-[#0F172A]/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center px-4 py-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="transition-opacity hover:opacity-80"
          aria-label="Volver al inicio - Desarr Soluciones"
        >
          <AnimatedLogo />
        </Link>
      </div>
    </header>
  );
}
