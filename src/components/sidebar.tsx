'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Activity,
  Brain,
  Clock,
  Code2,
  DollarSign,
  Heart,
  LayoutDashboard,
  MessageSquare,
  Settings,
  Plus,
  Trash2,
} from 'lucide-react';
import clsx from 'clsx';
import type { AgentConnection } from '@/lib/types';

interface SidebarProps {
  agents: AgentConnection[];
  activeAgentId: string | null;
}

const NAV_ITEMS = [
  { href: '', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/memory', icon: Brain, label: 'Memory' },
  { href: '/skills', icon: Code2, label: 'Skills' },
  { href: '/crons', icon: Clock, label: 'Cron Jobs' },
  { href: '/heartbeat', icon: Heart, label: 'Heartbeat' },
  { href: '/sessions', icon: MessageSquare, label: 'Sessions' },
  { href: '/costs', icon: DollarSign, label: 'Costs' },
  { href: '/config', icon: Settings, label: 'Config' },
];

export function Sidebar({ agents, activeAgentId }: SidebarProps) {
  const pathname = usePathname();
  const basePath = activeAgentId ? `/agent/${activeAgentId}` : '';

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-border bg-bg-secondary">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-border px-5 py-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand/20 text-brand">
          <Activity className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-sm font-bold text-text-primary">Mission Control</h1>
          <p className="text-xs text-text-muted">OpenClaw</p>
        </div>
      </div>

      {/* Agent selector */}
      <div className="border-b border-border px-3 py-3">
        <p className="mb-2 px-2 text-xs font-medium uppercase tracking-wider text-text-muted">
          Agents
        </p>
        {agents.map((agent) => (
          <Link
            key={agent.id}
            href={`/agent/${agent.id}`}
            className={clsx(
              'flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition-colors',
              activeAgentId === agent.id
                ? 'bg-bg-tertiary text-text-primary'
                : 'text-text-secondary hover:bg-bg-tertiary hover:text-text-primary',
            )}
          >
            <span className="text-base">{agent.emoji || '🤖'}</span>
            <span className="flex-1 truncate">{agent.name}</span>
            {activeAgentId === agent.id && (
              <div className="h-1.5 w-1.5 rounded-full bg-success animate-pulse-dot" />
            )}
          </Link>
        ))}
        <Link
          href="/agents/add"
          className="mt-1 flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-text-muted transition-colors hover:bg-bg-tertiary hover:text-text-secondary"
        >
          <Plus className="h-4 w-4" />
          <span>Add Agent</span>
        </Link>
      </div>

      {/* Navigation */}
      {activeAgentId && (
        <nav className="flex-1 overflow-y-auto px-3 py-3">
          <p className="mb-2 px-2 text-xs font-medium uppercase tracking-wider text-text-muted">
            Panels
          </p>
          {NAV_ITEMS.map((item) => {
            const href = `${basePath}${item.href}`;
            const isActive =
              item.href === ''
                ? pathname === basePath || pathname === `${basePath}/`
                : pathname.startsWith(href);

            return (
              <Link
                key={item.href}
                href={href}
                className={clsx(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                  isActive
                    ? 'bg-accent/10 text-accent font-medium'
                    : 'text-text-secondary hover:bg-bg-tertiary hover:text-text-primary',
                )}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      )}

      {/* Footer */}
      {activeAgentId && (
        <div className="border-t border-border px-3 py-3">
          <Link
            href={`/agent/${activeAgentId}/manage`}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-text-muted transition-colors hover:bg-bg-tertiary hover:text-danger"
          >
            <Trash2 className="h-4 w-4" />
            <span>Manage Agent</span>
          </Link>
        </div>
      )}
    </aside>
  );
}
