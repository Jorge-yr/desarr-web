export const ADMIN_SESSION_KEY = "desarr-admin-session";

export type AdminSession = {
  email: string;
  clinica: string;
  idClinica: string;
};

export function readAdminSession(): AdminSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(ADMIN_SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AdminSession;
    if (!parsed.email || !parsed.idClinica) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function writeAdminSession(session: AdminSession) {
  sessionStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
}

export function clearAdminSession() {
  sessionStorage.removeItem(ADMIN_SESSION_KEY);
}
