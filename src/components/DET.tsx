"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  COMPANY_TYPES,
  getMaturityLevel,
  QUESTIONS,
  type AnswerOption,
  type CompanyType,
  type IconType,
  type Question,
} from "@/lib/det-data";

interface SelectedAnswer {
  questionId: number;
  questionTitle: string;
  selectedLabel: string;
  score: number;
}

interface LeadForm {
  fullName: string;
  company: string;
  email: string;
  phoneCountryCode: string;
  phoneNumber: string;
  country: string;
  state: string;
  companyTypes: CompanyType[];
  otherCompanyType: string;
}

interface ShuffledQuestion extends Question {
  options: AnswerOption[];
}

interface PhoneCountry {
  code: string;
  label: string;
}

type SubmitState = "idle" | "loading" | "error" | "confirmation";
type CurtainAnimation = "idle" | "out" | "in";

const PHONE_COUNTRIES: PhoneCountry[] = [
  { code: "+549", label: "Argentina" },
  { code: "+598", label: "Uruguay" },
  { code: "+56", label: "Chile" },
  { code: "+57", label: "Colombia" },
  { code: "+52", label: "México" },
  { code: "+51", label: "Perú" },
  { code: "+55", label: "Brasil" },
  { code: "+593", label: "Ecuador" },
  { code: "+595", label: "Paraguay" },
  { code: "+591", label: "Bolivia" },
  { code: "+34", label: "España" },
  { code: "+1", label: "Estados Unidos" },
  { code: "+44", label: "Reino Unido" },
];

