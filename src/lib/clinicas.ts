export type Profesional = {
  id: string;
  nombre: string;
  especialidad: string;
};

export type ClinicaAdmin = {
  idClinica: string;
  clinica: string;
  email: string;
  profesionales: Profesional[];
};

/** Maqueta del maestro de administradores. El login resuelve un solo id_clinica. */
export const CLINICAS: ClinicaAdmin[] = [
  {
    idClinica: "CL001",
    clinica: "Clínica Demo",
    email: "admin@clinica.demo",
    profesionales: [
      { id: "prof-ana", nombre: "Dra. Ana López", especialidad: "Odontología" },
      { id: "prof-martin", nombre: "Dr. Martín Ruiz", especialidad: "Kinesiología" },
      { id: "prof-sofia", nombre: "Lic. Sofía Pereyra", especialidad: "Nutrición" },
    ],
  },
  {
    idClinica: "CL002",
    clinica: "Consultorio Norte",
    email: "admin@norte.demo",
    profesionales: [
      { id: "prof-lucia", nombre: "Dra. Lucía Gómez", especialidad: "Clínica médica" },
      { id: "prof-pablo", nombre: "Lic. Pablo Benítez", especialidad: "Kinesiología" },
    ],
  },
];

export function clinicaPorEmail(email: string) {
  const normalized = email.trim().toLowerCase();
  return CLINICAS.find((c) => c.email === normalized) ?? null;
}
