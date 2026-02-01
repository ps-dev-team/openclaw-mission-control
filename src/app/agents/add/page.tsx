'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, Plug, Zap } from 'lucide-react';
import Link from 'next/link';
import { createAgent, fetchStatus } from '@/app/actions';

export default function AddAgentPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [gatewayUrl, setGatewayUrl] = useState('');
  const [gatewayToken, setGatewayToken] = useState('');
  const [emoji, setEmoji] = useState('🤖');
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<
    null | 'success' | 'error'
  >(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function handleTest() {
    setTesting(true);
    setTestResult(null);
    setError('');
    try {
      const agent = await createAgent({
        name: name || 'Test',
        gatewayUrl,
        gatewayToken,
        emoji,
      });
      const status = await fetchStatus(agent.id);
      if (status && 'online' in status && status.online) {
        setTestResult('success');
      } else {
        setTestResult('error');
        setError('Could not connect. Check URL and token.');
      }
      // Remove the temp agent if just testing
      const { deleteAgent } = await import('@/app/actions');
      await deleteAgent(agent.id);
    } catch {
      setTestResult('error');
      setError('Connection failed. Check URL and token.');
    }
    setTesting(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !gatewayUrl || !gatewayToken) return;
    setSaving(true);
    setError('');
    try {
      const agent = await createAgent({
        name,
        gatewayUrl: gatewayUrl.replace(/\/+$/, ''),
        gatewayToken,
        emoji,
      });
      router.push(`/agent/${agent.id}`);
    } catch {
      setError('Failed to save agent.');
      setSaving(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-primary p-4">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm text-text-muted hover:text-text-secondary"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>

        <div className="rounded-xl border border-border bg-bg-secondary p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/20 text-brand">
              <Plug className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-text-primary">
                Add Agent
              </h1>
              <p className="text-xs text-text-muted">
                Connect to a Clawdbot/OpenClaw gateway
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-3">
              <div className="w-20">
                <label className="mb-1.5 block text-xs font-medium text-text-secondary">
                  Emoji
                </label>
                <input
                  type="text"
                  value={emoji}
                  onChange={(e) => setEmoji(e.target.value)}
                  className="w-full rounded-lg border border-border bg-bg-primary px-3 py-2 text-center text-lg text-text-primary outline-none focus:border-accent"
                  maxLength={2}
                />
              </div>
              <div className="flex-1">
                <label className="mb-1.5 block text-xs font-medium text-text-secondary">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Berto"
                  className="w-full rounded-lg border border-border bg-bg-primary px-3 py-2 text-sm text-text-primary placeholder-text-muted outline-none focus:border-accent"
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-text-secondary">
                Gateway URL
              </label>
              <input
                type="url"
                value={gatewayUrl}
                onChange={(e) => setGatewayUrl(e.target.value)}
                placeholder="https://your-server:18789"
                className="w-full rounded-lg border border-border bg-bg-primary px-3 py-2 text-sm text-text-primary placeholder-text-muted outline-none focus:border-accent font-mono"
                required
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-text-secondary">
                Gateway Token
              </label>
              <input
                type="password"
                value={gatewayToken}
                onChange={(e) => setGatewayToken(e.target.value)}
                placeholder="••••••••••"
                className="w-full rounded-lg border border-border bg-bg-primary px-3 py-2 text-sm text-text-primary placeholder-text-muted outline-none focus:border-accent font-mono"
                required
              />
            </div>

            {error && (
              <p className="text-xs text-danger">{error}</p>
            )}

            {testResult === 'success' && (
              <p className="flex items-center gap-1.5 text-xs text-success">
                <Zap className="h-3.5 w-3.5" />
                Connection successful!
              </p>
            )}

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={handleTest}
                disabled={!gatewayUrl || !gatewayToken || testing}
                className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm text-text-secondary transition-colors hover:bg-bg-tertiary disabled:opacity-50"
              >
                {testing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Zap className="h-4 w-4" />
                )}
                Test
              </button>
              <button
                type="submit"
                disabled={!name || !gatewayUrl || !gatewayToken || saving}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-hover disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Plug className="h-4 w-4" />
                )}
                Connect
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
