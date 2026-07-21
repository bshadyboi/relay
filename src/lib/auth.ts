import { DEMO_ACCOUNTS, getUser } from "./data";
import type { SessionUser } from "./types";

const SESSION_KEY = "zoox-ops:session";

export function authenticate(
  email: string,
  password: string,
): SessionUser | null {
  const normalized = email.trim().toLowerCase();
  const account = DEMO_ACCOUNTS.find(
    (a) => a.email.toLowerCase() === normalized && a.password === password,
  );
  if (!account) return null;
  const user = getUser(account.userId);
  if (!user) return null;
  return {
    userId: user.id,
    email: user.email ?? account.email,
    name: user.name,
    role: user.role ?? user.title ?? "Operator",
    badgeId: user.badgeId ?? "ZX-OP-0000",
  };
}

export function saveSession(user: SessionUser) {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  } catch {
    /* ignore */
  }
}

export function loadSession(): SessionUser | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SessionUser;
  } catch {
    return null;
  }
}

export function clearSession() {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {
    /* ignore */
  }
}
