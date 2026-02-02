import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface IconButtonProps {
  icon: LucideIcon;
  onClick?: () => void;
  ariaLabel: string;
  className?: string;
}

export function IconButton({ icon: Icon, onClick, ariaLabel, className }: IconButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={cn(
        'flex h-8 w-8 items-center justify-center rounded-lg bg-[#e1e1e1] transition-colors hover:bg-[#d1d1d1]',
        'dark:bg-[#2D2D2D] dark:hover:bg-[#444444]',
        className,
      )}
    >
      <Icon className="h-4 w-4 text-[#111111] dark:text-[#e1e1e1]" />
    </button>
  );
}
