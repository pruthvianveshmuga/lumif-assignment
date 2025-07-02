import { Instance } from "./glama-types";

export interface SessionState {
  recommendedMCPs?: Instance[];
}

const sessionStore = new Map<string, SessionState>();

export function getSession(sessionId: string): SessionState {
  if (!sessionStore.has(sessionId)) {
    sessionStore.set(sessionId, {});
  }
  return sessionStore.get(sessionId)!;
}

export function updateSession(sessionId: string, data: SessionState): void {
  const existingSession = sessionStore.get(sessionId) || {};
  sessionStore.set(sessionId, { ...existingSession, ...data });
}
