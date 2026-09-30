type TechStackIconProps = {
  name: string;
  className?: string;
};

export default function TechStackIcon({ name, className = "h-3.5 w-3.5" }: TechStackIconProps) {
  switch (name) {
    case "Power BI":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M4 19V5h3v14H4zm6 0V9h3v10h-3zm6 0V3h3v16h-3z" />
        </svg>
      );
    case "SQL":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <ellipse cx="12" cy="5" rx="8" ry="3" />
          <path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" />
        </svg>
      );
    case "Python":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M12 2c-3 0-4.5 1.5-4.5 4v2h4.5V6.5c0-.8.7-1.5 1.5-1.5H14c.8 0 1.5.7 1.5 1.5v1H12v2h6V6c0-2.5-1.5-4-4.5-4H12zm-4.5 8c-2.5 0-4.5 2-4.5 4.5V20c0 2.5 2 4.5 4.5 4.5h1.5v-2H7.5c-.8 0-1.5-.7-1.5-1.5v-1.5H12v-2H6v3.5c0 2.5 2 4.5 4.5 4.5h1.5c3 0 4.5-1.5 4.5-4.5v-2h-4.5v1.5c0 .8-.7 1.5-1.5 1.5H10c-.8 0-1.5-.7-1.5-1.5V10H12z" />
        </svg>
      );
    case "Make":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M12 2 2 7l10 5 10-5-10-5zm0 8L2 5v12l10 5 10-5V5l-10 5z" />
        </svg>
      );
    case "Power Automate":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <path strokeLinecap="round" d="M4 12h6l3-6 3 12 3-6h2" />
        </svg>
      );
    case "QuickBooks":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M7 4h6a5 5 0 0 1 0 10H9v6H7V4zm2 2v6h4a3 3 0 0 0 0-6H9z" />
        </svg>
      );
    case "Odoo":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <circle cx="12" cy="12" r="9" opacity="0.25" />
          <circle cx="9" cy="10" r="2.5" />
          <circle cx="15" cy="10" r="2.5" />
          <path d="M8 15c1.2 1.5 2.7 2 4 2s2.8-.5 4-2" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      );
    case "Excel Avanzado":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M4 3h11l5 5v13H4V3zm10 1.5V9h4.5L14 4.5zM8 11h8v2H8v-2zm0 4h8v2H8v-2z" />
        </svg>
      );
    case "Google Apps Script":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M6 3h8l4 4v14H6V3zm8 0v4h4M9 12h6M9 16h4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M8 4.5 6 3v18l2-1.5" opacity="0.8" />
        </svg>
      );
    default:
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <circle cx="12" cy="12" r="4" />
        </svg>
      );
  }
}
