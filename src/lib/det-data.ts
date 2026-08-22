export type IconType =
  | "clipboard"
  | "spreadsheet"
  | "server"
  | "cloud"
  | "folder"
  | "shield"
  | "lock"
  | "manual"
  | "macro"
  | "workflow"
  | "bot"
  | "phone"
  | "crm"
  | "pipeline"
  | "hub"
  | "guess"
  | "report"
  | "dashboard"
  | "analytics"
  | "silos"
  | "export"
  | "partial"
  | "unified"
  | "bottleneck"
  | "linear"
  | "documented"
  | "scale";

export interface AnswerOption {
  id: string;
  label: string;
  description: string;
  score: 1 | 2 | 3 | 4;
  icon: IconType;
}

export interface Question {
  id: number;
  title: string;
  options: AnswerOption[];
}

export interface MaturityLevel {
  min: number;
  max: number;
  level: number;
  name: string;
  diagnosis: string;
  recommendations: [string, string];
}

export const COMPANY_TYPES = [
  "Financiera",
  "Comercial Mayorista",
  "Comercial Minorista",
  "Comercial de Servicios",
  "Manufacturera",
  "Extractiva",
  "Industrial",
  "Otros",
] as const;

export type CompanyType = (typeof COMPANY_TYPES)[number];

export const QUESTIONS: Question[] = [
  {
    id: 1,
    title: "Gestión de Registros y Operaciones Diarias",
    options: [
      {
        id: "q1-o1",
        label: "Registros en papel o archivos físicos",
        description:
          "Cuadernos, planillas impresas o carpetas sin digitalización central.",
        score: 1,
        icon: "clipboard",
      },
      {
        id: "q1-o2",
        label: "Hojas de cálculo dispersas",
        description:
          "Excel o Google Sheets en distintos equipos, sin una fuente única.",
        score: 2,
        icon: "spreadsheet",
      },
      {
        id: "q1-o3",
        label: "Sistema operativo parcial",
        description:
          "ERP o software básico cubre procesos clave, pero con brechas.",
        score: 3,
        icon: "server",
      },
      {
        id: "q1-o4",
        label: "Plataforma integrada en tiempo real",
        description:
          "Operaciones trazables, actualizadas y accesibles desde un solo lugar.",
        score: 4,
        icon: "cloud",
      },
    ],
  },
  {
    id: 2,
    title: "Centralización y Seguridad de la Información",
    options: [
      {
        id: "q2-o1",
        label: "Información fragmentada sin respaldo",
        description:
          "Datos repartidos en dispositivos personales sin política de backup.",
        score: 1,
        icon: "folder",
      },
      {
        id: "q2-o2",
        label: "Respaldos manuales ocasionales",
        description:
          "Copias esporádicas y accesos compartidos sin control de permisos.",
        score: 2,
        icon: "manual",
      },
      {
        id: "q2-o3",
        label: "Repositorio central con roles",
        description:
          "Servidor o nube centralizada con permisos básicos por usuario.",
        score: 3,
        icon: "lock",
      },
      {
        id: "q2-o4",
        label: "Infraestructura segura y auditada",
        description:
          "Cifrado, políticas de acceso, trazabilidad y respaldos automatizados.",
        score: 4,
        icon: "shield",
      },
    ],
  },
  {
    id: 3,
    title: "Automatización de Tareas Repetitivas",
    options: [
      {
        id: "q3-o1",
        label: "Procesos 100% manuales",
        description:
          "Tareas repetitivas ejecutadas a mano en cada ciclo operativo.",
        score: 1,
        icon: "manual",
      },
      {
        id: "q3-o2",
        label: "Automatización puntual",
        description:
          "Algunas macros, plantillas o atajos, pero sin flujos formales.",
        score: 2,
        icon: "macro",
      },
      {
        id: "q3-o3",
        label: "Automatización parcial",
        description:
          "Herramientas conectan áreas clave, aunque con intervención humana.",
        score: 3,
        icon: "workflow",
      },
      {
        id: "q3-o4",
        label: "Flujos automatizados end-to-end",
        description:
          "Procesos orquestados con monitoreo, alertas y mínima fricción manual.",
        score: 4,
        icon: "bot",
      },
    ],
  },
  {
    id: 4,
    title: "Gestión de Clientes, Citas o Pedidos",
    options: [
      {
        id: "q4-o1",
        label: "Agenda informal o mensajería",
        description:
          "WhatsApp, llamadas o agenda física sin historial estructurado.",
        score: 1,
        icon: "phone",
      },
      {
        id: "q4-o2",
        label: "Seguimiento en planillas",
        description:
          "Listas o CRM básico con datos desactualizados o incompletos.",
        score: 2,
        icon: "spreadsheet",
      },
      {
        id: "q4-o3",
        label: "CRM con pipeline activo",
        description:
          "Etapas de venta, recordatorios y visibilidad del equipo comercial.",
        score: 3,
        icon: "crm",
      },
      {
        id: "q4-o4",
        label: "CRM integrado al negocio",
        description:
          "Clientes, pedidos, facturación y soporte conectados en un ecosistema.",
        score: 4,
        icon: "hub",
      },
    ],
  },
  {
    id: 5,
    title: "Reportes y Toma de Decisiones",
    options: [
      {
        id: "q5-o1",
        label: "Decisiones por intuición",
        description:
          "Sin reportes formales; la dirección opera con percepción del día a día.",
        score: 1,
        icon: "guess",
      },
      {
        id: "q5-o2",
        label: "Reportes manuales periódicos",
        description:
          "Consolidación mensual en Excel con demora y riesgo de error.",
        score: 2,
        icon: "report",
      },
      {
        id: "q5-o3",
        label: "Dashboards básicos",
        description:
          "Indicadores visibles con actualización semanal o quincenal.",
        score: 3,
        icon: "dashboard",
      },
      {
        id: "q5-o4",
        label: "Business Intelligence en tiempo real",
        description:
          "KPIs vivos, alertas automáticas y análisis para decisiones ágiles.",
        score: 4,
        icon: "analytics",
      },
    ],
  },
  {
    id: 6,
    title: "Integración entre Ventas, Cobranzas y Finanzas",
    options: [
      {
        id: "q6-o1",
        label: "Áreas desconectadas",
        description:
          "Reconciliación manual entre ventas, cobros y contabilidad.",
        score: 1,
        icon: "silos",
      },
      {
        id: "q6-o2",
        label: "Intercambio manual de datos",
        description:
          "Exportaciones e importaciones entre sistemas sin sincronización.",
        score: 2,
        icon: "export",
      },
      {
        id: "q6-o3",
        label: "Integración parcial",
        description:
          "Algunos módulos conectados, pero con duplicidad de registros.",
        score: 3,
        icon: "partial",
      },
      {
        id: "q6-o4",
        label: "Flujo financiero unificado",
        description:
          "Una sola fuente de verdad desde la venta hasta el cierre contable.",
        score: 4,
        icon: "unified",
      },
    ],
  },
  {
    id: 7,
    title: "Capacidad de Escalamiento Operativo",
    options: [
      {
        id: "q7-o1",
        label: "Crecimiento bloqueado por lo manual",
        description:
          "Más volumen implica más caos operativo y cuellos de botella.",
        score: 1,
        icon: "bottleneck",
      },
      {
        id: "q7-o2",
        label: "Escalar exige más personal",
        description:
          "El crecimiento es lineal: más demanda, más contrataciones.",
        score: 2,
        icon: "linear",
      },
      {
        id: "q7-o3",
        label: "Procesos documentados",
        description:
          "Manuales y rutinas permiten absorber crecimiento moderado.",
        score: 3,
        icon: "documented",
      },
      {
        id: "q7-o4",
        label: "Arquitectura preparada para escalar",
        description:
          "Infraestructura y procesos listos para multiplicar operaciones sin fricción.",
        score: 4,
        icon: "scale",
      },
    ],
  },
];

