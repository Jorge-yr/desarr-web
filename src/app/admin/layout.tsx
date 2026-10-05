import type { Metadata } from "next";
import { AdminGate } from "@/components/admin/AdminGate";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return <AdminGate>{children}</AdminGate>;
}
