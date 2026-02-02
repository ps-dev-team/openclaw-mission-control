'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { Heart, Save, Eye, Edit3, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
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
      /* ignore */
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
      /* ignore */
    }
    setSaving(false);
  }

  const hasChanges = content !== originalContent;
  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="flex items-center gap-3 text-xl font-bold">
          <Heart className="h-6 w-6 text-destructive" />
          Heartbeat
        </h1>
        <div className="flex items-center gap-2">
          {saved && (
            <Badge variant="outline" className="text-success border-success">
              ✓ Saved
            </Badge>
          )}
          {!editing ? (
            <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
              <Edit3 className="mr-2 h-3.5 w-3.5" /> Edit
            </Button>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setContent(originalContent);
                  setEditing(false);
                }}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={!hasChanges || saving}
                className="bg-brand hover:bg-brand/90 text-brand-foreground"
              >
                {saving ? (
                  <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Save className="mr-2 h-3.5 w-3.5" />
                )}
                Save
              </Button>
            </>
          )}
        </div>
      </div>

      <Panel
        title="HEARTBEAT.md"
        description="Controls what the agent checks periodically"
        icon={<Heart className="h-4 w-4" />}
        actions={
          !editing ? (
            <Badge variant="outline" className="gap-1">
              <Eye className="h-3 w-3" /> Preview
            </Badge>
          ) : undefined
        }
      >
        {editing ? (
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[400px] font-mono text-sm resize-y"
            placeholder="# HEARTBEAT.md&#10;&#10;Add tasks for the agent to check periodically..."
          />
        ) : (
          <div className="markdown-content min-h-[200px]">
            {content.trim() ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
            ) : (
              <p className="text-sm italic text-muted-foreground">
                Empty — the agent will skip heartbeat checks. Click Edit to add tasks.
              </p>
            )}
          </div>
        )}
      </Panel>
    </div>
  );
}
