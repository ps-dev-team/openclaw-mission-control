'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  Activity,
  Brain,
  Clock,
  Code2,
  MessageSquare,
  Wifi,
  WifiOff,
  Server,
  Cpu,
} from 'lucide-react';
import { Panel, StatusBadge, StatCard, LoadingSpinner } from '@/components/panel';
import { fetchStatus, fetchSessions, fetchCronJobs } from '@/app/actions';
import { POLL_INTERVALS } from '@/lib/constants';

interface DashboardData {
  status: Record<string, unknown>;
  sessions: unknown[];
  crons: unknown[];
}

export function DashboardClient({
  agentId,
  agentName,
  agentEmoji,
}: {
  agentId: string;
  agentName: string;
  agentEmoji: string;
}) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const [status, sessions, crons] = await Promise.all([
        fetchStatus(agentId),
        fetchSessions(agentId),
        fetchCronJobs(agentId),
      ]);
      setData({
        status: status as Record<string, unknown>,
        sessions: sessions as unknown[],
        crons: crons as unknown[],
      });
    } catch {
      // keep stale data
    }
    setLoading(false);
  }, [agentId]);

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, POLL_INTERVALS.ACTIVE);
    return () => clearInterval(interval);
  }, [refresh]);

  if (loading) return <LoadingSpinner />;

  const status = data?.status ?? {};
  const isOnline = (status as { online?: boolean }).online ?? false;
  const sessions = Array.isArray(data?.sessions) ? data.sessions : [];
  const crons = Array.isArray(data?.crons) ? data.crons : [];
  const activeSessions = sessions.filter(
    (s: unknown) =>
      s && typeof s === 'object' && 'kind' in s,
  );

  const statusObj = status as Record<string, unknown>;
  const result = (statusObj.result ?? statusObj) as Record<string, unknown>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-4xl">{agentEmoji}</span>
          <div>
            <h1 className="text-xl font-bold text-text-primary">
              {agentName}
            </h1>
            <div className="mt-1 flex items-center gap-3">
              <StatusBadge status={isOnline ? 'online' : 'offline'} />
              {result.version ? (
                <span className="text-xs text-text-muted font-mono">
                  v{String(result.version)}
                </span>
              ) : null}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-text-muted">
          {isOnline ? (
            <Wifi className="h-4 w-4 text-success" />
          ) : (
            <WifiOff className="h-4 w-4 text-danger" />
          )}
          <span>
            Last update: {new Date().toLocaleTimeString()}
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          label="Status"
          value={isOnline ? 'Online' : 'Offline'}
          subtitle={result.model ? `Model: ${String(result.model)}` : undefined}
        />
        <StatCard
          label="Active Sessions"
          value={activeSessions.length}
          subtitle={`${sessions.length} total`}
        />
        <StatCard
          label="Cron Jobs"
          value={crons.length}
          subtitle="Scheduled tasks"
        />
        <StatCard
          label="Uptime"
          value={result.uptime ? String(result.uptime) : '—'}
          subtitle={result.host ? String(result.host) : undefined}
        />
      </div>

      {/* Details Panels */}
      <div className="grid grid-cols-2 gap-6">
        {/* System Info */}
        <Panel
          title="System Info"
          icon={<Server className="h-4 w-4" />}
        >
          <div className="space-y-3">
            {[
              ['Host', result.host],
              ['OS', result.os],
              ['Node.js', result.node],
              ['Model', result.model || result.defaultModel],
              ['Version', result.version],
            ]
              .filter(([, v]) => v)
              .map(([label, value]) => (
                <div
                  key={String(label)}
                  className="flex items-center justify-between"
                >
                  <span className="text-xs text-text-muted">
                    {String(label)}
                  </span>
                  <span className="text-xs text-text-secondary font-mono">
                    {String(value)}
                  </span>
                </div>
              ))}
          </div>
        </Panel>

        {/* Quick Links */}
        <Panel title="Quick Access" icon={<Cpu className="h-4 w-4" />}>
          <div className="grid grid-cols-2 gap-2">
            {[
              {
                icon: Brain,
                label: 'Memory',
                href: `/agent/${agentId}/memory`,
                color: 'text-brand',
              },
              {
                icon: Code2,
                label: 'Skills',
                href: `/agent/${agentId}/skills`,
                color: 'text-accent',
              },
              {
                icon: Clock,
                label: 'Cron Jobs',
                href: `/agent/${agentId}/crons`,
                count: crons.length,
                color: 'text-warning',
              },
              {
                icon: MessageSquare,
                label: 'Sessions',
                href: `/agent/${agentId}/sessions`,
                count: activeSessions.length,
                color: 'text-success',
              },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="flex items-center gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-bg-tertiary"
              >
                <item.icon className={`h-4 w-4 ${item.color}`} />
                <div>
                  <p className="text-sm text-text-primary">{item.label}</p>
                  {item.count !== undefined && (
                    <p className="text-xs text-text-muted">
                      {item.count} active
                    </p>
                  )}
                </div>
              </a>
            ))}
          </div>
        </Panel>
      </div>

      {/* Active Sessions Preview */}
      {activeSessions.length > 0 && (
        <Panel
          title="Active Sessions"
          description={`${activeSessions.length} running`}
          icon={<Activity className="h-4 w-4" />}
        >
          <div className="space-y-2">
            {activeSessions.slice(0, 5).map((session: unknown, i: number) => {
              const s = session as Record<string, unknown>;
              return (
                <a
                  key={String(s.key ?? i)}
                  href={`/agent/${agentId}/sessions/${String(s.key ?? '')}`}
                  className="flex items-center justify-between rounded-lg border border-border p-3 transition-colors hover:bg-bg-tertiary"
                >
                  <div className="flex items-center gap-3">
                    <StatusBadge status="active" />
                    <div>
                      <p className="text-sm text-text-primary font-mono">
                        {String(s.label ?? s.key ?? `Session ${i + 1}`)}
                      </p>
                      <p className="text-xs text-text-muted">
                        {s.kind ? String(s.kind) : 'session'}
                        {s.channel ? ` · ${String(s.channel)}` : ''}
                      </p>
                    </div>
                  </div>
                  {s.lastActivity ? (
                    <span className="text-xs text-text-muted font-mono">
                      {String(s.lastActivity)}
                    </span>
                  ) : null}
                </a>
              );
            })}
          </div>
        </Panel>
      )}
    </div>
  );
}
