'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Activity, Plus, Rocket, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { AgentConnection } from '@/lib/types';

export function HomeClient({ agents }: { agents: AgentConnection[] }) {
  if (agents.length === 0) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden">
        {/* Background gradient */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-1/3 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/10 blur-[120px] animate-glow-pulse" />
          <div className="absolute right-1/4 bottom-1/4 h-[300px] w-[300px] rounded-full bg-chart-2/8 blur-[100px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-xl text-center px-6">
          {/* 3D Mascot */}
          <div className="mb-8 animate-float">
            <Image
              src="/mascot-dark.png"
              alt="Mission Control Bot"
              width={280}
              height={280}
              className="mx-auto hidden dark:block drop-shadow-2xl"
              priority
            />
            <Image
              src="/mascot-light.png"
              alt="Mission Control Bot"
              width={280}
              height={280}
              className="mx-auto dark:hidden drop-shadow-2xl"
              priority
            />
          </div>

          {/* Glass card */}
          <div className="glass rounded-3xl p-8 glow-brand">
            <h1 className="text-3xl font-bold tracking-tight">Mission Control</h1>
            <p className="mx-auto mt-2 text-sm font-medium text-brand">OpenClaw</p>
            <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
              Monitor and manage your AI agents from one beautiful dashboard. Connect your
              first agent to get started.
            </p>
            <Button
              asChild
              size="lg"
              className="mt-6 bg-brand hover:bg-brand/90 text-brand-foreground rounded-xl px-8 shadow-lg shadow-brand/20"
            >
              <Link href="/agents/add">
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Agent
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/3 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/10 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-lg px-6">
        <div className="mb-8 text-center">
          <div className="mb-4 animate-float">
            <Image
              src="/mascot-dark.png"
              alt="Mission Control Bot"
              width={180}
              height={180}
              className="mx-auto hidden dark:block drop-shadow-2xl"
              priority
            />
            <Image
              src="/mascot-light.png"
              alt="Mission Control Bot"
              width={180}
              height={180}
              className="mx-auto dark:hidden drop-shadow-2xl"
              priority
            />
          </div>
          <h1 className="text-2xl font-bold">Select an Agent</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Choose an agent to view its dashboard.
          </p>
        </div>

        <div className="space-y-3">
          {agents.map((agent) => (
            <Link key={agent.id} href={`/agent/${agent.id}`}>
              <Card className="group cursor-pointer transition-all duration-200 hover:glow-brand hover:scale-[1.02]">
                <CardContent className="flex items-center justify-between py-4">
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">{agent.emoji || '🤖'}</span>
                    <div>
                      <p className="text-sm font-semibold">{agent.name}</p>
                      <p className="text-xs text-muted-foreground font-mono">
                        {agent.gatewayUrl}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                </CardContent>
              </Card>
            </Link>
          ))}
          <Link href="/agents/add">
            <Card className="cursor-pointer border-dashed transition-all hover:border-brand/30">
              <CardContent className="flex items-center justify-center gap-2 py-4 text-sm text-muted-foreground">
                <Plus className="h-4 w-4" />
                Add Another Agent
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
