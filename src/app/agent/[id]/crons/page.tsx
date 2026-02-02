'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import {
  Clock,
  ChevronDown,
  ChevronRight,
  Play,
  Pause,
  CheckCircle2,
  XCircle,
  Timer,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Panel, EmptyState, LoadingSpinner, StatusBadge } from '@/components/panel';
import { fetchCronJobs, fetchCronRuns } from '@/app/actions';

interface CronJobData {
  id?: string;
  jobId?: string;
  text?: string;
  schedule?: string;
  nextRun?: string;
  lastRun?: string;
  enabled?: boolean;
  disabled?: boolean;
  model?: string;
}

interface CronRunData {
  id?: string;
  startedAt?: string;
  completedAt?: string;
  duration?: number;
  durationMs?: number;
  status?: string;
  error?: string;
  ok?: boolean;
}

export default function CronsPage() {
  const params = useParams();
  const agentId = params.id as string;
  const [jobs, setJobs] = useState<CronJobData[]>([]);
  const [expandedJob, setExpandedJob] = useState<string | null>(null);
  const [runs, setRuns] = useState<Record<string, CronRunData[]>>({});
  const [loading, setLoading] = useState(true);

  const loadJobs = useCallback(async () => {
    try {
      const data = await fetchCronJobs(agentId);
      setJobs(Array.isArray(data) ? (data as CronJobData[]) : []);
    } catch {
      /* ignore */
    }
    setLoading(false);
  }, [agentId]);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  async function toggleExpand(jobId: string) {
    if (expandedJob === jobId) {
      setExpandedJob(null);
      return;
    }
    setExpandedJob(jobId);
    if (!runs[jobId]) {
      try {
        const data = await fetchCronRuns(agentId, jobId);
        setRuns((prev) => ({
          ...prev,
          [jobId]: Array.isArray(data) ? (data as CronRunData[]) : [],
        }));
      } catch {
        setRuns((prev) => ({ ...prev, [jobId]: [] }));
      }
    }
  }

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="flex items-center gap-3 text-xl font-bold">
          <Clock className="h-6 w-6 text-warning" />
          Cron Jobs
        </h1>
        <Badge variant="secondary">{jobs.length} jobs</Badge>
      </div>

      {jobs.length > 0 ? (
        <div className="space-y-3">
          {jobs.map((job) => {
            const jobId = job.jobId ?? job.id ?? '';
            const isEnabled = job.enabled !== false && !job.disabled;
            const isExpanded = expandedJob === jobId;

            return (
              <Panel
                key={jobId}
                title={jobId}
                icon={
                  isEnabled ? (
                    <Play className="h-4 w-4 text-success" />
                  ) : (
                    <Pause className="h-4 w-4 text-muted-foreground" />
                  )
                }
                actions={
                  <StatusBadge
                    status={isEnabled ? 'online' : 'idle'}
                    label={isEnabled ? 'Active' : 'Disabled'}
                  />
                }
              >
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-4 text-xs">
                    <div>
                      <span className="text-muted-foreground">Schedule</span>
                      <p className="mt-0.5 font-mono">{job.schedule || '—'}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Next Run</span>
                      <p className="mt-0.5 font-mono">
                        {job.nextRun ? new Date(job.nextRun).toLocaleString() : '—'}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Model</span>
                      <p className="mt-0.5 font-mono">{job.model || 'default'}</p>
                    </div>
                  </div>

                  {job.text && (
                    <div className="text-xs">
                      <span className="text-muted-foreground">Task</span>
                      <p className="mt-0.5 line-clamp-2">{job.text}</p>
                    </div>
                  )}

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleExpand(jobId)}
                    className="h-7 px-2 text-xs text-brand"
                  >
                    {isExpanded ? (
                      <ChevronDown className="mr-1 h-3.5 w-3.5" />
                    ) : (
                      <ChevronRight className="mr-1 h-3.5 w-3.5" />
                    )}
                    Run History
                  </Button>

                  {isExpanded && (
                    <div className="space-y-1.5 border-t pt-3">
                      {(runs[jobId] ?? []).length > 0 ? (
                        (runs[jobId] ?? []).slice(0, 10).map((run, i) => (
                          <div
                            key={run.id ?? i}
                            className="flex items-center justify-between rounded-lg bg-muted px-3 py-2"
                          >
                            <div className="flex items-center gap-2">
                              {run.ok !== false && !run.error ? (
                                <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                              ) : (
                                <XCircle className="h-3.5 w-3.5 text-destructive" />
                              )}
                              <span className="text-xs font-mono">
                                {run.startedAt
                                  ? new Date(run.startedAt).toLocaleString()
                                  : '—'}
                              </span>
                            </div>
                            {(run.duration || run.durationMs) && (
                              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Timer className="h-3 w-3" />
                                {run.durationMs
                                  ? `${(run.durationMs / 1000).toFixed(1)}s`
                                  : `${run.duration}s`}
                              </span>
                            )}
                          </div>
                        ))
                      ) : (
                        <p className="py-2 text-center text-xs text-muted-foreground">
                          No runs recorded
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </Panel>
            );
          })}
        </div>
      ) : (
        <Panel title="Cron Jobs" icon={<Clock className="h-4 w-4" />}>
          <EmptyState
            icon={<Clock className="h-6 w-6" />}
            title="No Cron Jobs"
            description="No scheduled tasks found."
          />
        </Panel>
      )}
    </div>
  );
}
