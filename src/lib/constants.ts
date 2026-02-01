export const SECRET_PATTERNS = [
  /ntn_[A-Za-z0-9]{40,}/g,
  /sk-[A-Za-z0-9_-]{20,}/g,
  /ghp_[A-Za-z0-9]{36,}/g,
  /ghu_[A-Za-z0-9]{36,}/g,
  /secret_[A-Za-z0-9]{20,}/g,
  /xoxb-[A-Za-z0-9-]+/g,
  /xapp-[A-Za-z0-9-]+/g,
  /AIza[A-Za-z0-9_-]{35}/g,
  /sk_[A-Za-z0-9]{40,}/g,
];

export function sanitize(content: string): string {
  return SECRET_PATTERNS.reduce(
    (text, pattern) => text.replace(new RegExp(pattern.source, 'g'), '••••••'),
    content,
  );
}

export const POLL_INTERVALS = {
  ACTIVE: 5000,
  IDLE: 30000,
  SESSIONS: 10000,
  CRONS: 30000,
} as const;

export const COOKIE_NAME = 'ocmc-agents';
export const COOKIE_PASSWORD =
  process.env.COOKIE_SECRET ||
  'openclaw-mission-control-default-secret-change-me-32chars!';
