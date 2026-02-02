'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AlertTriangle, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Panel } from '@/components/panel';
import { deleteAgent } from '@/app/actions';

export default function ManageAgentPage() {
  const params = useParams();
  const router = useRouter();
  const agentId = params.id as string;
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!confirming) {
      setConfirming(true);
      return;
    }
    setDeleting(true);
    await deleteAgent(agentId);
    router.push('/');
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">Manage Agent</h1>

      <Panel
        title="Danger Zone"
        icon={<AlertTriangle className="h-4 w-4 text-destructive" />}
      >
        <p className="mb-4 text-sm text-muted-foreground">
          Remove this agent connection. This only removes it from the dashboard — the
          agent itself keeps running.
        </p>
        <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
          {deleting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="mr-2 h-4 w-4" />
          )}
          {confirming ? 'Click again to confirm' : 'Remove Agent'}
        </Button>
      </Panel>
    </div>
  );
}
