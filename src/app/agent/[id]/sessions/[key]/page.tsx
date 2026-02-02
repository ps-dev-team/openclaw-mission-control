'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Bot, User, Wrench, MessageSquare } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Panel, LoadingSpinner, StatCard } from '@/components/panel';
import { fetchSessionHistory, fetchSessionStatus } from '@/app/actions';
import { cn } from '@/lib/utils';

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
      /* ignore */
    }
    setLoading(false);
  }, [agentId, sessionKey]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  function getContent(msg: Message): string {
    if (typeof msg.content === 'string') return msg.content;
    if (Array.isArray(msg.content))
      return msg.content
        .map((c) => (typeof c === 'string' ? c : c.text || ''))
        .join('\n');
    return '';
  }

  if (loading) return <LoadingSpinner />;

  const inputTokens = status?.tokens?.input ?? status?.inputTokens ?? 0;
  const outputTokens = status?.tokens?.output ?? status?.outputTokens ?? 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="outline" size="icon" className="h-8 w-8" asChild>
          <Link href={`/agent/${agentId}/sessions`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="flex items-center gap-3 text-xl font-bold">
          <MessageSquare className="h-6 w-6 text-success" />
          Session
        </h1>
        <Badge variant="outline" className="font-mono text-xs">
          {sessionKey.slice(0, 16)}…
        </Badge>
      </div>

      {status && (
        <div className="grid grid-cols-4 gap-4">
          <StatCard label="Model" value={status.model ?? '—'} />
          <StatCard label="Input Tokens" value={inputTokens.toLocaleString()} />
          <StatCard label="Output Tokens" value={outputTokens.toLocaleString()} />
          <StatCard
            label="Cost"
            value={status.cost != null ? `$${status.cost.toFixed(4)}` : '—'}
          />
        </div>
      )}

      <Panel
        title="Conversation"
        description={`${messages.length} messages`}
        icon={<MessageSquare className="h-4 w-4" />}
        noPadding
      >
        <ScrollArea className="max-h-[60vh]">
          <div ref={scrollRef} className="divide-y">
            {messages.map((msg, i) => {
              const content = getContent(msg);
              if (!content && msg.role === 'tool') return null;
              const isUser = msg.role === 'user';
              const isTool = msg.role === 'tool';

              return (
                <div
                  key={i}
                  className={cn(
                    'px-5 py-4',
                    isUser ? 'bg-card' : isTool ? 'bg-muted/50' : 'bg-card',
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-muted">
                      {isUser ? (
                        <User className="h-3.5 w-3.5 text-chart-1" />
                      ) : isTool ? (
                        <Wrench className="h-3.5 w-3.5 text-warning" />
                      ) : (
                        <Bot className="h-3.5 w-3.5 text-brand" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <span className="text-xs font-medium capitalize">
                          {isTool
                            ? `Tool: ${msg.toolName ?? msg.name ?? 'unknown'}`
                            : (msg.role ?? 'assistant')}
                        </span>
                        {msg.timestamp && (
                          <span className="text-xs text-muted-foreground font-mono">
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
              <div className="p-8 text-center text-sm text-muted-foreground">
                No messages in this session.
              </div>
            )}
          </div>
        </ScrollArea>
      </Panel>
    </div>
  );
}
