'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  AlignJustify,
  ArrowUpRight,
  BookOpen,
  Bot,
  Brain,
  Clock,
  DollarSign,
  Globe,
  HeartPulse,
  Maximize2,
  Pencil,
  Sparkles,
  Users,
  UserSquare2,
  Wrench,
  Archive,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/dashboard-layout';
import { GlassCard } from '@/components/glass-card';
import { LoadingSpinner } from '@/components/panel';
import {
  fetchStatus,
  fetchSessions,
  fetchCronJobs,
  fetchConfigJson,
  fetchFile,
  fetchFileList,
} from '@/app/actions';
import { POLL_INTERVALS } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface DashboardData {
  status: Record<string, unknown>;
  sessions: unknown[];
  crons: unknown[];
  config: Record<string, unknown>;
  heartbeatCount: number;
  workspaceSkillCount: number;
  brainFiles: BrainFileInfo[];
  memoryFile: BrainFileInfo | null;
  memoryEpisodes: MemoryEpisode[];
}

interface BrainFileInfo {
  name: string;
  size: string;
  date: string;
}

interface MemoryEpisode {
  filename: string;
  date: string;
  isToday: boolean;
  title: string;
  preview: string;
}

const BRAIN_FILES = [
  {
    filename: 'SOUL.md',
    title: 'Personality and tone',
    icon: Sparkles,
  },
  {
    filename: 'AGENTS.md',
    title: 'Operating instructions',
    icon: BookOpen,
  },
  {
    filename: 'IDENTITY.md',
    title: 'Name, emoji, avatar',
    icon: UserSquare2,
  },
  {
    filename: 'USER.md',
    title: 'Info about the human',
    icon: Users,
  },
] as const;

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes}b`;
  return `${(bytes / 1024).toFixed(1)}kb`;
}

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
  } catch {
    return dateStr;
  }
}

function isToday(dateStr: string): boolean {
  const today = new Date();
  const d = new Date(dateStr);
  return (
    d.getFullYear() === today.getFullYear() &&
    d.getMonth() === today.getMonth() &&
    d.getDate() === today.getDate()
  );
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

export function DashboardClient({
  agentId,
  agentName,
  agentEmoji,
}: {
  agentId: string;
  agentName: string;
  agentEmoji: string;
}) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const [status, sessions, crons, config, heartbeatMd, skillFiles] = await Promise.all([
        fetchStatus(agentId),
        fetchSessions(agentId),
        fetchCronJobs(agentId),
        fetchConfigJson(agentId),
        fetchFile(agentId, 'HEARTBEAT.md'),
        fetchFileList(agentId, 'skills'),
      ]);

      // Count heartbeat actions: lines starting with "## " in HEARTBEAT.md
      const heartbeatCount =
        typeof heartbeatMd === 'string' ? (heartbeatMd.match(/^##\s+/gm) || []).length : 0;

      const workspaceSkillCount = Array.isArray(skillFiles) ? skillFiles.length : 0;

      // Fetch brain file metadata
      const brainFileResults = await Promise.all(
        BRAIN_FILES.map(async (bf) => {
          try {
            const content = await fetchFile(agentId, bf.filename);
            const size =
              typeof content === 'string' ? formatBytes(new Blob([content]).size) : '0b';
            return {
              name: bf.filename,
              size,
              date: formatDate(new Date().toISOString()),
            };
          } catch {
            return { name: bf.filename, size: '—', date: '—' };
          }
        }),
      );

      // Fetch MEMORY.md metadata
      let memoryFile: BrainFileInfo | null = null;
      try {
        const memContent = await fetchFile(agentId, 'MEMORY.md');
        if (typeof memContent === 'string') {
          memoryFile = {
            name: 'MEMORY.md',
            size: formatBytes(new Blob([memContent]).size),
            date: formatDate(new Date().toISOString()),
          };
        }
      } catch {
        // no memory file
      }

      // Fetch memory episodes
      let memoryEpisodes: MemoryEpisode[] = [];
      try {
        const memFiles = await fetchFileList(agentId, 'memory');
        if (Array.isArray(memFiles)) {
          const dateFiles = memFiles
            .map((f: unknown) => {
              const name = typeof f === 'string' ? f : (f as Record<string, unknown>)?.name;
              return typeof name === 'string' ? name : '';
            })
            .filter((n: string) => /^\d{4}-\d{2}-\d{2}\.md$/.test(n))
            .sort()
            .reverse()
            .slice(0, 6);

          memoryEpisodes = await Promise.all(
            dateFiles.map(async (filename: string) => {
              const dateStr = filename.replace('.md', '');
              let title = dateStr;
              let preview = '';
              try {
                const content = await fetchFile(agentId, `memory/${filename}`);
                if (typeof content === 'string') {
                  const firstLine = content.split('\n').find((l: string) => l.trim().length > 0);
                  title = firstLine?.replace(/^#+\s*/, '').slice(0, 60) || dateStr;
                  const bodyLines = content
                    .split('\n')
                    .filter((l: string) => !l.startsWith('#') && l.trim().length > 0);
                  preview = bodyLines.slice(0, 2).join(' ').slice(0, 100);
                }
              } catch {
                // keep defaults
              }
              return {
                filename,
                date: dateStr,
                isToday: isToday(dateStr),
                title,
                preview,
              };
            }),
          );
        }
      } catch {
        // no memory dir
      }

      setData({
        status: status as Record<string, unknown>,
        sessions: sessions as unknown[],
        crons: crons as unknown[],
        config: config as Record<string, unknown>,
        heartbeatCount,
        workspaceSkillCount,
        brainFiles: brainFileResults,
        memoryFile,
        memoryEpisodes,
      });
    } catch {
      // keep stale data
    }
    setLoading(false);
  }, [agentId]);

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, POLL_INTERVALS.ACTIVE);
    return () => clearInterval(interval);
  }, [refresh]);

  const status = data?.status ?? {};
  const isOnline = (status as { online?: boolean }).online ?? false;
  const sessions = Array.isArray(data?.sessions) ? data.sessions : [];

  const statusObj = status as Record<string, unknown>;
  const result = (statusObj.result ?? statusObj) as Record<string, unknown>;

  // Parse config for channels and gateway info
  const config = data?.config ?? {};
  const configChannels = config.channels as Record<string, unknown> | undefined;
  const channelCount = configChannels ? Object.keys(configChannels).length : 0;
  const concurrency = config.concurrency as Record<string, unknown> | undefined;
  const concurrencyMax = concurrency?.max ?? config.maxConcurrency;
  const concurrencyCurrent = concurrency?.current ?? concurrency?.active;

  // Skills: total from status, workspace from file listing
  const skills = Array.isArray(result.skills) ? result.skills : [];
  const totalSkills = skills.length;
  const workspaceSkillCount = data?.workspaceSkillCount ?? 0;
  const heartbeatCount = data?.heartbeatCount ?? 0;

  // Gateway info
  const gatewayHost = result.host ? String(result.host) : '';
  const portMatch = gatewayHost.match(/:(\d+)/);
  const gatewayPort = portMatch ? portMatch[1] : '';
  const isLocal =
    gatewayHost.includes('localhost') ||
    gatewayHost.includes('127.0.0.1') ||
    gatewayHost.includes('0.0.0.0');

  // Sessions activity
  const activeSessions = sessions.filter(
    (s: unknown) => s && typeof s === 'object' && 'kind' in s,
  );

  if (loading) {
    return (
      <DashboardLayout
        agentId={agentId}
        agentName={agentName}
        agentEmoji={agentEmoji}
        isOnline={false}
      >
        <LoadingSpinner />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      agentId={agentId}
      agentName={agentName}
      agentEmoji={agentEmoji}
      isOnline={isOnline}
      activePage="dashboard"
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 xl:[grid-template-columns:repeat(3,minmax(0,400px))] xl:[grid-template-rows:auto_auto]"
      >
        {/* ============ COLUMN 1: Agent Status ============ */}
        <motion.div variants={itemVariants} className="xl:row-span-2">
          <GlassCard className="h-full flex flex-col !p-0">
            {/* Header: Avatar + Name + Status + JSON button */}
            <div className="px-5 pt-5 pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {/* Avatar circle */}
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-muted text-2xl">
                    {agentEmoji}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-foreground leading-tight">
                      {agentName} {agentEmoji}
                    </h2>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span
                        className={cn(
                          'h-2 w-2 rounded-full',
                          isOnline ? 'bg-success animate-pulse-dot' : 'bg-destructive',
                        )}
                      />
                      <span className="font-data text-sm font-medium text-[#CBCBCB]">
                        {isOnline ? 'online' : 'offline'}
                      </span>
                    </div>
                  </div>
                </div>
                {/* JSON button */}
                <button
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="View JSON"
                >
                  <span className="font-data text-xs font-bold">{'{ }'}</span>
                </button>
              </div>
            </div>

            {/* Info sections */}
            <div className="px-5 space-y-4 pb-4 flex-1">
              <StatusRow
                label="CHANNELS"
                icon={<Globe className="h-5 w-5 text-[#CBCBCB]" />}
                value={channelCount > 0 ? `${channelCount} channels` : '—'}
                agentId={agentId}
              />
              <StatusRow
                label="SKILLS"
                icon={<Wrench className="h-5 w-5 text-[#CBCBCB]" />}
                value={
                  totalSkills > 0 ? `${totalSkills} (${workspaceSkillCount} workspace)` : '—'
                }
                agentId={agentId}
                href={`/agent/${agentId}/skills`}
              />
              <StatusRow
                label="HEARTBEATS"
                icon={<HeartPulse className="h-5 w-5 text-[#CBCBCB]" />}
                value={heartbeatCount > 0 ? `${heartbeatCount} Heartbeat actions` : '—'}
                agentId={agentId}
                href={`/agent/${agentId}/heartbeat`}
              />
            </div>

            {/* System info panel — always show all 3 rows */}
            <div className="mx-3 mb-3 rounded-lg glass-subtle px-4 py-3 space-y-2 mt-auto">
              {/* Row 1: Model */}
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-muted-foreground shrink-0" />
                <span className="font-data text-xs font-semibold text-foreground">
                  {result.model || result.defaultModel
                    ? String(result.model || result.defaultModel)
                    : '—'}
                </span>
              </div>
              {/* Row 2: Gateway */}
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-muted-foreground shrink-0" />
                <span className="font-data text-xs font-semibold text-muted-foreground">
                  {gatewayHost
                    ? `${gatewayPort ? `port ${gatewayPort}` : gatewayHost}${isLocal ? ', local' : ''}${concurrencyMax ? ` | Concurrency: ${concurrencyCurrent ?? '—'}/${String(concurrencyMax)}` : ''}`
                    : '—'}
                </span>
              </div>
              {/* Row 3: Uptime + Version */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-muted-foreground shrink-0" />
                  <span className="font-data text-xs font-semibold text-muted-foreground">
                    {result.uptime ? String(result.uptime) : '—'}
                  </span>
                </div>
                <span className="font-data text-xs font-semibold text-muted-foreground">
                  {result.version ? `v${String(result.version)}` : '—'}
                </span>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* ============ COLUMN 2, TOP: Activity Log ============ */}
        <motion.div variants={itemVariants}>
          <GlassCard>
            <div className="flex items-center gap-3 w-full mb-4">
              <AlignJustify className="h-5 w-5 text-foreground shrink-0" />
              <h2 className="text-lg font-bold text-foreground flex-1">Activity log</h2>
              <a
                href={`/agent/${agentId}/sessions`}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Expand activity log"
              >
                <ArrowUpRight className="h-5 w-5" />
              </a>
            </div>
            <div className="space-y-2">
              {activeSessions.length > 0 ? (
                activeSessions.slice(0, 6).map((session: unknown, i: number) => {
                  const s = session as Record<string, unknown>;
                  return (
                    <a
                      key={String(s.key ?? i)}
                      href={`/agent/${agentId}/sessions/${String(s.key ?? '')}`}
                      className="flex items-center gap-3 rounded-lg p-2 -mx-2 hover:bg-white/5 transition-colors"
                    >
                      <div className="h-2 w-2 rounded-full bg-success animate-pulse-dot shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {String(s.label ?? s.key ?? `Session ${i + 1}`)}
                        </p>
                        <p className="text-xs text-muted-foreground font-data">
                          {s.kind ? String(s.kind) : 'session'}
                          {s.channel ? ` · ${String(s.channel)}` : ''}
                        </p>
                      </div>
                    </a>
                  );
                })
              ) : (
                <p className="text-sm text-muted-foreground text-center py-6">
                  No active sessions
                </p>
              )}
            </div>
          </GlassCard>
        </motion.div>

        {/* ============ COLUMN 3, TOP: Brain ============ */}
        <motion.div variants={itemVariants}>
          <GlassCard>
            <div className="flex items-center gap-3 w-full mb-4">
              <Brain className="h-5 w-5 text-foreground shrink-0" />
              <h2 className="text-lg font-bold text-foreground flex-1">Brain</h2>
            </div>
            <div>
              {BRAIN_FILES.map((bf, idx) => {
                const fileInfo = data?.brainFiles?.[idx];
                const IconComp = bf.icon;
                return (
                  <div
                    key={bf.filename}
                    className={cn(
                      'flex items-center gap-3 py-3',
                      idx === 0 && 'pt-0',
                      idx !== BRAIN_FILES.length - 1 &&
                        'border-b border-black/[0.06] dark:border-white/[0.06]',
                      idx === BRAIN_FILES.length - 1 && 'pb-0',
                    )}
                  >
                    <IconComp className="h-5 w-5 text-muted-foreground shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-semibold text-foreground">{bf.title}</p>
                      <p className="font-data text-xs font-bold text-[#CBCBCB]">
                        {bf.filename}
                        {fileInfo?.size ? ` | ${fileInfo.size}` : ''}
                        {fileInfo?.date ? ` | ${fileInfo.date}` : ''}
                      </p>
                    </div>
                    <a
                      href={`/agent/${agentId}/memory`}
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-foreground transition-colors shrink-0"
                      aria-label={`Edit ${bf.filename}`}
                    >
                      <Pencil className="h-4 w-4" />
                    </a>
                  </div>
                );
              })}
            </div>
          </GlassCard>
        </motion.div>

        {/* ============ COLUMN 2, BOTTOM: Costs ============ */}
        <motion.div variants={itemVariants}>
          <GlassCard>
            <div className="flex items-center gap-3 w-full mb-4">
              <div className="flex h-6 w-6 items-center justify-center rounded-full border border-border">
                <DollarSign className="h-4 w-4 text-foreground" />
              </div>
              <h2 className="text-lg font-bold text-foreground flex-1">Costs</h2>
              <a
                href={`/agent/${agentId}/costs`}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Expand costs"
              >
                <ArrowUpRight className="h-5 w-5" />
              </a>
            </div>
            <p className="text-sm text-muted-foreground text-center py-6">
              Token usage &amp; cost summary
            </p>
          </GlassCard>
        </motion.div>

        {/* ============ COLUMN 3, BOTTOM: Memory ============ */}
        <motion.div variants={itemVariants}>
          <GlassCard>
            <div className="flex items-center gap-3 w-full mb-4">
              <Brain className="h-5 w-5 text-foreground shrink-0" />
              <h2 className="text-lg font-bold text-foreground flex-1">Memory</h2>
              <a
                href={`/agent/${agentId}/memory`}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Expand memory"
              >
                <ArrowUpRight className="h-5 w-5" />
              </a>
            </div>
            <div className="space-y-4">
              {/* MEMORY.md entry */}
              {data?.memoryFile && (
                <div className="flex items-center gap-3">
                  <Archive className="h-5 w-5 text-muted-foreground shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-semibold text-foreground">Long term memory</p>
                    <p className="font-data text-xs font-bold text-[#CBCBCB]">
                      {data.memoryFile.name}
                      {data.memoryFile.size ? ` | ${data.memoryFile.size}` : ''}
                      {data.memoryFile.date ? ` | ${data.memoryFile.date}` : ''}
                    </p>
                  </div>
                  <a
                    href={`/agent/${agentId}/memory`}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-foreground transition-colors shrink-0"
                    aria-label="Edit MEMORY.md"
                  >
                    <Pencil className="h-4 w-4" />
                  </a>
                </div>
              )}

              {/* Daily episodes */}
              {data?.memoryEpisodes && data.memoryEpisodes.length > 0 && (
                <div className="space-y-3">
                  <div className="h-px bg-border" />
                  {data.memoryEpisodes.map((ep) => (
                    <div key={ep.filename} className="flex items-start gap-3">
                      {/* Thumbnail square — 48x48, dark bg per Figma */}
                      <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-black dark:bg-white/10">
                        {ep.isToday && (
                          <span className="absolute -top-1.5 -right-1.5 rounded bg-success px-1.5 py-0.5 font-data text-[9px] font-bold text-white leading-none">
                            TODAY
                          </span>
                        )}
                        <span className="font-data text-[10px] font-semibold text-white/70 dark:text-white/50">
                          {ep.date.slice(5)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0 py-0.5">
                        <p className="text-sm font-semibold text-foreground truncate">
                          {ep.title}
                        </p>
                        {ep.preview && (
                          <p className="text-xs text-[#CBCBCB] line-clamp-2 mt-0.5">
                            {ep.preview}
                          </p>
                        )}
                      </div>
                      <a
                        href={`/agent/${agentId}/memory`}
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground transition-colors shrink-0 mt-1"
                        aria-label={`Open ${ep.filename}`}
                      >
                        <ArrowUpRight className="h-4 w-4" />
                      </a>
                    </div>
                  ))}
                </div>
              )}

              {!data?.memoryFile &&
                (!data?.memoryEpisodes || data.memoryEpisodes.length === 0) && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No memory files found
                  </p>
                )}
            </div>
          </GlassCard>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
}

/* ===== Status Row Component ===== */
function StatusRow({
  label,
  icon,
  value,
  agentId,
  href,
}: {
  label: string;
  icon: React.ReactNode;
  value: string;
  agentId: string;
  href?: string;
}) {
  return (
    <div>
      <span className="font-data text-[10px] font-black uppercase tracking-wider text-[#CBCBCB]">
        {label}
      </span>
      <div className="flex items-center gap-2 mt-1">
        {icon}
        <span className="font-data text-sm font-semibold text-foreground flex-1">{value}</span>
        {href ? (
          <a
            href={href}
            className="flex h-7 w-7 items-center justify-center rounded text-muted-foreground hover:text-foreground transition-colors"
            aria-label={`Expand ${label.toLowerCase()}`}
          >
            <Maximize2 className="h-4 w-4" />
          </a>
        ) : (
          <button
            className="flex h-7 w-7 items-center justify-center rounded text-muted-foreground hover:text-foreground transition-colors"
            aria-label={`Expand ${label.toLowerCase()}`}
          >
            <Maximize2 className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
