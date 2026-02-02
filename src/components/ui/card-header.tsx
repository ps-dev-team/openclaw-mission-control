import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CardHeaderProps {
  icon: LucideIcon;
  title: string;
  action?: ReactNode;
  className?: string;
}

export function CardHeader({ icon: Icon, title, action, className }: CardHeaderProps) {
  return (
    <div className={cn('mb-4 flex w-full items-center justify-between', className)}>
      <div className="flex items-center gap-x-3">
        <Icon className="h-6 w-6 text-[#111111] dark:text-[#e1e1e1]" />
        <h3 className="font-inter text-base font-semibold text-[#111111] dark:text-[#ffffff]">
          {title}
        </h3>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
