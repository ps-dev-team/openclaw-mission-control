'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { Brain, FileText, Search } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Panel, EmptyState, LoadingSpinner } from '@/components/panel';
import { fetchFile, fetchFileList } from '@/app/actions';

export default function MemoryPage() {
  const params = useParams();
  const agentId = params.id as string;
  const [memoryMd, setMemoryMd] = useState('');
  const [dailyFiles, setDailyFiles] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [selectedContent, setSelectedContent] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      const [memory, files] = await Promise.all([
        fetchFile(agentId, 'MEMORY.md'),
        fetchFileList(agentId, 'memory'),
      ]);
      setMemoryMd(memory);
      const fileList = Array.isArray(files)
        ? (files as string[])
            .filter((f) => f.endsWith('.md'))
            .sort()
            .reverse()
        : [];
      setDailyFiles(fileList);
    } catch {
      // ignore
    }
    setLoading(false);
  }, [agentId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  async function loadFile(file: string) {
    setSelectedFile(file);
    const content = await fetchFile(agentId, `memory/${file}`);
    setSelectedContent(content);
  }

  if (loading) return <LoadingSpinner />;

  const filteredContent = search
    ? memoryMd
        .split('\n')
        .filter((l) => l.toLowerCase().includes(search.toLowerCase()))
        .join('\n')
    : memoryMd;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="flex items-center gap-3 text-xl font-bold">
          <Brain className="h-6 w-6 text-brand" />
          Memory
        </h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search memory..."
            className="pl-9 w-64"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <Panel
            title="MEMORY.md"
            description="Long-term memory"
            icon={<Brain className="h-4 w-4" />}
          >
            {memoryMd ? (
              <ScrollArea className="max-h-[70vh]">
                <div className="markdown-content">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {filteredContent}
                  </ReactMarkdown>
                </div>
              </ScrollArea>
            ) : (
              <EmptyState
                icon={<Brain className="h-6 w-6" />}
                title="No Memory File"
                description="MEMORY.md not found or empty."
              />
            )}
          </Panel>
        </div>

        <div className="space-y-4">
          <Panel
            title="Daily Notes"
            description={`${dailyFiles.length} files`}
            icon={<FileText className="h-4 w-4" />}
            noPadding
          >
            <ScrollArea className="max-h-[30vh]">
              {dailyFiles.length > 0 ? (
                dailyFiles.map((file) => (
                  <Button
                    key={file}
                    variant={selectedFile === file ? 'secondary' : 'ghost'}
                    className="w-full justify-start rounded-none h-10 font-mono text-xs"
                    onClick={() => loadFile(file)}
                  >
                    {file.replace('.md', '')}
                  </Button>
                ))
              ) : (
                <div className="p-4 text-center text-xs text-muted-foreground">
                  No daily notes found
                </div>
              )}
            </ScrollArea>
          </Panel>

          {selectedFile && (
            <Panel
              title={selectedFile.replace('.md', '')}
              description="Daily note"
              icon={<FileText className="h-4 w-4" />}
            >
              <ScrollArea className="max-h-[40vh]">
                <div className="markdown-content">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {selectedContent}
                  </ReactMarkdown>
                </div>
              </ScrollArea>
            </Panel>
          )}
        </div>
      </div>
    </div>
  );
}
