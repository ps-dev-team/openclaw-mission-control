"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Agent {
  id: string;
  name: string;
  emoji: string;
  role: string;
}

function StatusBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-800 px-2.5 py-0.5 text-xs text-zinc-400">
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
      idle
    </span>
  );
}

function AgentCard({ agent, main }: { agent: Agent; main?: boolean }) {
  return (
    <Link href={`/agents/${agent.id}`} className="block">
      <div
        className={`group relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 transition-all duration-200 hover:border-zinc-700 hover:bg-zinc-800/80 hover:shadow-lg hover:shadow-white/[0.02] ${
          main ? "p-8" : "p-6"
        }`}
      >
        <div className="flex flex-col items-center gap-3">
          <span
            className={`transition-transform duration-200 group-hover:scale-110 ${
              main ? "text-6xl" : "text-5xl"
            }`}
          >
            {agent.emoji}
          </span>
          <div className="text-center">
            <p className={`font-semibold ${main ? "text-xl" : "text-lg"}`}>
              {agent.name}
            </p>
            <p className="text-sm text-zinc-500">{agent.role}</p>
          </div>
          <StatusBadge />
        </div>
      </div>
    </Link>
  );
}

export default function HomePage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/agents")
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => setAgents(data.agents))
      .catch(() => router.push("/login"))
      .finally(() => setLoading(false));
  }, [router]);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-600 border-t-transparent" />
      </div>
    );
  }

  const mainAgent = agents.find((a) => a.id === "main");
  const childAgents = agents.filter((a) => a.id !== "main");

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-zinc-800/60 bg-zinc-950/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
          <h1 className="text-sm font-semibold tracking-tight">
            Mission Control
          </h1>
          <button
            onClick={handleLogout}
            className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Org Chart */}
      <main className="mx-auto max-w-5xl px-6 py-16">
        <div className="flex flex-col items-center">
          {/* Main agent */}
          {mainAgent && (
            <div className="w-full max-w-[260px]">
              <AgentCard agent={mainAgent} main />
            </div>
          )}

          {/* Connector lines — hidden on mobile */}
          {mainAgent && childAgents.length > 0 && (
            <div className="hidden sm:flex w-full max-w-lg flex-col items-center">
              <div className="h-10 w-px bg-zinc-800" />
              <div className="h-px w-full bg-zinc-800" />
              <div className="flex w-full justify-around">
                {childAgents.map((a) => (
                  <div key={a.id} className="h-10 w-px bg-zinc-800" />
                ))}
              </div>
            </div>
          )}

          {/* Spacer on mobile */}
          {mainAgent && childAgents.length > 0 && (
            <div className="sm:hidden h-4" />
          )}

          {/* Child agents */}
          {childAgents.length > 0 && (
            <div className="grid w-full max-w-lg grid-cols-1 sm:grid-cols-2 gap-4">
              {childAgents.map((agent) => (
                <AgentCard key={agent.id} agent={agent} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
