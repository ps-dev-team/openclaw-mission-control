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
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
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
    <TooltipProvider delayDuration={0}>
      <aside className="flex h-screen w-64 flex-col border-r bg-sidebar text-sidebar-foreground backdrop-blur-xl">
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand/20 text-brand">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-sm font-bold">Mission Control</h1>
            <p className="text-xs text-muted-foreground">OpenClaw</p>
          </div>
        </div>

        <Separator />

        {/* Agent selector */}
        <div className="px-3 py-3">
          <p className="mb-2 px-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Agents
          </p>
          {agents.map((agent) => (
            <Link key={agent.id} href={`/agent/${agent.id}`}>
              <Button
                variant={activeAgentId === agent.id ? 'secondary' : 'ghost'}
                className="w-full justify-start gap-2 h-9"
              >
                <span className="text-base leading-none">{agent.emoji || '🤖'}</span>
                <span className="flex-1 truncate text-left">{agent.name}</span>
                {activeAgentId === agent.id && (
                  <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse-dot" />
                )}
              </Button>
            </Link>
          ))}
          <Link href="/agents/add">
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 h-9 text-muted-foreground"
            >
              <Plus className="h-4 w-4" />
              <span>Add Agent</span>
            </Button>
          </Link>
        </div>

        <Separator />

        {/* Navigation */}
        {activeAgentId && (
          <ScrollArea className="flex-1 px-3 py-3">
            <p className="mb-2 px-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Panels
            </p>
            {NAV_ITEMS.map((item) => {
              const href = `${basePath}${item.href}`;
              const isActive =
                item.href === ''
                  ? pathname === basePath || pathname === `${basePath}/`
                  : pathname.startsWith(href);

              return (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>
                    <Link href={href}>
                      <Button
                        variant={isActive ? 'secondary' : 'ghost'}
                        className={cn(
                          'w-full justify-start gap-3 h-9',
                          isActive &&
                            'bg-sidebar-accent text-sidebar-primary font-medium',
                        )}
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="text-xs">
                    {item.label}
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </ScrollArea>
        )}

        {/* Footer */}
        {activeAgentId && (
          <>
            <Separator />
            <div className="px-3 py-3">
              <Link href={`/agent/${activeAgentId}/manage`}>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2 h-9 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Manage Agent</span>
                </Button>
              </Link>
            </div>
          </>
        )}
      </aside>
    </TooltipProvider>
  );
}
