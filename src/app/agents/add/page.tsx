'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, Plug, Zap } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { createAgent, fetchStatus } from '@/app/actions';

export default function AddAgentPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [gatewayUrl, setGatewayUrl] = useState('');
  const [gatewayToken, setGatewayToken] = useState('');
  const [emoji, setEmoji] = useState('🤖');
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<null | 'success' | 'error'>(null);
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
    <div className="relative flex min-h-screen items-center justify-center p-4 overflow-hidden">
      {/* Background gradient */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/3 top-1/4 h-[400px] w-[400px] rounded-full bg-brand/8 blur-[120px]" />
        <div className="absolute right-1/3 bottom-1/4 h-[300px] w-[300px] rounded-full bg-chart-2/5 blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <Button variant="ghost" size="sm" asChild className="mb-6">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>

        <Card className="glow-brand">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/20 text-brand">
                <Plug className="h-5 w-5" />
              </div>
              <div>
                <CardTitle>Add Agent</CardTitle>
                <CardDescription>Connect to a Clawdbot/OpenClaw gateway</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex gap-3">
                <div className="w-20">
                  <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                    Emoji
                  </label>
                  <Input
                    value={emoji}
                    onChange={(e) => setEmoji(e.target.value)}
                    className="text-center text-lg"
                    maxLength={2}
                  />
                </div>
                <div className="flex-1">
                  <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                    Name
                  </label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Berto"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                  Gateway URL
                </label>
                <Input
                  type="url"
                  value={gatewayUrl}
                  onChange={(e) => setGatewayUrl(e.target.value)}
                  placeholder="https://your-server:18789"
                  className="font-mono"
                  required
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                  Gateway Token
                </label>
                <Input
                  type="password"
                  value={gatewayToken}
                  onChange={(e) => setGatewayToken(e.target.value)}
                  placeholder="••••••••••"
                  className="font-mono"
                  required
                />
              </div>

              {error && <p className="text-xs text-destructive">{error}</p>}

              {testResult === 'success' && (
                <p className="flex items-center gap-1.5 text-xs text-success">
                  <Zap className="h-3.5 w-3.5" />
                  Connection successful!
                </p>
              )}

              <div className="flex gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleTest}
                  disabled={!gatewayUrl || !gatewayToken || testing}
                >
                  {testing ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Zap className="mr-2 h-4 w-4" />
                  )}
                  Test
                </Button>
                <Button
                  type="submit"
                  disabled={!name || !gatewayUrl || !gatewayToken || saving}
                  className="flex-1 bg-brand hover:bg-brand/90 text-brand-foreground"
                >
                  {saving ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Plug className="mr-2 h-4 w-4" />
                  )}
                  Connect
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
