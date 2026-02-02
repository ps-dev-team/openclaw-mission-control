'use client';

import {
  Activity,
  Brain,
  Clock,
  Code2,
  MessageSquare,
  Wifi,
  Server,
  Cpu,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Panel, StatusBadge, StatCard } from '@/components/panel';

export function DemoClient() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-4xl">🦞</span>
          <div>
            <h1 className="text-xl font-bold">Berto</h1>
            <div className="mt-1 flex items-center gap-3">
              <StatusBadge status="online" />
              <Badge variant="outline" className="font-mono text-xs">
                v2026.1.24
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Wifi className="h-4 w-4 text-success" />
          <span>Last update: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard label="Status" value="Online" subtitle="Model: claude-opus-4-5" />
        <StatCard label="Active Sessions" value={3} subtitle="12 total" />
        <StatCard label="Cron Jobs" value={5} subtitle="Scheduled tasks" />
        <StatCard label="Uptime" value="3d 14h" subtitle="ip-172-31-47-209" />
      </div>

      {/* Details Panels */}
      <div className="grid grid-cols-2 gap-6">
        <Panel title="System Info" icon={<Server className="h-4 w-4" />}>
          <div className="space-y-3">
            {[
              ['Host', 'ip-172-31-47-209'],
              ['OS', 'Linux 6.14.0-1018-aws (x64)'],
              ['Node.js', 'v22.22.0'],
              ['Model', 'anthropic/claude-opus-4-5'],
              ['Version', '2026.1.24-3'],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{label}</span>
                <span className="text-xs font-mono">{value}</span>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Quick Access" icon={<Cpu className="h-4 w-4" />}>
          <div className="grid grid-cols-2 gap-2">
            {[
              { icon: Brain, label: 'Memory', color: 'text-brand' },
              { icon: Code2, label: 'Skills', count: 12, color: 'text-chart-1' },
              { icon: Clock, label: 'Cron Jobs', count: 5, color: 'text-warning' },
              { icon: MessageSquare, label: 'Sessions', count: 3, color: 'text-success' },
            ].map((item) => (
              <Card
                key={item.label}
                className="cursor-pointer transition-all hover:scale-[1.02]"
              >
                <CardContent className="flex items-center gap-3 py-3">
                  <item.icon className={`h-4 w-4 ${item.color}`} />
                  <div>
                    <p className="text-sm">{item.label}</p>
                    {item.count !== undefined && (
                      <p className="text-xs text-muted-foreground">{item.count} active</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </Panel>
      </div>

      {/* Active Sessions */}
      <Panel
        title="Active Sessions"
        description="3 running"
        icon={<Activity className="h-4 w-4" />}
      >
        <div className="space-y-2">
          {[
            { label: 'Paulo Soares (DM)', kind: 'dm', channel: 'slack', time: '08:13' },
            { label: 'ticket-checker', kind: 'cron', channel: '', time: '08:00' },
            { label: '#ai', kind: 'group', channel: 'slack', time: '07:45' },
          ].map((session) => (
            <Card
              key={session.label}
              className="cursor-pointer transition-all hover:scale-[1.01]"
            >
              <CardContent className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <StatusBadge status="active" />
                  <div>
                    <p className="text-sm font-mono">{session.label}</p>
                    <p className="text-xs text-muted-foreground">
                      {session.kind}
                      {session.channel ? ` · ${session.channel}` : ''}
                    </p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground font-mono">
                  {session.time}
                </span>
              </CardContent>
            </Card>
          ))}
        </div>
      </Panel>
    </div>
  );
}