const FORM_INPUT_CLASS =
  "w-full rounded-lg border border-slate-300 bg-[#F8FAFC] px-4 py-3 text-[#0F172A] placeholder:text-slate-500 outline-none transition-colors focus:border-[#10B981] focus:ring-2 focus:ring-[#10B981]/20";

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function AnimatedGlobe({ spinning }: { spinning: boolean }) {
  return (
    <svg
      className={`h-5 w-5 shrink-0 text-[#1D4ED8] ${spinning ? "det-globe-spin" : ""}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.8 4 6 4 9s-1.5 6.2-4 9M12 3c-2.5 2.8-4 6-4 9s1.5 6.2 4 9" />
    </svg>
  );
}

function PhoneCountrySelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (code: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`flex h-full min-w-[5.5rem] items-center justify-between gap-1 rounded-lg border border-slate-300 bg-[#F8FAFC] px-3 py-3 text-sm font-semibold text-[#0F172A] transition-colors hover:border-[#10B981] ${open ? "border-[#10B981] ring-2 ring-[#10B981]/20" : ""}`}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span>{value}</span>
        <svg className="h-4 w-4 text-slate-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute left-0 top-[calc(100%+0.35rem)] z-20 max-h-52 w-56 overflow-y-auto rounded-lg border border-slate-200 bg-white py-1 shadow-xl"
        >
          {PHONE_COUNTRIES.map((country) => (
            <li key={country.code} role="option" aria-selected={value === country.code}>
              <button
                type="button"
                onClick={() => {
                  onChange(country.code);
                  setOpen(false);
                }}
                className={`flex w-full items-center justify-between px-3 py-2.5 text-left text-sm transition-colors hover:bg-slate-100 ${value === country.code ? "bg-[#10B981]/10 font-medium text-[#0F172A]" : "text-slate-700"}`}
              >
                <span>{country.label}</span>
                <span className="text-slate-500">{country.code}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function OptionIcon({ type }: { type: IconType }) {
  const className = "h-6 w-6 shrink-0";

  switch (type) {
    case "clipboard":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
          <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
          <rect x="9" y="3" width="6" height="4" rx="1" />
        </svg>
      );
    case "spreadsheet":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <path d="M3 10h18M9 4v16M15 4v16" />
        </svg>
      );
    case "server":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
          <rect x="2" y="3" width="20" height="6" rx="2" />
          <rect x="2" y="15" width="20" height="6" rx="2" />
          <circle cx="7" cy="6" r="1" fill="currentColor" stroke="none" />
          <circle cx="7" cy="18" r="1" fill="currentColor" stroke="none" />
        </svg>
      );
    case "cloud":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
          <path d="M7 18h10a4 4 0 0 0 0-8 5.5 5.5 0 0 0-10.6 1.8A3.5 3.5 0 0 0 7 18z" />
        </svg>
      );
    case "folder":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
          <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" />
        </svg>
      );
    case "shield":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
          <path d="M12 3 4 6v6c0 5 3.4 9.7 8 10 4.6-.3 8-5 8-10V6l-8-3z" />
        </svg>
      );
    case "lock":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
          <rect x="5" y="11" width="14" height="10" rx="2" />
          <path d="M8 11V8a4 4 0 0 1 8 0v3" />
        </svg>
      );
    case "manual":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
          <path d="M7 4h10v16l-5-3-5 3V4z" />
        </svg>
      );
    case "macro":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
          <path d="M4 7h16M4 12h10M4 17h6" />
          <circle cx="18" cy="17" r="3" />
        </svg>
      );
    case "workflow":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
          <rect x="3" y="3" width="6" height="6" rx="1" />
          <rect x="15" y="3" width="6" height="6" rx="1" />
          <rect x="9" y="15" width="6" height="6" rx="1" />
          <path d="M6 9v3h6v3M18 9v3h-6" />
        </svg>
      );
    case "bot":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
          <rect x="4" y="8" width="16" height="11" rx="2" />
          <path d="M12 3v3M8 12h.01M16 12h.01M9 17h6" />
          <path d="M8 3h8" />
        </svg>
      );
    case "phone":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
          <path d="M8 3h8l1 5-4 2v8l-2 1-2-1v-8l-4-2 1-5z" />
        </svg>
      );
    case "crm":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
          <circle cx="9" cy="8" r="3" />
          <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
          <path d="M16 8h5M18.5 5.5v5" />
        </svg>
      );
    case "pipeline":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
          <path d="M4 6h16M4 12h10M4 18h6" />
          <circle cx="19" cy="12" r="2" />
        </svg>
      );
    case "hub":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
          <circle cx="12" cy="12" r="3" />
          <path d="M12 3v6M12 15v6M3 12h6M15 12h6" />
        </svg>
      );
    case "guess":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
          <circle cx="12" cy="12" r="9" />
          <path d="M9.5 9a2.5 2.5 0 0 1 4.2 1.8c0 2-2.2 2.2-2.2 4.2M12 17h.01" />
        </svg>
      );
    case "report":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
          <path d="M6 4h9l3 3v13H6V4z" />
          <path d="M9 13h6M9 17h4" />
        </svg>
      );
    case "dashboard":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
          <rect x="3" y="3" width="8" height="8" rx="1" />
          <rect x="13" y="3" width="8" height="5" rx="1" />
          <rect x="13" y="10" width="8" height="11" rx="1" />
          <rect x="3" y="13" width="8" height="8" rx="1" />
        </svg>
      );
    case "analytics":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
          <path d="M4 19V5M4 19h16" />
          <path d="M8 15l3-4 3 2 4-6" />
        </svg>
      );
    case "silos":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
          <rect x="3" y="4" width="5" height="16" rx="1" />
          <rect x="10" y="8" width="5" height="12" rx="1" />
          <rect x="17" y="6" width="4" height="14" rx="1" />
        </svg>
      );
    case "export":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
          <path d="M12 3v10M8 9l4 4 4-4" />
          <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
        </svg>
      );
    case "partial":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="12" r="3" />
          <path d="M9 12h3M12 12h3" strokeDasharray="2 2" />
        </svg>
      );
    case "unified":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
          <circle cx="12" cy="12" r="3" />
          <path d="M12 3v3M12 18v3M3 12h3M18 12h3" />
          <path d="M5.6 5.6 7.8 7.8M16.2 16.2l2.2 2.2M18.4 5.6l-2.2 2.2M7.8 16.2l-2.2 2.2" />
        </svg>
      );
    case "bottleneck":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
          <path d="M4 6h16v3H4zM7 9v3h10V9M9 12v3h6v-3M10 15v3h4v-3" />
        </svg>
      );
    case "linear":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
          <path d="M4 18h16M4 14h12M4 10h8M4 6h4" />
        </svg>
      );
    case "documented":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
          <path d="M7 4h7l3 3v13H7V4z" />
          <path d="M14 4v3h3M9 12h6M9 16h4" />
        </svg>
      );
    case "scale":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
          <path d="M4 16l4-4 4 3 5-6 3 4" />
          <path d="M4 20h16" />
        </svg>
      );
    default:
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
          <circle cx="12" cy="12" r="9" />
        </svg>
      );
  }
}

