export interface AgentConnection {
  id: string;
  name: string;
  gatewayUrl: string;
  gatewayToken: string;
  emoji?: string;
  addedAt: string;
}

export interface AgentStatus {
  online: boolean;
  version?: string;
  uptime?: string;
  model?: string;
  defaultModel?: string;
  host?: string;
  os?: string;
  node?: string;
}

export interface Session {
  key: string;
  kind?: string;
  channel?: string;
  label?: string;
  startedAt?: string;
  lastActivity?: string;
  messages?: SessionMessage[];
  status?: SessionStatus;
}

export interface SessionMessage {
  role: 'user' | 'assistant' | 'system' | 'tool';
  content: string;
  timestamp?: string;
  toolName?: string;
}

export interface SessionStatus {
  model?: string;
  tokens?: {
    input: number;
    output: number;
  };
  cost?: number;
  thinking?: string;
}

export interface CronJob {
  id: string;
  text?: string;
  schedule?: string;
  nextRun?: string;
  lastRun?: string;
  enabled?: boolean;
  model?: string;
  runs?: CronRun[];
}

export interface CronRun {
  id: string;
  startedAt: string;
  completedAt?: string;
  duration?: number;
  status: 'success' | 'error' | 'running';
  error?: string;
}

export interface SkillInfo {
  name: string;
  description?: string;
  location?: string;
}

export interface MemoryFile {
  path: string;
  name: string;
  content: string;
  size?: number;
}

export interface GatewayConfig {
  [key: string]: unknown;
}

export interface TelemetrySnapshot {
  date: string;
  totalTokens: number;
  totalCost: number;
  sessionsCount: number;
  cronRunsCount: number;
  modelBreakdown: Record<string, { tokens: number; cost: number }>;
}
