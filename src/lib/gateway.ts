'use server';

import { getAgent } from './cookies';
import { sanitize } from './constants';

interface GatewayRequestOptions {
  method?: string;
  body?: unknown;
  timeout?: number;
}

async function gatewayFetch(
  agentId: string,
  path: string,
  options: GatewayRequestOptions = {},
): Promise<unknown> {
  const agent = await getAgent(agentId);
  if (!agent) throw new Error('Agent not found');

  const { method = 'GET', body, timeout = 10000 } = options;
  const url = `${agent.gatewayUrl.replace(/\/+$/, '')}${path}`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    const res = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${agent.gatewayToken}`,
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    if (!res.ok) {
      throw new Error(`Gateway error: ${res.status} ${res.statusText}`);
    }

    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

export async function getGatewayStatus(agentId: string) {
  try {
    const data = await gatewayFetch(agentId, '/api/status');
    return { online: true, ...(data as Record<string, unknown>) };
  } catch {
    return { online: false };
  }
}

export async function getSessions(agentId: string) {
  try {
    const data = (await gatewayFetch(agentId, '/api/sessions')) as {
      ok: boolean;
      result?: unknown[];
    };
    return data?.result ?? data ?? [];
  } catch {
    return [];
  }
}

export async function getSessionHistory(agentId: string, sessionKey: string) {
  try {
    const data = (await gatewayFetch(
      agentId,
      `/api/sessions/${encodeURIComponent(sessionKey)}/history`,
    )) as { ok: boolean; result?: unknown };
    return data?.result ?? data ?? [];
  } catch {
    return [];
  }
}

export async function getSessionStatus(agentId: string, sessionKey?: string) {
  try {
    const params = sessionKey
      ? `?sessionKey=${encodeURIComponent(sessionKey)}`
      : '';
    const data = (await gatewayFetch(
      agentId,
      `/api/session/status${params}`,
    )) as { ok: boolean; result?: unknown };
    return data?.result ?? data ?? {};
  } catch {
    return {};
  }
}

export async function getCronJobs(agentId: string) {
  try {
    const data = (await gatewayFetch(agentId, '/api/cron/list')) as {
      ok: boolean;
      result?: unknown;
    };
    return data?.result ?? data ?? [];
  } catch {
    return [];
  }
}

export async function getCronRuns(agentId: string, jobId: string) {
  try {
    const data = (await gatewayFetch(
      agentId,
      `/api/cron/runs/${encodeURIComponent(jobId)}`,
    )) as { ok: boolean; result?: unknown };
    return data?.result ?? data ?? [];
  } catch {
    return [];
  }
}

export async function getGatewayConfig(agentId: string) {
  try {
    const data = (await gatewayFetch(agentId, '/api/config')) as {
      ok: boolean;
      result?: { raw?: string; parsed?: unknown };
    };
    const raw = data?.result?.raw ?? JSON.stringify(data?.result ?? data, null, 2);
    return sanitize(typeof raw === 'string' ? raw : JSON.stringify(raw, null, 2));
  } catch {
    return '{}';
  }
}

export async function readFile(agentId: string, filePath: string) {
  try {
    const data = (await gatewayFetch(agentId, '/api/files/read', {
      method: 'POST',
      body: { path: filePath },
    })) as { ok: boolean; result?: { content?: string } };
    const content = data?.result?.content ?? '';
    return sanitize(typeof content === 'string' ? content : JSON.stringify(content));
  } catch {
    return '';
  }
}

export async function writeFile(
  agentId: string,
  filePath: string,
  content: string,
) {
  return gatewayFetch(agentId, '/api/files/write', {
    method: 'POST',
    body: { path: filePath, content },
  });
}

export async function listFiles(agentId: string, dirPath: string) {
  try {
    const data = (await gatewayFetch(agentId, '/api/files/list', {
      method: 'POST',
      body: { path: dirPath },
    })) as { ok: boolean; result?: string[] };
    return data?.result ?? [];
  } catch {
    return [];
  }
}
