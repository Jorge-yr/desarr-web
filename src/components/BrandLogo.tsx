export default function BrandLogo() {
  return (
    <div className="relative inline-flex h-9 w-auto sm:h-11 md:h-12">
      <style
        dangerouslySetInnerHTML={{
          __html: `
          @keyframes brandReveal {
            0% { left: -10%; }
            18% { left: 130%; }
            100% { left: 130%; }
          }
          @media (prefers-reduced-motion: no-preference) {
            .brand-cover {
              animation: brandReveal 5s cubic-bezier(.65,0,.35,1) infinite alternate;
            }
          }
        `,
        }}
      />

      <img
        src="/logo-desarr.webp"
        alt="Desarr Soluciones"
        className="h-full w-auto select-none"
      />

      <div className="pointer-events-none absolute inset-y-0 left-[24%] right-0 overflow-hidden">
        <div className="brand-cover absolute -top-1/2 h-[200%] w-[120%] -skew-x-[35deg] bg-[#0F172A]" />
      </div>
    </div>
  );
}
