'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { DollarSign, TrendingUp, Zap } from 'lucide-react';
import { Panel, EmptyState, LoadingSpinner, StatCard } from '@/components/panel';
import { fetchSessions, fetchSessionStatus } from '@/app/actions';

interface SessionCost {
  key: string;
  label?: string;
  model?: string;
  inputTokens: number;
  outputTokens: number;
  cost: number;
}

export default function CostsPage() {
  const params = useParams();
  const agentId = params.id as string;
  const [costs, setCosts] = useState<SessionCost[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const sessions = await fetchSessions(agentId);
      const sessionList = Array.isArray(sessions) ? sessions : [];

      const costData: SessionCost[] = [];
      for (const session of sessionList.slice(0, 20)) {
        const s = session as Record<string, unknown>;
        const key = String(s.key ?? s.sessionKey ?? '');
        if (!key) continue;

        try {
          const status = (await fetchSessionStatus(agentId, key)) as Record<
            string,
            unknown
          >;
          const tokens = status.tokens as
            | { input?: number; output?: number }
            | undefined;
          costData.push({
            key,
            label: String(s.label ?? key.slice(0, 12)),
            model: String(status.model ?? '—'),
            inputTokens:
              tokens?.input ??
              (status.inputTokens as number | undefined) ??
              0,
            outputTokens:
              tokens?.output ??
              (status.outputTokens as number | undefined) ??
              0,
            cost: (status.cost as number | undefined) ?? 0,
          });
        } catch {
          // skip
        }
      }

      costData.sort((a, b) => b.cost - a.cost);
      setCosts(costData);
    } catch {
      // ignore
    }
    setLoading(false);
  }, [agentId]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) return <LoadingSpinner />;

  const totalCost = costs.reduce((sum, c) => sum + c.cost, 0);
  const totalInput = costs.reduce((sum, c) => sum + c.inputTokens, 0);
  const totalOutput = costs.reduce((sum, c) => sum + c.outputTokens, 0);

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-text-primary flex items-center gap-3">
        <DollarSign className="h-6 w-6 text-success" />
        Costs & Usage
      </h1>

      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          label="Total Cost"
          value={`$${totalCost.toFixed(4)}`}
          subtitle="Active sessions"
        />
        <StatCard
          label="Input Tokens"
          value={totalInput.toLocaleString()}
          subtitle="Total consumed"
        />
        <StatCard
          label="Output Tokens"
          value={totalOutput.toLocaleString()}
          subtitle="Total generated"
        />
        <StatCard
          label="Sessions"
          value={costs.length}
          subtitle="With cost data"
        />
      </div>

      {/* Cost Breakdown */}
      {costs.length > 0 ? (
        <Panel
          title="Cost by Session"
          description="Sorted by highest cost"
          icon={<TrendingUp className="h-4 w-4" />}
          noPadding
        >
          <div className="divide-y divide-border">
            {/* Header */}
            <div className="grid grid-cols-5 gap-4 px-5 py-3 text-xs font-medium text-text-muted">
              <span className="col-span-2">Session</span>
              <span className="text-right">Input</span>
              <span className="text-right">Output</span>
              <span className="text-right">Cost</span>
            </div>
            {/* Rows */}
            {costs.map((cost) => (
              <div
                key={cost.key}
                className="grid grid-cols-5 gap-4 px-5 py-3 text-sm hover:bg-bg-tertiary transition-colors"
              >
                <div className="col-span-2">
                  <p className="text-text-primary font-mono text-xs truncate">
                    {cost.label}
                  </p>
                  <p className="text-xs text-text-muted">{cost.model}</p>
                </div>
                <span className="text-right text-text-secondary font-mono text-xs">
                  {cost.inputTokens.toLocaleString()}
                </span>
                <span className="text-right text-text-secondary font-mono text-xs">
                  {cost.outputTokens.toLocaleString()}
                </span>
                <span className="text-right font-mono text-xs font-medium text-success">
                  ${cost.cost.toFixed(4)}
                </span>
              </div>
            ))}
          </div>
        </Panel>
      ) : (
        <Panel title="Costs" icon={<DollarSign className="h-4 w-4" />}>
          <EmptyState
            icon={<Zap className="h-6 w-6" />}
            title="No Cost Data"
            description="No session cost data available yet."
          />
        </Panel>
      )}
    </div>
  );
}
