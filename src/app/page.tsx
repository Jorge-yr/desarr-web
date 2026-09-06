import Hero from "@/components/Hero";
import PageHeader from "@/components/PageHeader";
import SiteFooter from "@/components/SiteFooter";
import TestimonialMarquee from "@/components/TestimonialMarquee";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0F172A]">
      <PageHeader />
      <Hero />
      <TestimonialMarquee />
      <SiteFooter />
    </div>
  );
}
