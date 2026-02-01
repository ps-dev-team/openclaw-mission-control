'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Bot,
  User,
  Wrench,
  MessageSquare,
  DollarSign,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Panel, LoadingSpinner, StatCard } from '@/components/panel';
import { fetchSessionHistory, fetchSessionStatus } from '@/app/actions';

interface Message {
  role?: string;
  content?: string | Array<{ type?: string; text?: string }>;
  toolName?: string;
  name?: string;
  timestamp?: string;
}

interface SessionStatusData {
  model?: string;
  tokens?: { input?: number; output?: number };
  cost?: number;
  inputTokens?: number;
  outputTokens?: number;
}

export default function SessionHistoryPage() {
  const params = useParams();
  const agentId = params.id as string;
  const sessionKey = decodeURIComponent(params.key as string);
  const [messages, setMessages] = useState<Message[]>([]);
  const [status, setStatus] = useState<SessionStatusData | null>(null);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  const load = useCallback(async () => {
    try {
      const [history, sessionStatus] = await Promise.all([
        fetchSessionHistory(agentId, sessionKey),
        fetchSessionStatus(agentId, sessionKey),
      ]);
      setMessages(Array.isArray(history) ? (history as Message[]) : []);
      setStatus(sessionStatus as SessionStatusData);
    } catch {
      // ignore
    }
    setLoading(false);
  }, [agentId, sessionKey]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  function getContent(msg: Message): string {
    if (typeof msg.content === 'string') return msg.content;
    if (Array.isArray(msg.content)) {
      return msg.content
        .map((c) => (typeof c === 'string' ? c : c.text || ''))
        .join('\n');
    }
    return '';
  }

  if (loading) return <LoadingSpinner />;

  const inputTokens = status?.tokens?.input ?? status?.inputTokens ?? 0;
  const outputTokens = status?.tokens?.output ?? status?.outputTokens ?? 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href={`/agent/${agentId}/sessions`}
            className="rounded-lg border border-border p-1.5 text-text-muted hover:bg-bg-tertiary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <h1 className="text-xl font-bold text-text-primary flex items-center gap-3">
            <MessageSquare className="h-6 w-6 text-success" />
            Session
          </h1>
          <span className="text-xs text-text-muted font-mono">
            {sessionKey.slice(0, 16)}...
          </span>
        </div>
      </div>

      {/* Session Stats */}
      {status && (
        <div className="grid grid-cols-4 gap-4">
          <StatCard
            label="Model"
            value={status.model ?? '—'}
          />
          <StatCard
            label="Input Tokens"
            value={inputTokens.toLocaleString()}
          />
          <StatCard
            label="Output Tokens"
            value={outputTokens.toLocaleString()}
          />
          <StatCard
            label="Cost"
            value={
              status.cost != null ? `$${status.cost.toFixed(4)}` : '—'
            }
          />
        </div>
      )}

      {/* Chat History */}
      <Panel
        title="Conversation"
        description={`${messages.length} messages`}
        icon={<MessageSquare className="h-4 w-4" />}
        noPadding
      >
        <div
          ref={scrollRef}
          className="max-h-[60vh] overflow-y-auto divide-y divide-border"
        >
          {messages.map((msg, i) => {
            const content = getContent(msg);
            if (!content && msg.role === 'tool') return null;

            const isUser = msg.role === 'user';
            const isTool = msg.role === 'tool';
            const isSystem = msg.role === 'system';

            return (
              <div
                key={i}
                className={`px-5 py-4 ${
                  isUser
                    ? 'bg-bg-secondary'
                    : isTool
                      ? 'bg-bg-primary'
                      : 'bg-bg-secondary'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-md bg-bg-tertiary">
                    {isUser ? (
                      <User className="h-3.5 w-3.5 text-accent" />
                    ) : isTool ? (
                      <Wrench className="h-3.5 w-3.5 text-warning" />
                    ) : (
                      <Bot className="h-3.5 w-3.5 text-brand" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-text-secondary capitalize">
                        {isTool
                          ? `Tool: ${msg.toolName ?? msg.name ?? 'unknown'}`
                          : isSystem
                            ? 'System'
                            : msg.role ?? 'assistant'}
                      </span>
                      {msg.timestamp && (
                        <span className="text-xs text-text-muted font-mono">
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </span>
                      )}
                    </div>
                    <div className="markdown-content text-sm">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {content.slice(0, 2000)}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          {messages.length === 0 && (
            <div className="p-8 text-center text-sm text-text-muted">
              No messages in this session.
            </div>
          )}
        </div>
      </Panel>
    </div>
  );
}
