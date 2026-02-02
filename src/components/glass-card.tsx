'use client';

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
}

export function GlassCard({ children, className }: GlassCardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-white/50 bg-white/50 p-6 shadow-[0_0_24px_rgba(0,0,0,0.04)] backdrop-blur-[20px]',
        'dark:border-[#444444]/50 dark:bg-[#2D2D2D]/50',
        className,
      )}
    >
      {children}
    </div>
  );
}
