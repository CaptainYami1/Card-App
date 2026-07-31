import type { Card } from "./types";

export const ACTIVE_WINDOW_KEY = "pcc_active_window";

export type ActiveWindow = {
  cardId: string;
  expiresAt: string;
};

// Backend timestamps are GMT/UTC (e.g. "2026-07-31T10:37:02.6446748+00:00").
// If a value ever arrives without a timezone marker, treat it as UTC so the
// countdown is not shifted by the user's local timezone.
function normalizeUtc(value: string): string {
  return /([zZ])|([+-]\d{2}:?\d{2})$/.test(value) ? value : `${value}Z`;
}

export function getRemainingSeconds(expiresAt?: string | null): number {
  if (!expiresAt) return 0;
  const expiryMs = new Date(normalizeUtc(expiresAt)).getTime();
  if (Number.isNaN(expiryMs)) return 0;
  return Math.max(0, Math.round((expiryMs - Date.now()) / 1000));
}

export function isActive(expiresAt?: string | null): boolean {
  return getRemainingSeconds(expiresAt) > 0;
}

export function saveActiveWindow(cardId: string, expiresAt: string): void {
  sessionStorage.setItem(
    ACTIVE_WINDOW_KEY,
    JSON.stringify({ cardId, expiresAt } satisfies ActiveWindow)
  );
}

export function clearActiveWindow(): void {
  sessionStorage.removeItem(ACTIVE_WINDOW_KEY);
}

export function getActiveWindow(): ActiveWindow | null {
  const raw = sessionStorage.getItem(ACTIVE_WINDOW_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as ActiveWindow;
    if (!parsed?.cardId || !isActive(parsed.expiresAt)) {
      clearActiveWindow();
      return null;
    }
    return parsed;
  } catch {
    clearActiveWindow();
    return null;
  }
}

// Resolves the single card that currently has an active window, using the
// session storage record first and falling back to each card's own
// `activeWindowExpiresAt` returned by the backend.
export function resolveActiveWindow(
  cards: Card[]
): { card: Card; expiresAt: string } | null {
  const stored = getActiveWindow();
  if (stored) {
    const card = cards.find((c) => c.id === stored.cardId);
    if (card) return { card, expiresAt: stored.expiresAt };
  }

  const backendActive = cards.find((c) => isActive(c.activeWindowExpiresAt));
  if (backendActive?.activeWindowExpiresAt) {
    return {
      card: backendActive,
      expiresAt: backendActive.activeWindowExpiresAt,
    };
  }

  return null;
}
