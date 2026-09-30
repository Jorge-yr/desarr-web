export interface Partner {
  id: string;
  name: string;
  specialty: string;
  description: string;
  imageUrl: string;
  socialType: "instagram" | "web" | "linkedin";
  socialUrl: string;
  partnerEmail: string;
}

export const PARTNERS: Partner[] = [
  {
    id: "partner-1",
    name: "Marcos Ferreyra Stivanello",
    specialty: "Coach en Finanzas",
    description:
      "Acompañamiento para optimizar hábitos financieros, controlar erogaciones y tomar el control económico en negocios y profesionales independientes.",
    imageUrl: "/partners/partner_1.jpg",
    socialType: "instagram",
    socialUrl: "https://www.instagram.com/marcos.ferreyra.stivanello/",
    partnerEmail: "mferreyrastivanello@gmail.com",
  },
  {
    id: "partner-2",
    name: "ID³ Consultora",
    specialty: "Ingeniería Industrial y Prospectiva",
    description:
      "Ingeniería de gestión en procesos, datos y prospectiva. Convertimos problemas operativos complejos en decisiones rentables, simples y predecibles.",
    imageUrl: "/partners/partner_2.jpg",
    socialType: "web",
    socialUrl: "https://exequielafernandez.com/",
    partnerEmail: "exequielafernandez@gmail.com",
  },
];

export function getPartnerById(id: string) {
  return PARTNERS.find((partner) => partner.id === id);
}
