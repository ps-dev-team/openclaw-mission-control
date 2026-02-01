import clsx from 'clsx';
import type { ReactNode } from 'react';

interface PanelProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  noPadding?: boolean;
}

export function Panel({
  title,
  description,
  icon,
  actions,
  children,
  className,
  noPadding,
}: PanelProps) {
  return (
    <div
      className={clsx(
        'rounded-xl border border-border bg-bg-secondary',
        className,
      )}
    >
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div className="flex items-center gap-3">
          {icon && (
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-bg-tertiary text-text-secondary">
              {icon}
            </div>
          )}
          <div>
            <h2 className="text-sm font-semibold text-text-primary">{title}</h2>
            {description && (
              <p className="text-xs text-text-muted">{description}</p>
            )}
          </div>
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      <div className={clsx(!noPadding && 'p-5')}>{children}</div>
    </div>
  );
}

interface StatusBadgeProps {
  status: 'online' | 'offline' | 'active' | 'idle' | 'error';
  label?: string;
}

export function StatusBadge({ status, label }: StatusBadgeProps) {
  const config = {
    online: { color: 'bg-success', text: 'Online' },
    offline: { color: 'bg-danger', text: 'Offline' },
    active: { color: 'bg-accent', text: 'Active' },
    idle: { color: 'bg-warning', text: 'Idle' },
    error: { color: 'bg-danger', text: 'Error' },
  };

  const { color, text } = config[status];

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-bg-tertiary px-2.5 py-1 text-xs font-medium text-text-secondary">
      <span
        className={clsx(
          'h-2 w-2 rounded-full',
          color,
          status === 'active' && 'animate-pulse-dot',
        )}
      />
      {label ?? text}
    </span>
  );
}

interface StatCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
}

export function StatCard({ label, value, subtitle }: StatCardProps) {
  return (
    <div className="rounded-xl border border-border bg-bg-secondary p-4">
      <p className="text-xs font-medium text-text-muted">{label}</p>
      <p className="mt-1 text-2xl font-bold text-text-primary font-mono">
        {value}
      </p>
      {subtitle && (
        <p className="mt-0.5 text-xs text-text-muted">{subtitle}</p>
      )}
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-bg-tertiary text-text-muted">
        {icon}
      </div>
      <h3 className="text-sm font-medium text-text-primary">{title}</h3>
      <p className="mt-1 text-xs text-text-muted max-w-xs">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-border border-t-accent" />
    </div>
  );
}
