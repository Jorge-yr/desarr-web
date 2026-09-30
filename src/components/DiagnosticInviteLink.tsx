"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";

type DiagnosticInviteLinkProps = {
  href: string;
  className: string;
  wrapperClassName?: string;
  children: ReactNode;
  onClick?: () => void;
};

export default function DiagnosticInviteLink({
  href,
  className,
  wrapperClassName = "",
  children,
  onClick,
}: DiagnosticInviteLinkProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isCentered, setIsCentered] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [motionEnabled, setMotionEnabled] = useState(true);

  const isZoomed = motionEnabled && (isCentered || isHovered);

  useEffect(() => {
    setMotionEnabled(!window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (!motionEnabled) return;

    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const updateCenter = () => {
      const rect = wrapper.getBoundingClientRect();
      const elementCenterY = rect.top + rect.height / 2;
      const viewportCenterY = window.innerHeight / 2;
      const centerBand = Math.max(rect.height * 0.55, 56);

      setIsCentered(Math.abs(elementCenterY - viewportCenterY) <= centerBand);
    };

    updateCenter();
    window.addEventListener("scroll", updateCenter, { passive: true });
    window.addEventListener("resize", updateCenter);

    return () => {
      window.removeEventListener("scroll", updateCenter);
      window.removeEventListener("resize", updateCenter);
    };
  }, [motionEnabled]);

  return (
    <div
      ref={wrapperRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`origin-center transition-transform duration-300 will-change-transform ${
        isZoomed ? "scale-[1.2]" : "scale-100"
      } ${wrapperClassName}`}
    >
      <Link href={href} onClick={onClick} className={className}>
        {children}
      </Link>
    </div>
  );
}
