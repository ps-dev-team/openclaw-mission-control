'use server';

import {
  getAgents,
  addAgent as addAgentCookie,
  removeAgent as removeAgentCookie,
} from '@/lib/cookies';
import {
  getGatewayStatus,
  getSessions,
  getSessionHistory,
  getSessionStatus,
  getCronJobs,
  getCronRuns,
  getGatewayConfig,
  getGatewayConfigJson,
  readFile,
  writeFile,
  listFiles,
} from '@/lib/gateway';
import type { AgentConnection } from '@/lib/types';

// Agent management
export async function fetchAgents(): Promise<AgentConnection[]> {
  return getAgents();
}

export async function createAgent(data: {
  name: string;
  gatewayUrl: string;
  gatewayToken: string;
  emoji?: string;
}) {
  const agent = await addAgentCookie(data);
  return agent;
}

export async function deleteAgent(id: string) {
  await removeAgentCookie(id);
}

// Gateway data
export async function fetchStatus(agentId: string) {
  return getGatewayStatus(agentId);
}

export async function fetchSessions(agentId: string) {
  return getSessions(agentId);
}

export async function fetchSessionHistory(agentId: string, sessionKey: string) {
  return getSessionHistory(agentId, sessionKey);
}

export async function fetchSessionStatus(agentId: string, sessionKey?: string) {
  return getSessionStatus(agentId, sessionKey);
}

export async function fetchCronJobs(agentId: string) {
  return getCronJobs(agentId);
}

export async function fetchCronRuns(agentId: string, jobId: string) {
  return getCronRuns(agentId, jobId);
}

export async function fetchConfig(agentId: string) {
  return getGatewayConfig(agentId);
}

export async function fetchConfigJson(agentId: string) {
  return getGatewayConfigJson(agentId);
}

export async function fetchFile(agentId: string, path: string) {
  return readFile(agentId, path);
}

export async function saveFile(agentId: string, path: string, content: string) {
  return writeFile(agentId, path, content);
}

export async function fetchFileList(agentId: string, dirPath: string) {
  return listFiles(agentId, dirPath);
}
