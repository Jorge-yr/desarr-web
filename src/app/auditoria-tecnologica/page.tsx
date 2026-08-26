import PageHeader from "@/components/PageHeader";
import SiteFooter from "@/components/SiteFooter";
import DET from "@/components/DET";

export default function AuditoriaTecnologicaPage() {
  return (
    <main className="min-h-screen bg-[#0F172A] font-sans text-[#F8FAFC]">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(29,78,216,0.1)_0%,_transparent_55%)]"
      />
      <PageHeader />
      <DET />
      <SiteFooter />
    </main>
  );
}
