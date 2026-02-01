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
      const jobList = Array.isArray(data) ? data : [];
      setJobs(jobList as CronJobData[]);
    } catch {
      // ignore
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
        const runList = Array.isArray(data) ? data : [];
        setRuns((prev) => ({ ...prev, [jobId]: runList as CronRunData[] }));
      } catch {
        setRuns((prev) => ({ ...prev, [jobId]: [] }));
      }
    }
  }

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-text-primary flex items-center gap-3">
          <Clock className="h-6 w-6 text-warning" />
          Cron Jobs
        </h1>
        <span className="text-sm text-text-muted">
          {jobs.length} jobs
        </span>
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
                    <Pause className="h-4 w-4 text-text-muted" />
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
                  {/* Job Details */}
                  <div className="grid grid-cols-3 gap-4 text-xs">
                    <div>
                      <span className="text-text-muted">Schedule</span>
                      <p className="mt-0.5 text-text-secondary font-mono">
                        {job.schedule || '—'}
                      </p>
                    </div>
                    <div>
                      <span className="text-text-muted">Next Run</span>
                      <p className="mt-0.5 text-text-secondary font-mono">
                        {job.nextRun
                          ? new Date(job.nextRun).toLocaleString()
                          : '—'}
                      </p>
                    </div>
                    <div>
                      <span className="text-text-muted">Model</span>
                      <p className="mt-0.5 text-text-secondary font-mono">
                        {job.model || 'default'}
                      </p>
                    </div>
                  </div>

                  {job.text && (
                    <div className="text-xs">
                      <span className="text-text-muted">Task</span>
                      <p className="mt-0.5 text-text-secondary line-clamp-2">
                        {job.text}
                      </p>
                    </div>
                  )}

                  {/* Expand button */}
                  <button
                    onClick={() => toggleExpand(jobId)}
                    className="flex items-center gap-1 text-xs text-accent hover:text-accent-hover transition-colors"
                  >
                    {isExpanded ? (
                      <ChevronDown className="h-3.5 w-3.5" />
                    ) : (
                      <ChevronRight className="h-3.5 w-3.5" />
                    )}
                    Run History
                  </button>

                  {/* Run History */}
                  {isExpanded && (
                    <div className="space-y-1.5 border-t border-border pt-3">
                      {(runs[jobId] ?? []).length > 0 ? (
                        (runs[jobId] ?? []).slice(0, 10).map((run, i) => (
                          <div
                            key={run.id ?? i}
                            className="flex items-center justify-between rounded-lg bg-bg-primary px-3 py-2"
                          >
                            <div className="flex items-center gap-2">
                              {run.ok !== false && !run.error ? (
                                <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                              ) : (
                                <XCircle className="h-3.5 w-3.5 text-danger" />
                              )}
                              <span className="text-xs text-text-secondary font-mono">
                                {run.startedAt
                                  ? new Date(run.startedAt).toLocaleString()
                                  : '—'}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              {(run.duration || run.durationMs) && (
                                <span className="flex items-center gap-1 text-xs text-text-muted">
                                  <Timer className="h-3 w-3" />
                                  {run.durationMs
                                    ? `${(run.durationMs / 1000).toFixed(1)}s`
                                    : `${run.duration}s`}
                                </span>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-text-muted text-center py-2">
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
