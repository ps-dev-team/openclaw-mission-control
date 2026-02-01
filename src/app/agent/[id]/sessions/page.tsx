'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  MessageSquare,
  Hash,
  User,
  Bot,
  Clock,
  RefreshCw,
} from 'lucide-react';
import { Panel, EmptyState, LoadingSpinner, StatusBadge } from '@/components/panel';
import { fetchSessions } from '@/app/actions';
import { POLL_INTERVALS } from '@/lib/constants';

interface SessionData {
  key?: string;
  sessionKey?: string;
  kind?: string;
  channel?: string;
  label?: string;
  startedAt?: string;
  lastActivity?: string;
  messageCount?: number;
  messages?: Array<{
    role?: string;
    content?: string;
  }>;
}

export default function SessionsPage() {
  const params = useParams();
  const agentId = params.id as string;
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const data = await fetchSessions(agentId);
      setSessions(Array.isArray(data) ? (data as SessionData[]) : []);
    } catch {
      // ignore
    }
    setLoading(false);
  }, [agentId]);

  useEffect(() => {
    load();
    const interval = setInterval(load, POLL_INTERVALS.SESSIONS);
    return () => clearInterval(interval);
  }, [load]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-text-primary flex items-center gap-3">
          <MessageSquare className="h-6 w-6 text-success" />
          Sessions
        </h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-text-muted">
            {sessions.length} sessions
          </span>
          <button
            onClick={load}
            className="rounded-lg border border-border p-1.5 text-text-muted hover:bg-bg-tertiary hover:text-text-secondary transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {sessions.length > 0 ? (
        <div className="space-y-2">
          {sessions.map((session, i) => {
            const key = session.key ?? session.sessionKey ?? `session-${i}`;
            const lastMessage = session.messages?.[session.messages.length - 1];

            return (
              <Link
                key={key}
                href={`/agent/${agentId}/sessions/${encodeURIComponent(key)}`}
                className="block rounded-xl border border-border bg-bg-secondary p-4 transition-colors hover:border-border-hover hover:bg-bg-tertiary"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {session.kind === 'dm' || session.channel ? (
                        <User className="h-4 w-4 text-accent" />
                      ) : (
                        <Bot className="h-4 w-4 text-brand" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-primary font-mono">
                        {session.label ?? key.slice(0, 12)}
                      </p>
                      <div className="mt-1 flex items-center gap-2">
                        {session.kind && (
                          <span className="inline-flex items-center gap-1 rounded bg-bg-primary px-1.5 py-0.5 text-xs text-text-muted">
                            <Hash className="h-3 w-3" />
                            {session.kind}
                          </span>
                        )}
                        {session.channel && (
                          <span className="text-xs text-text-muted">
                            {session.channel}
                          </span>
                        )}
                      </div>
                      {lastMessage?.content && (
                        <p className="mt-2 text-xs text-text-muted line-clamp-2 max-w-lg">
                          {lastMessage.content.slice(0, 200)}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <StatusBadge status="active" />
                    {session.lastActivity && (
                      <span className="flex items-center gap-1 text-xs text-text-muted">
                        <Clock className="h-3 w-3" />
                        {new Date(session.lastActivity).toLocaleTimeString()}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <Panel title="Sessions" icon={<MessageSquare className="h-4 w-4" />}>
          <EmptyState
            icon={<MessageSquare className="h-6 w-6" />}
            title="No Sessions"
            description="No active sessions found."
          />
        </Panel>
      )}
    </div>
  );
}
