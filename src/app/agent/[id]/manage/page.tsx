'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AlertTriangle, Trash2, Loader2 } from 'lucide-react';
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
      <h1 className="text-xl font-bold text-text-primary">Manage Agent</h1>

      <Panel
        title="Danger Zone"
        icon={<AlertTriangle className="h-4 w-4 text-danger" />}
      >
        <p className="text-sm text-text-secondary mb-4">
          Remove this agent connection. This only removes it from the dashboard
          — the agent itself keeps running.
        </p>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="flex items-center gap-2 rounded-lg bg-danger/10 border border-danger/30 px-4 py-2 text-sm font-medium text-danger hover:bg-danger/20 transition-colors disabled:opacity-50"
        >
          {deleting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
          {confirming ? 'Click again to confirm' : 'Remove Agent'}
        </button>
      </Panel>
    </div>
  );
}
