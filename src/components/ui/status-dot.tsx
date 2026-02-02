import { cn } from '@/lib/utils';

interface StatusDotProps {
  isOnline: boolean;
  className?: string;
}

export function StatusDot({ isOnline, className }: StatusDotProps) {
  return (
    <span
      className={cn('h-2 w-2 rounded-full', isOnline ? 'bg-[#00a955]' : 'bg-[#e90303]', className)}
      aria-label={isOnline ? 'Online' : 'Offline'}
    />
  );
}