const EMPTY_LEAD: LeadForm = {
  fullName: "",
  company: "",
  email: "",
  phoneCountryCode: "+549",
  phoneNumber: "",
  country: "",
  state: "",
  companyTypes: [],
  otherCompanyType: "",
};

export default function DET() {
  const router = useRouter();
  const shuffledQuestions = useMemo<ShuffledQuestion[]>(
    () =>
      QUESTIONS.map((question) => ({
        ...question,
        options: shuffleArray(question.options),
      })),
    [],
  );

  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<SelectedAnswer[]>([]);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [curtainAnim, setCurtainAnim] = useState<CurtainAnimation>("idle");
  const [lead, setLead] = useState<LeadForm>(EMPTY_LEAD);
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [wantsAdvisorContact, setWantsAdvisorContact] = useState(true);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationMessage, setLocationMessage] = useState<string | null>(null);

  const isComplete = currentStep >= shuffledQuestions.length;
  const totalScore = answers.reduce((sum, answer) => sum + answer.score, 0);
  const maturity = getMaturityLevel(totalScore);
  const progress = isComplete
    ? 100
    : Math.round((currentStep / shuffledQuestions.length) * 100);

  const isConfirmation = submitState === "confirmation";
  const screenKey = isConfirmation
    ? "confirmation"
    : isComplete
      ? "results"
      : `question-${currentStep}`;

  const curtainClass =
    curtainAnim === "out"
      ? "det-curtain-out"
      : curtainAnim === "in"
        ? "det-curtain-in"
        : "";

  const handleSelectOption = (question: ShuffledQuestion, option: AnswerOption) => {
    if (curtainAnim === "out") return;

    setSelectedOptionId(option.id);

    const nextAnswer: SelectedAnswer = {
      questionId: question.id,
      questionTitle: question.title,
      selectedLabel: option.label,
      score: option.score,
    };

    setCurtainAnim("out");

    window.setTimeout(() => {
      setAnswers((prev) => [...prev, nextAnswer]);
      setSelectedOptionId(null);
      setCurrentStep((prev) => prev + 1);
      setCurtainAnim("in");
      window.setTimeout(() => setCurtainAnim("idle"), 420);
    }, 380);
  };

  const toggleCompanyType = (type: CompanyType) => {
    setLead((prev) => {
      const isRemoving = prev.companyTypes.includes(type);

      return {
        ...prev,
        companyTypes: isRemoving
          ? prev.companyTypes.filter((item) => item !== type)
          : [...prev.companyTypes, type],
        otherCompanyType:
          type === "Otros" && isRemoving ? "" : prev.otherCompanyType,
      };
    });
  };

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setLocationMessage("Tu navegador no soporta geolocalización.");
      return;
    }

    setLocationLoading(true);
    setLocationMessage(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=es`,
          );

          if (!response.ok) throw new Error("Geocoding failed");

          const data = (await response.json()) as {
            address?: {
              country?: string;
              state?: string;
              region?: string;
              province?: string;
            };
          };

          const country = data.address?.country ?? "";
          const state =
            data.address?.state ??
            data.address?.region ??
            data.address?.province ??
            "";

          setLead((prev) => ({ ...prev, country, state }));
          setLocationMessage("Ubicación detectada correctamente.");
        } catch {
          setLocationMessage("No pudimos detectar tu ubicación. Complétala manualmente.");
        } finally {
          setLocationLoading(false);
        }
      },
      () => {
        setLocationLoading(false);
        setLocationMessage("Permiso de ubicación denegado o no disponible.");
      },
    );
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitState("loading");

    const fullPhone = `${lead.phoneCountryCode}${lead.phoneNumber.replace(/\s/g, "")}`;

    try {
      const response = await fetch("/api/det-submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lead: { ...lead, phone: fullPhone },
          score: totalScore,
          maturityLevel: `Nivel ${maturity.level} - ${maturity.name}`,
          answers,
        }),
      });

      if (!response.ok) throw new Error("Submit failed");

      setCurtainAnim("out");
      window.setTimeout(() => {
        setSubmitState("confirmation");
        setCurtainAnim("in");
        window.setTimeout(() => setCurtainAnim("idle"), 420);
      }, 380);
    } catch {
      setSubmitState("error");
    }
  };

  const handleAccept = async () => {
    const fullPhone = `${lead.phoneCountryCode}${lead.phoneNumber.replace(/\s/g, "")}`;

    try {
      await fetch("/api/det-submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lead: { ...lead, phone: fullPhone },
          score: totalScore,
          maturityLevel: `Nivel ${maturity.level} - ${maturity.name}`,
          answers,
          wantsAdvisorContact,
          confirmed: true,
        }),
      });
    } catch {
      // La solicitud principal ya fue enviada; no bloqueamos el cierre.
    }

    router.push("/");
  };

  return (
    <section className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <p className="text-sm font-medium uppercase tracking-wider text-[#10B981]">
          Diagnóstico de Estado Tecnológico
        </p>
        <h2 className="mt-2 text-2xl font-bold text-[#F8FAFC] sm:text-3xl">
          Evalúa la madurez digital de tu operación
        </h2>
        <p className="mt-3 text-sm text-slate-400 sm:text-base">
          7 preguntas · 3 minutos · Resultado personalizado con recomendaciones
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#1E293B] bg-[#0F172A] shadow-xl shadow-black/20">
        <div className="relative overflow-hidden">
          <div key={screenKey} className={curtainClass}>
            {!isComplete ? (
              <div className="p-6 sm:p-8">
                <div className="mb-6">
                  <div className="mb-2 flex items-center justify-between text-sm text-slate-400">
                    <span>
                      Pregunta {currentStep + 1} de {shuffledQuestions.length}
                    </span>
                    <span>{progress}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                    <div
                      className="h-full rounded-full bg-[#10B981] transition-all duration-500 ease-out"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-[#F8FAFC] sm:text-2xl">
                  {shuffledQuestions[currentStep].title}
                </h3>
                <p className="mt-2 text-sm text-slate-400">
                  Selecciona la opción que mejor describe tu situación actual.
                </p>

                <div className="mt-6 grid gap-3">
                  {shuffledQuestions[currentStep].options.map((option) => {
                    const isSelected = selectedOptionId === option.id;

                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() =>
                          handleSelectOption(shuffledQuestions[currentStep], option)
                        }
                        className={`group flex w-full items-start gap-4 rounded-xl border p-4 text-left transition-all duration-200 sm:p-5 ${
                          isSelected
                            ? "border-[#10B981] bg-[#10B981]/10 shadow-[0_0_0_1px_rgba(16,185,129,0.35)]"
                            : "border-[#1E293B] bg-slate-900/40 hover:border-[#10B981]/40 hover:bg-slate-800/50"
                        }`}
                      >
                        <span
                          className={`mt-0.5 rounded-lg p-2 transition-colors ${
                            isSelected
                              ? "bg-[#10B981]/20 text-[#10B981]"
                              : "bg-slate-800 text-slate-300 group-hover:text-[#10B981]"
                          }`}
                        >
                          <OptionIcon type={option.icon} />
                        </span>
                        <span>
                          <span className="block text-base font-medium text-[#F8FAFC]">
                            {option.label}
                          </span>
                          <span className="mt-1 block text-sm text-slate-400">
                            {option.description}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : isConfirmation ? (
              <div className="p-6 text-center sm:p-10">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-[#10B981]/30 bg-[#10B981]/10">
                  <svg
                    className="h-8 w-8 text-[#10B981]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden
                  >
                    <path d="M4 12l4 4 12-12" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>

                <h3 className="text-xl font-bold text-[#F8FAFC] sm:text-2xl">
                  ¡Su Solicitud le será Enviada por email!
                </h3>
                <p className="mt-2 text-sm text-slate-400 sm:text-base">
                  Presione Aceptar
                </p>

                <label className="mx-auto mt-8 flex max-w-md cursor-pointer items-start gap-3 rounded-xl border border-[#1E293B] bg-slate-900/40 px-4 py-4 text-left">
                  <span className="relative mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center">
                    <input
                      type="checkbox"
                      checked={wantsAdvisorContact}
                      onChange={(e) => setWantsAdvisorContact(e.target.checked)}
                      className="peer sr-only"
                    />
                    <span className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-slate-500 bg-[#F8FAFC] transition-all peer-checked:border-[#84CC16] peer-checked:bg-[#84CC16]">
                      {wantsAdvisorContact && (
                        <svg
                          className="h-3 w-3 text-white"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </span>
                  </span>
                  <span className="text-xs leading-relaxed text-slate-400 sm:text-sm">
                    Quiero que me contacte un asesor especializado, para mayor
                    información.
                  </span>
                </label>

                <button
                  type="button"
                  onClick={handleAccept}
                  className="mt-8 w-full rounded-lg bg-[#1D4ED8] px-6 py-4 text-base font-semibold text-white transition-all duration-300 hover:bg-[#2563EB] sm:text-lg"
                >
                  Aceptar
                </button>
              </div>
            ) : (
              <div className="p-6 sm:p-8">
                <div className="rounded-xl border border-[#1E293B] bg-slate-900/50 p-6">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="inline-flex items-center rounded-full border border-[#10B981]/30 bg-[#10B981]/10 px-3 py-1 text-sm font-semibold text-[#10B981]">
                      Nivel {maturity.level} · {maturity.name}
                    </span>
                    <span className="text-sm text-slate-400">
                      Puntaje: {totalScore} / 28
                    </span>
                  </div>

                  <h3 className="mt-4 text-xl font-bold text-[#F8FAFC] sm:text-2xl">
                    Tu diagnóstico tecnológico
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-300 sm:text-base">
                    {maturity.diagnosis}
                  </p>

                  <div className="mt-6 space-y-3">
                    <p className="text-sm font-semibold uppercase tracking-wide text-[#10B981]">
                      Recomendaciones clave
                    </p>
                    <ul className="space-y-2">
                      {maturity.recommendations.map((item) => (
                        <li
                          key={item}
                          className="flex gap-3 text-sm text-slate-300 sm:text-base"
                        >
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#10B981]" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                  <div>
                    <h4 className="text-lg font-semibold text-[#F8FAFC]">
                      Solicita tu devolución estratégica
                    </h4>
                    <p className="mt-1 text-sm text-slate-400">
                      Completa tus datos y un consultor de Desarr Soluciones revisará
                      tu diagnóstico.
                    </p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block sm:col-span-2">
                      <span className="mb-1.5 block text-sm text-slate-300">
                        Nombre y Apellido
                      </span>
                      <input
                        required
                        type="text"
                        value={lead.fullName}
                        onChange={(e) =>
                          setLead((prev) => ({ ...prev, fullName: e.target.value }))
                        }
                        className={FORM_INPUT_CLASS}
                        placeholder="Ej. María González"
                      />
                    </label>

                    <label className="block sm:col-span-2">
                      <span className="mb-1.5 block text-sm text-slate-300">Empresa</span>
                      <input
                        required
                        type="text"
                        value={lead.company}
                        onChange={(e) =>
                          setLead((prev) => ({ ...prev, company: e.target.value }))
                        }
                        className={FORM_INPUT_CLASS}
                        placeholder="Nombre de tu organización"
                      />
                    </label>

                    <label className="block sm:col-span-2">
                      <span className="mb-1.5 block text-sm text-slate-300">
                        Email corporativo
                      </span>
                      <input
                        required
                        type="email"
                        value={lead.email}
                        onChange={(e) =>
                          setLead((prev) => ({ ...prev, email: e.target.value }))
                        }
                        className={FORM_INPUT_CLASS}
                        placeholder="nombre@empresa.com"
                      />
                    </label>

                    <label className="block sm:col-span-2">
                      <span className="mb-1.5 block text-sm text-slate-300">
                        WhatsApp / Teléfono
                      </span>
                      <div className="flex gap-2">
                        <PhoneCountrySelect
                          value={lead.phoneCountryCode}
                          onChange={(code) =>
                            setLead((prev) => ({ ...prev, phoneCountryCode: code }))
                          }
                        />
                        <input
                          required
                          type="tel"
                          value={lead.phoneNumber}
                          onChange={(e) =>
                            setLead((prev) => ({ ...prev, phoneNumber: e.target.value }))
                          }
                          className={FORM_INPUT_CLASS}
                          placeholder="11 0000 0000"
                        />
                      </div>
                    </label>

                    <div className="sm:col-span-2">
                      <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
                        <span className="text-sm text-slate-300">
                          País y Provincia/Estado
                        </span>
                        <button
                          type="button"
                          onClick={detectLocation}
                          disabled={locationLoading}
                          className="inline-flex items-center gap-2 rounded-lg border border-[#1D4ED8]/40 bg-[#1D4ED8]/10 px-4 py-2 text-sm font-medium text-[#93C5FD] shadow-sm transition-all duration-300 hover:border-[#1D4ED8]/70 hover:bg-[#1D4ED8]/20 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          <AnimatedGlobe spinning={locationLoading} />
                          {locationLoading
                            ? "Detectando ubicación..."
                            : "Detectar mi ubicación"}
                        </button>
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <input
                          required
                          type="text"
                          value={lead.country}
                          onChange={(e) =>
                            setLead((prev) => ({ ...prev, country: e.target.value }))
                          }
                          className={FORM_INPUT_CLASS}
                          placeholder="País"
                        />
                        <input
                          required
                          type="text"
                          value={lead.state}
                          onChange={(e) =>
                            setLead((prev) => ({ ...prev, state: e.target.value }))
                          }
                          className={FORM_INPUT_CLASS}
                          placeholder="Provincia / Estado"
                        />
                      </div>
                      {locationMessage && (
                        <p className="mt-2 text-xs text-slate-400">{locationMessage}</p>
                      )}
                    </div>

                    <fieldset className="sm:col-span-2">
                      <legend className="mb-3 text-sm font-medium text-slate-300">
                        Selecciona el Tipo de Empresa
                      </legend>
                      <div className="grid gap-2 sm:grid-cols-2">
                        {COMPANY_TYPES.map((type) => {
                          const active = lead.companyTypes.includes(type);

                          return (
                            <button
                              key={type}
                              type="button"
                              onClick={() => toggleCompanyType(type)}
                              className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-all duration-200 ${
                                active
                                  ? "border-[#10B981]/50 bg-[#10B981]/10 text-[#F8FAFC]"
                                  : "border-[#1E293B] bg-slate-900/40 text-slate-400 hover:border-slate-600 hover:text-slate-200"
                              }`}
                            >
                              <span
                                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200 ${
                                  active
                                    ? "border-[#84CC16] bg-[#84CC16]"
                                    : "border-slate-500 bg-[#F8FAFC]"
                                }`}
                              >
                                {active && (
                                  <svg
                                    className="h-3 w-3 text-white"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    aria-hidden
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                )}
                              </span>
                              <span>{type}</span>
                            </button>
                          );
                        })}
                      </div>
                      {lead.companyTypes.includes("Otros") && (
                        <label className="mt-3 block">
                          <span className="mb-1.5 block text-sm text-slate-300">
                            Especifica el tipo de empresa
                          </span>
                          <input
                            required
                            type="text"
                            value={lead.otherCompanyType}
                            onChange={(e) =>
                              setLead((prev) => ({
                                ...prev,
                                otherCompanyType: e.target.value,
                              }))
                            }
                            className={FORM_INPUT_CLASS}
                            placeholder="Describe tu rubro o actividad"
                          />
                        </label>
                      )}
                    </fieldset>
                  </div>

                  <button
                    type="submit"
                    disabled={submitState === "loading"}
                    className="w-full rounded-lg bg-[#1D4ED8] px-6 py-4 text-base font-semibold text-white transition-all duration-300 hover:bg-[#2563EB] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitState === "loading"
                      ? "Enviando solicitud..."
                      : "Recibir una Copia de mi Diagnóstico"}
                  </button>

                  {submitState === "error" && (
                    <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                      Hubo un error al enviar. Por favor, intenta nuevamente.
                    </p>
                  )}
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
