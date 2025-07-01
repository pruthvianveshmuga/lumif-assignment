import { Instance } from "./glama-types";

export interface SessionState {
  recommendedMCPs?: Instance[];
}

const sessionStore = new Map<string, SessionState>();

export function getSession(sessionId: string): SessionState | undefined {
  return sessionStore.get(sessionId);
}

export function updateSession(
  sessionId: string,
  data: Partial<SessionState>
): void {
  const existingSession = sessionStore.get(sessionId) || {};
  sessionStore.set(sessionId, { ...existingSession, ...data });
}
