import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProfilePillProps {
  name: string;
  avatarUrl?: string;
  emoji: string;
  onClick?: () => void;
  className?: string;
}

export function ProfilePill({ name, avatarUrl, emoji, onClick, className }: ProfilePillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex cursor-pointer items-center gap-x-2 rounded-full bg-[#e1e1e1] py-1.5 pl-3 pr-2 transition-colors hover:bg-[#d1d1d1]',
        'dark:bg-[#2D2D2D] dark:hover:bg-[#444444]',
        className,
      )}
    >
      <span className="text-sm">{emoji}</span>
      <span className="font-inter text-sm font-semibold text-[#111111] dark:text-[#e1e1e1]">
        {name}
      </span>
      {avatarUrl ? (
        <img src={avatarUrl} alt={name} className="h-6 w-6 rounded-full" />
      ) : (
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#cbcbcb] text-xs dark:bg-[#444444]">
          {name[0]}
        </span>
      )}
      <ChevronDown className="h-4 w-4 text-[#111111] dark:text-[#e1e1e1]" />
    </button>
  );
}
