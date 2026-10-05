import type { Metadata } from "next";
import { HorariosPanel } from "@/components/admin/HorariosPanel";

export const metadata: Metadata = {
  title: "Gestión de horarios | Turnero",
  robots: { index: false, follow: false },
};

export default function HorariosAdminPage() {
  return <HorariosPanel />;
}
