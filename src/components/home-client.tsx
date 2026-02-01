'use client';

import Link from 'next/link';
import { Activity, Plus, Rocket } from 'lucide-react';
import type { AgentConnection } from '@/lib/types';

export function HomeClient({ agents }: { agents: AgentConnection[] }) {
  if (agents.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg-primary">
        <div className="mx-auto max-w-md text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand/20 text-brand">
            <Rocket className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold text-text-primary">
            OpenClaw Mission Control
          </h1>
          <p className="mt-3 text-sm text-text-secondary">
            Monitor and manage your AI agents from one dashboard. Connect your
            first agent to get started.
          </p>
          <Link
            href="/agents/add"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-brand px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-hover"
          >
            <Plus className="h-4 w-4" />
            Add Your First Agent
          </Link>
        </div>
      </div>
    );
  }

  // Redirect to first agent
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-primary">
      <div className="mx-auto max-w-lg text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand/20 text-brand">
          <Activity className="h-8 w-8" />
        </div>
        <h1 className="text-2xl font-bold text-text-primary">
          Select an Agent
        </h1>
        <p className="mt-3 text-sm text-text-secondary">
          Choose an agent to view its dashboard.
        </p>
        <div className="mt-6 space-y-2">
          {agents.map((agent) => (
            <Link
              key={agent.id}
              href={`/agent/${agent.id}`}
              className="flex items-center gap-3 rounded-xl border border-border bg-bg-secondary p-4 transition-colors hover:border-border-hover hover:bg-bg-tertiary"
            >
              <span className="text-2xl">{agent.emoji || '🤖'}</span>
              <div className="text-left">
                <p className="text-sm font-medium text-text-primary">
                  {agent.name}
                </p>
                <p className="text-xs text-text-muted font-mono">
                  {agent.gatewayUrl}
                </p>
              </div>
            </Link>
          ))}
          <Link
            href="/agents/add"
            className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-border p-4 text-sm text-text-muted transition-colors hover:border-border-hover hover:text-text-secondary"
          >
            <Plus className="h-4 w-4" />
            Add Another Agent
          </Link>
        </div>
      </div>
    </div>
  );
}
