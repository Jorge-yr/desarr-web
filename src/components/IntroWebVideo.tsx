"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type IntroPhase = "fullscreen" | "settling" | "settled";

const SETTLE_TRANSITION_MS = 1400;

function getTargetRect(video: HTMLVideoElement | null) {
  const nav = document.querySelector("nav");
  const headerBottom = nav?.getBoundingClientRect().bottom ?? 72;
  const width = window.innerWidth * (4 / 6);
  const aspectRatio =
    video && video.videoWidth > 0
      ? video.videoHeight / video.videoWidth
      : 9 / 16;
  const height = width * aspectRatio;
  const left = (window.innerWidth - width) / 2;

  return {
    top: headerBottom,
    left,
    width,
    height,
  };
}

export default function IntroWebVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hasSettledRef = useRef(false);

  const [phase, setPhase] = useState<IntroPhase>("fullscreen");
  const [containerStyle, setContainerStyle] = useState<React.CSSProperties>({
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    borderRadius: 0,
  });

  const settleIntro = useCallback(() => {
    if (hasSettledRef.current) return;
    hasSettledRef.current = true;

    const target = getTargetRect(videoRef.current);

    setPhase("settling");
    setContainerStyle({
      position: "fixed",
      top: target.top,
      left: target.left,
      width: target.width,
      height: target.height,
      borderRadius: "0.75rem",
      transition: `top ${SETTLE_TRANSITION_MS}ms cubic-bezier(0.22, 1, 0.36, 1), left ${SETTLE_TRANSITION_MS}ms cubic-bezier(0.22, 1, 0.36, 1), width ${SETTLE_TRANSITION_MS}ms cubic-bezier(0.22, 1, 0.36, 1), height ${SETTLE_TRANSITION_MS}ms cubic-bezier(0.22, 1, 0.36, 1), border-radius ${SETTLE_TRANSITION_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`,
    });
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const showFinalFrame = () => {
        if (Number.isFinite(video.duration) && video.duration > 0) {
          video.currentTime = Math.max(video.duration - 0.05, 0);
        }
        video.pause();
        setPhase("settled");
      };

      if (video.readyState >= 1) {
        showFinalFrame();
      } else {
        video.addEventListener("loadedmetadata", showFinalFrame, { once: true });
      }
      return;
    }

    video.play().catch(() => {
      settleIntro();
    });
  }, [settleIntro]);

  useEffect(() => {
    if (phase === "settled") {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [phase]);

  useEffect(() => {
    if (phase !== "settling") return;

    const handleResize = () => {
      const target = getTargetRect(videoRef.current);
      setContainerStyle((current) => ({
        ...current,
        top: target.top,
        left: target.left,
        width: target.width,
        height: target.height,
      }));
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [phase]);

  const handleTransitionEnd = (event: React.TransitionEvent<HTMLDivElement>) => {
    if (phase !== "settling" || event.propertyName !== "width") return;

    videoRef.current?.pause();
    setPhase("settled");
    setContainerStyle({});
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || !Number.isFinite(video.duration)) return;

    if (video.currentTime >= video.duration * 0.85) {
      settleIntro();
    }
  };

  const isFloating = phase !== "settled";

  return (
    <section
      aria-label="Introducción"
      className={`bg-[#0F172A] ${phase === "settled" ? "pb-2 pt-1" : "h-0 overflow-hidden"}`}
    >
      {isFloating && (
        <div
          className={`fixed inset-0 z-[90] bg-[#0F172A] transition-opacity duration-700 ${
            phase === "settling" ? "opacity-0" : "opacity-100"
          }`}
          aria-hidden
        />
      )}

      <div
        style={isFloating ? containerStyle : undefined}
        onTransitionEnd={handleTransitionEnd}
        className={
          isFloating
            ? "z-[100] overflow-hidden bg-black shadow-2xl shadow-black/40"
            : "mx-auto aspect-video w-4/6 max-w-full overflow-hidden rounded-xl shadow-2xl shadow-black/30"
        }
      >
        <video
          ref={videoRef}
          src="/intro_web.mp4"
          muted
          playsInline
          autoPlay={phase === "fullscreen"}
          preload="auto"
          onTimeUpdate={handleTimeUpdate}
          onEnded={settleIntro}
          className="h-full w-full object-cover"
          aria-label="Video introductorio de Desarr Soluciones"
        />
      </div>
    </section>
  );
}