export const MATURITY_LEVELS: MaturityLevel[] = [
  {
    min: 7,
    max: 12,
    level: 1,
    name: "Despertar Operativo",
    diagnosis:
      "Tu organización opera con bases mayormente manuales y fragmentadas. Existe alto riesgo operativo, dependencia de personas clave y poca visibilidad para decidir con datos. Es el momento ideal para estructurar lo esencial antes de escalar.",
    recommendations: [
      "Centralizar registros críticos en una plataforma digital única con respaldos automáticos.",
      "Priorizar la digitalización de los 2 procesos que más tiempo consumen al equipo.",
    ],
  },
  {
    min: 13,
    max: 18,
    level: 2,
    name: "Digitalización Inicial",
    diagnosis:
      "Ya adoptaste herramientas digitales, pero conviven con procesos paralelos y datos duplicados. La operación funciona, aunque con esfuerzo extra para consolidar información y coordinar áreas.",
    recommendations: [
      "Eliminar planillas redundantes conectando ventas, cobranzas y finanzas en un flujo base.",
      "Implementar automatizaciones simples en tareas repetitivas de alto impacto.",
    ],
  },
  {
    min: 19,
    max: 23,
    level: 3,
    name: "Gestión Conectada",
    diagnosis:
      "Tu empresa cuenta con sistemas conectados y visibilidad operativa razonable. El siguiente salto está en reducir fricción entre áreas, estandarizar indicadores y acelerar la toma de decisiones.",
    recommendations: [
      "Definir un tablero ejecutivo con KPIs compartidos entre dirección y operaciones.",
      "Integrar CRM, facturación y finanzas para eliminar reconciliaciones manuales.",
    ],
  },
  {
    min: 24,
    max: 28,
    level: 4,
    name: "Madurez Analítica",
    diagnosis:
      "Tu operación muestra madurez tecnológica sólida: datos centralizados, procesos automatizados y capacidad analítica. El foco ahora es optimizar, predecir y escalar con inteligencia de negocios avanzada.",
    recommendations: [
      "Evolucionar dashboards operativos hacia modelos predictivos y alertas proactivas.",
      "Auditar la arquitectura de datos para sostener crecimiento acelerado sin perder control.",
    ],
  },
];

export function getMaturityLevel(score: number): MaturityLevel {
  const match = MATURITY_LEVELS.find(
    (level) => score >= level.min && score <= level.max,
  );
  return match ?? MATURITY_LEVELS[0];
}
