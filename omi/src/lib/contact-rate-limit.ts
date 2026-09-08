import "server-only";

const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 5;
const attempts = new Map<string, number[]>();

export function isRateLimited(identifier: string, now = Date.now()): boolean {
  const earliest = now - WINDOW_MS;
  const recent = (attempts.get(identifier) ?? []).filter((timestamp) => timestamp > earliest);
  if (recent.length >= MAX_REQUESTS) {
    attempts.set(identifier, recent);
    return true;
  }
  recent.push(now);
  attempts.set(identifier, recent);
  if (attempts.size > 1000) {
    for (const [key, timestamps] of attempts) {
      if (timestamps.every((timestamp) => timestamp <= earliest)) attempts.delete(key);
    }
  }
  return false;
}
