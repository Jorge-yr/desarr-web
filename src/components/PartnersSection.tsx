"use client";

import Image from "next/image";
import { useState } from "react";
import { PARTNERS, type Partner } from "@/lib/partners-data";

const SOCIAL_LABELS: Record<Partner["socialType"], string> = {
  instagram: "Instagram",
  web: "Sitio Web",
  linkedin: "LinkedIn",
};

export default function PartnersSection() {
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [senderName, setSenderName] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [senderPhone, setSenderPhone] = useState("");
  const [message, setMessage] = useState("");

  const resetForm = () => {
    setSenderName("");
    setSenderEmail("");
    setSenderPhone("");
    setMessage("");
  };

  const handleOpenModal = (partner: Partner) => {
    setSelectedPartner(partner);
    setSubmittedSuccess(false);
    resetForm();
  };

  const handleCloseModal = () => {
    setSelectedPartner(null);
    setSubmittedSuccess(false);
    resetForm();
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedPartner) return;

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/partner-contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          partnerId: selectedPartner.id,
          senderName,
          senderEmail,
          senderPhone,
          message,
        }),
      });

      if (response.ok) {
        setSubmittedSuccess(true);
        setTimeout(handleCloseModal, 2200);
      } else {
        alert("Ocurrió un error al enviar tu consulta. Por favor intenta de nuevo.");
      }
    } catch {
      alert("Error de conexión con el servidor.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="socios-estrategicos"
      className="relative scroll-mt-24 bg-[#0F172A] px-4 py-24 text-[#F8FAFC] sm:px-6 lg:px-8"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/3 h-80 w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#1D4ED8]/10 blur-[130px]"
      />

      <div className="relative mx-auto max-w-6xl">
        <div className="text-center">
          <span className="inline-block rounded-full border border-[#10B981]/30 bg-[#10B981]/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#10B981]">
            Ecosistema de Alianzas
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Nuestros Socios Estratégicos
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-slate-400 sm:text-lg">
            Colaboramos con profesionales y consultoras líderes para ofrecer
            soluciones integrales de gestión, estrategia y control financiero.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">
          {PARTNERS.map((partner) => (
            <article
              key={partner.id}
              className="group relative flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/60 p-8 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#1D4ED8]/50 hover:shadow-[0_12px_30px_rgba(15,23,42,0.8)]"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-slate-700 bg-slate-800 sm:h-32 sm:w-32">
                    <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-[#93C5FD] sm:text-3xl">
                      {partner.name.charAt(0)}
                    </span>
                    <Image
                      src={partner.imageUrl}
                      alt={partner.name}
                      fill
                      sizes="(max-width: 640px) 96px, 128px"
                      className="object-cover object-center"
                      onError={(event) => {
                        event.currentTarget.style.opacity = "0";
                      }}
                    />
                  </div>

                  <a
                    href={partner.socialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700/60 bg-slate-800/50 px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:border-slate-500 hover:text-white"
                  >
                    {SOCIAL_LABELS[partner.socialType]}
                    <svg
                      className="h-3.5 w-3.5 text-slate-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </a>
                </div>

                <div className="mt-6">
                  <h3 className="text-xl font-bold text-white transition-colors group-hover:text-[#60A5FA]">
                    {partner.name}
                  </h3>
                  <p className="mt-1 text-sm font-semibold text-[#10B981]">
                    {partner.specialty}
                  </p>
                  <p className="mt-4 text-sm leading-relaxed text-slate-400">
                    {partner.description}
                  </p>
                </div>
              </div>

              <div className="mt-8 border-t border-slate-800/80 pt-6">
                <button
                  type="button"
                  onClick={() => handleOpenModal(partner)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-800/80 px-4 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#1D4ED8] hover:shadow-[0_0_20px_rgba(29,78,216,0.3)]"
                >
                  Contactar a este Partner
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      {selectedPartner && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="partner-modal-title"
        >
          <div className="relative w-full max-w-md rounded-2xl border border-slate-700 bg-[#0F172A] p-6 shadow-2xl">
            <button
              type="button"
              onClick={handleCloseModal}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
              aria-label="Cerrar"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <path strokeLinecap="round" d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>

            {submittedSuccess ? (
              <div className="py-8 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#10B981]/20 text-[#10B981]">
                  ✓
                </div>
                <h4 className="text-xl font-bold text-white">¡Mensaje enviado!</h4>
                <p className="mt-2 text-sm text-slate-300">
                  Conectamos tu consulta con {selectedPartner.name}. Te contactará a
                  la brevedad.
                </p>
              </div>
            ) : (
              <>
                <h4 id="partner-modal-title" className="text-xl font-bold text-white">
                  Contactar a {selectedPartner.name}
                </h4>
                <p className="mt-1 text-xs text-[#10B981]">
                  Especialidad: {selectedPartner.specialty}
                </p>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300">
                      Tu nombre completo
                    </label>
                    <input
                      type="text"
                      required
                      value={senderName}
                      onChange={(event) => setSenderName(event.target.value)}
                      placeholder="Ej. Juan Pérez"
                      className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800/80 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-[#1D4ED8] focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300">
                      Tu correo corporativo
                    </label>
                    <input
                      type="email"
                      required
                      value={senderEmail}
                      onChange={(event) => setSenderEmail(event.target.value)}
                      placeholder="juan@empresa.com"
                      className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800/80 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-[#1D4ED8] focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300">
                      Teléfono / WhatsApp
                    </label>
                    <input
                      type="tel"
                      value={senderPhone}
                      onChange={(event) => setSenderPhone(event.target.value)}
                      placeholder="+54 9 11 0000-0000"
                      className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800/80 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-[#1D4ED8] focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300">
                      ¿En qué necesitás asistencia?
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={message}
                      onChange={(event) => setMessage(event.target.value)}
                      placeholder="Contanos brevemente tu necesidad operativa o financiera..."
                      className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800/80 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-[#1D4ED8] focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/20"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="mt-2 w-full rounded-xl bg-[#1D4ED8] py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition-all hover:bg-[#2563EB] disabled:opacity-50"
                  >
                    {isSubmitting ? "Enviando solicitud..." : "Enviar solicitud de contacto"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
