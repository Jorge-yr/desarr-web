import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Desarr Soluciones | Business Intelligence y Automatización",
  description:
    "Soluciones de desarrollo web moderno, optimización y software a medida para potenciar tu negocio.",
  metadataBase: new URL("https://www.desarr.com"),
  alternates: {
    canonical: "https://www.desarr.com",
  },
  openGraph: {
    title: "Desarr Soluciones",
    description: "Soluciones de desarrollo web y software a medida.",
    url: "https://www.desarr.com",
    siteName: "Desarr Soluciones",
    locale: "es_ES",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
