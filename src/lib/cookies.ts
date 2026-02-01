'use server';

import { cookies } from 'next/headers';
import type { AgentConnection } from './types';
import { COOKIE_NAME } from './constants';

export async function getAgents(): Promise<AgentConnection[]> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(COOKIE_NAME)?.value;
  if (!raw) return [];
  try {
    return JSON.parse(Buffer.from(raw, 'base64').toString('utf-8'));
  } catch {
    return [];
  }
}

export async function setAgents(agents: AgentConnection[]): Promise<void> {
  const cookieStore = await cookies();
  const encoded = Buffer.from(JSON.stringify(agents)).toString('base64');
  cookieStore.set(COOKIE_NAME, encoded, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 365,
    path: '/',
  });
}

export async function getAgent(id: string): Promise<AgentConnection | null> {
  const agents = await getAgents();
  return agents.find((a) => a.id === id) ?? null;
}

export async function addAgent(
  agent: Omit<AgentConnection, 'id' | 'addedAt'>,
): Promise<AgentConnection> {
  const agents = await getAgents();
  const newAgent: AgentConnection = {
    ...agent,
    id: crypto.randomUUID(),
    addedAt: new Date().toISOString(),
  };
  agents.push(newAgent);
  await setAgents(agents);
  return newAgent;
}

export async function removeAgent(id: string): Promise<void> {
  const agents = await getAgents();
  await setAgents(agents.filter((a) => a.id !== id));
}
