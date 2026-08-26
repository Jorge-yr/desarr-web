export default function BrandLogo() {
  return (
    <div className="relative inline-flex h-9 w-auto sm:h-11 md:h-12">
      <style
        dangerouslySetInnerHTML={{
          __html: `
          @keyframes brandSweep {
            0% { left: -45%; }
            45% { left: 145%; }
            100% { left: 145%; }
          }
          @media (prefers-reduced-motion: no-preference) {
            .brand-sweep-band {
              animation: brandSweep 3.6s ease-in-out infinite;
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
        <div className="brand-sweep-band absolute -top-1/2 h-[200%] w-1/4 -skew-x-[35deg] bg-gradient-to-r from-transparent via-white/50 to-transparent" />
      </div>
    </div>
  );
}
