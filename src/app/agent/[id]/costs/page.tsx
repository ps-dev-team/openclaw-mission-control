'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { DollarSign, TrendingUp, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
          const tokens = status.tokens as { input?: number; output?: number } | undefined;
          costData.push({
            key,
            label: String(s.label ?? key.slice(0, 12)),
            model: String(status.model ?? '—'),
            inputTokens: tokens?.input ?? (status.inputTokens as number) ?? 0,
            outputTokens: tokens?.output ?? (status.outputTokens as number) ?? 0,
            cost: (status.cost as number) ?? 0,
          });
        } catch {
          /* skip */
        }
      }

      costData.sort((a, b) => b.cost - a.cost);
      setCosts(costData);
    } catch {
      /* ignore */
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
      <h1 className="flex items-center gap-3 text-xl font-bold">
        <DollarSign className="h-6 w-6 text-success" />
        Costs & Usage
      </h1>

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
        <StatCard label="Sessions" value={costs.length} subtitle="With cost data" />
      </div>

      {costs.length > 0 ? (
        <Panel
          title="Cost by Session"
          description="Sorted by highest cost"
          icon={<TrendingUp className="h-4 w-4" />}
          noPadding
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40%]">Session</TableHead>
                <TableHead className="text-right">Input</TableHead>
                <TableHead className="text-right">Output</TableHead>
                <TableHead className="text-right">Cost</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {costs.map((cost) => (
                <TableRow key={cost.key}>
                  <TableCell>
                    <p className="font-mono text-xs">{cost.label}</p>
                    <p className="text-xs text-muted-foreground">{cost.model}</p>
                  </TableCell>
                  <TableCell className="text-right font-mono text-xs">
                    {cost.inputTokens.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right font-mono text-xs">
                    {cost.outputTokens.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right font-mono text-xs font-medium text-success">
                    ${cost.cost.toFixed(4)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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
