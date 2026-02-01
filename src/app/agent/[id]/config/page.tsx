'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { Settings, Shield, RefreshCw } from 'lucide-react';
import { Panel, LoadingSpinner } from '@/components/panel';
import { fetchConfig } from '@/app/actions';

export default function ConfigPage() {
  const params = useParams();
  const agentId = params.id as string;
  const [config, setConfig] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const data = await fetchConfig(agentId);
      // Try to pretty-print JSON
      try {
        const parsed = JSON.parse(data);
        setConfig(JSON.stringify(parsed, null, 2));
      } catch {
        setConfig(data);
      }
    } catch {
      setConfig('Failed to load configuration.');
    }
    setLoading(false);
  }, [agentId]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-text-primary flex items-center gap-3">
          <Settings className="h-6 w-6 text-text-secondary" />
          Configuration
        </h1>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs text-text-muted">
            <Shield className="h-3.5 w-3.5" />
            Secrets are masked
          </span>
          <button
            onClick={load}
            className="rounded-lg border border-border p-1.5 text-text-muted hover:bg-bg-tertiary transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      <Panel
        title="Gateway Config"
        description="Read-only — secrets automatically sanitized"
        icon={<Settings className="h-4 w-4" />}
      >
        <pre className="max-h-[70vh] overflow-auto rounded-lg bg-bg-primary p-4 text-xs text-text-secondary font-mono border border-border">
          {config}
        </pre>
      </Panel>
    </div>
  );
}
