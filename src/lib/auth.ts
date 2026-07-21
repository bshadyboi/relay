import { DEMO_ACCOUNTS, getUser } from "./data";
import type { SessionUser, ShiftMetrics } from "./types";

const SESSION_KEY = "zoox-workspace:session";
const SHIFT_KEY = "zoox-workspace:shift";
const PREFS_KEY = "zoox-workspace:prefs";

export type WorkspacePrefs = {
  liveTrafficOn: boolean;
  soundOn: boolean;
};

const DEFAULT_PREFS: WorkspacePrefs = {
  liveTrafficOn: true,
  soundOn: true,
};

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
    localStorage.removeItem(SHIFT_KEY);
  } catch {
    /* ignore */
  }
}

export function saveShift(shift: ShiftMetrics) {
  try {
    localStorage.setItem(SHIFT_KEY, JSON.stringify(shift));
  } catch {
    /* ignore */
  }
}

export function loadShift(): ShiftMetrics | null {
  try {
    const raw = localStorage.getItem(SHIFT_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ShiftMetrics;
  } catch {
    return null;
  }
}

export function clearShift() {
  try {
    localStorage.removeItem(SHIFT_KEY);
  } catch {
    /* ignore */
  }
}

export function loadPrefs(): WorkspacePrefs {
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    if (!raw) return { ...DEFAULT_PREFS };
    return { ...DEFAULT_PREFS, ...(JSON.parse(raw) as WorkspacePrefs) };
  } catch {
    return { ...DEFAULT_PREFS };
  }
}

export function savePrefs(prefs: WorkspacePrefs) {
  try {
    localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
  } catch {
    /* ignore */
  }
}
