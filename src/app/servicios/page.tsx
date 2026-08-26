import PageHeader from "@/components/PageHeader";
import SiteFooter from "@/components/SiteFooter";
import ServiciosSection from "@/components/ServiciosSection";

export default function ServiciosPage() {
  return (
    <div className="min-h-screen bg-[#0F172A]">
      <PageHeader />
      <ServiciosSection />
      <SiteFooter />
    </div>
  );
}
