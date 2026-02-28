"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button";

interface AgentData {
  id: string;
  name: string;
  emoji: string;
  role: string;
  files: {
    identity: string | null;
    soul: string | null;
    memory: string | null;
    agents: string | null;
    tools: string | null;
  };
  config: Record<string, unknown>;
}

const TABS = [
  { key: "overview", label: "Overview" },
  { key: "memory", label: "Memory" },
  { key: "soul", label: "Soul" },
  { key: "docs", label: "Docs" },
  { key: "config", label: "Config" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

function MarkdownRenderer({ content }: { content: string | null }) {
  if (!content) {
    return <p className="text-sm text-zinc-500 italic">No content available.</p>;
  }
  return (
    <div className="prose prose-invert prose-zinc max-w-none prose-headings:text-zinc-200 prose-p:text-zinc-400 prose-li:text-zinc-400 prose-strong:text-zinc-300 prose-code:text-zinc-300 prose-code:bg-zinc-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-pre:bg-zinc-900 prose-pre:border prose-pre:border-zinc-800 prose-a:text-blue-400 prose-hr:border-zinc-800">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}

function TabContent({ tab, agent }: { tab: TabKey; agent: AgentData }) {
  switch (tab) {
    case "overview":
      return <MarkdownRenderer content={agent.files.identity} />;
    case "memory":
      return <MarkdownRenderer content={agent.files.memory} />;
    case "soul":
      return <MarkdownRenderer content={agent.files.soul} />;
    case "docs":
      return (
        <div className="space-y-8">
          {agent.files.agents && (
            <div>
              <h3 className="mb-3 text-sm font-medium text-zinc-400 uppercase tracking-wider">AGENTS.md</h3>
              <MarkdownRenderer content={agent.files.agents} />
            </div>
          )}
          {agent.files.tools && (
            <div>
              <h3 className="mb-3 text-sm font-medium text-zinc-400 uppercase tracking-wider">TOOLS.md</h3>
              <MarkdownRenderer content={agent.files.tools} />
            </div>
          )}
          {!agent.files.agents && !agent.files.tools && (
            <p className="text-sm text-zinc-500 italic">No documentation available.</p>
          )}
        </div>
      );
    case "config":
      return (
        <pre className="overflow-auto rounded-lg border border-zinc-800 bg-zinc-900 p-4 text-sm text-zinc-300">
          {JSON.stringify(agent.config, null, 2)}
        </pre>
      );
  }
}

export default function AgentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [agent, setAgent] = useState<AgentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabKey>("overview");

  useEffect(() => {
    fetch(`/api/agents/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed");
        return res.json();
      })
      .then(setAgent)
      .catch(() => router.push("/"))
      .finally(() => setLoading(false));
  }, [id, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-600 border-t-transparent" />
      </div>
    );
  }

  if (!agent) return null;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-zinc-800/60 bg-zinc-950/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-4xl items-center gap-4 px-6">
          <Link href="/" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
            ← Back
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{agent.emoji}</span>
            <div>
              <h1 className="text-sm font-semibold">{agent.name}</h1>
              <p className="text-xs text-zinc-500">{agent.role}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b border-zinc-800/60">
        <div className="mx-auto max-w-4xl px-6">
          <nav className="flex gap-1">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-3 py-2.5 text-sm font-medium transition-colors relative ${
                  activeTab === tab.key
                    ? "text-zinc-100"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {tab.label}
                {activeTab === tab.key && (
                  <span className="absolute bottom-0 left-0 right-0 h-px bg-zinc-100" />
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <main className="mx-auto max-w-4xl px-6 py-8">
        <TabContent tab={activeTab} agent={agent} />
      </main>
    </div>
  );
}
