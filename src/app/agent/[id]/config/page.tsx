'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { Settings, Shield, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
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
      try {
        setConfig(JSON.stringify(JSON.parse(data), null, 2));
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
        <h1 className="flex items-center gap-3 text-xl font-bold">
          <Settings className="h-6 w-6 text-muted-foreground" />
          Configuration
        </h1>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1.5">
            <Shield className="h-3.5 w-3.5" /> Secrets masked
          </Badge>
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={load}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Panel
        title="Gateway Config"
        description="Read-only — secrets automatically sanitized"
        icon={<Settings className="h-4 w-4" />}
      >
        <ScrollArea className="max-h-[70vh]">
          <pre className="rounded-lg bg-muted p-4 text-xs font-mono">{config}</pre>
        </ScrollArea>
      </Panel>
    </div>
  );
}
