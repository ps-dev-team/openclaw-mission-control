import { create } from 'zustand';
import type { AgentConnection } from '@/lib/types';

interface AgentStore {
  agents: AgentConnection[];
  activeAgentId: string | null;
  setAgents: (agents: AgentConnection[]) => void;
  setActiveAgent: (id: string | null) => void;
}

export const useAgentStore = create<AgentStore>((set) => ({
  agents: [],
  activeAgentId: null,
  setAgents: (agents) => set({ agents }),
  setActiveAgent: (id) => set({ activeAgentId: id }),
}));
