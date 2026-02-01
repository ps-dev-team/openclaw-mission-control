'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { Heart, Save, Eye, Edit3, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Panel, LoadingSpinner } from '@/components/panel';
import { fetchFile, saveFile } from '@/app/actions';

export default function HeartbeatPage() {
  const params = useParams();
  const agentId = params.id as string;
  const [content, setContent] = useState('');
  const [originalContent, setOriginalContent] = useState('');
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const data = await fetchFile(agentId, 'HEARTBEAT.md');
      setContent(data);
      setOriginalContent(data);
    } catch {
      // ignore
    }
    setLoading(false);
  }, [agentId]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    try {
      await saveFile(agentId, 'HEARTBEAT.md', content);
      setOriginalContent(content);
      setSaved(true);
      setEditing(false);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      // ignore
    }
    setSaving(false);
  }

  function handleCancel() {
    setContent(originalContent);
    setEditing(false);
  }

  const hasChanges = content !== originalContent;

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-text-primary flex items-center gap-3">
          <Heart className="h-6 w-6 text-danger" />
          Heartbeat
        </h1>
        <div className="flex items-center gap-2">
          {saved && (
            <span className="text-xs text-success">✓ Saved</span>
          )}
          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-sm text-text-secondary hover:bg-bg-tertiary transition-colors"
            >
              <Edit3 className="h-3.5 w-3.5" />
              Edit
            </button>
          ) : (
            <>
              <button
                onClick={handleCancel}
                className="rounded-lg border border-border px-3 py-1.5 text-sm text-text-muted hover:bg-bg-tertiary transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!hasChanges || saving}
                className="flex items-center gap-2 rounded-lg bg-brand px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-hover transition-colors disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Save className="h-3.5 w-3.5" />
                )}
                Save
              </button>
            </>
          )}
        </div>
      </div>

      <Panel
        title="HEARTBEAT.md"
        description="Controls what the agent checks periodically"
        icon={<Heart className="h-4 w-4" />}
        actions={
          <div className="flex items-center gap-2">
            {!editing && (
              <span className="flex items-center gap-1 text-xs text-text-muted">
                <Eye className="h-3 w-3" /> Preview
              </span>
            )}
          </div>
        }
      >
        {editing ? (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full min-h-[400px] rounded-lg border border-border bg-bg-primary p-4 text-sm text-text-primary font-mono outline-none focus:border-accent resize-y"
            placeholder="# HEARTBEAT.md&#10;&#10;Add tasks for the agent to check periodically..."
          />
        ) : (
          <div className="markdown-content min-h-[200px]">
            {content.trim() ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content}
              </ReactMarkdown>
            ) : (
              <p className="text-sm text-text-muted italic">
                Empty — the agent will skip heartbeat checks. Click Edit to add
                tasks.
              </p>
            )}
          </div>
        )}
      </Panel>
    </div>
  );
}
