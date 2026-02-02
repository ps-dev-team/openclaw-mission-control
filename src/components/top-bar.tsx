'use client';

import { Settings, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useTheme } from '@/lib/theme';

interface TopBarProps {
  agentName?: string;
  agentEmoji?: string;
  isOnline?: boolean;
}

export function TopBar({
  agentName = 'Agent',
  agentEmoji = '🤖',
  isOnline = false,
}: TopBarProps) {
  const { theme } = useTheme();

  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="flex items-center justify-between px-6 py-4"
    >
      {/* Logo */}
      <div className="flex items-center gap-3">
        <h1 className="font-audiowide text-[32px] leading-none tracking-tight text-foreground">
          OpenClaw{' '}
          <span className="text-muted-foreground font-normal">Mission Control</span>
        </h1>
      </div>

      {/* Right side: settings + profile pill */}
      <div className="flex items-center gap-3">
        {/* Settings gear */}
        <button
          className={cn(
            'flex h-10 w-10 items-center justify-center rounded-xl',
            'glass-subtle hover:glass transition-all duration-200',
            'text-muted-foreground hover:text-foreground',
          )}
          aria-label="Settings"
        >
          <Settings className="h-[18px] w-[18px]" />
        </button>

        {/* Profile pill */}
        <button
          className={cn(
            'flex items-center gap-2.5 rounded-full px-3 py-1.5',
            'glass hover:glow-brand transition-all duration-200',
          )}
        >
          <span className="text-lg leading-none">{agentEmoji}</span>
          <span className="text-sm font-medium text-foreground">{agentName}</span>
          <div className="flex items-center gap-1.5">
            <span
              className={cn(
                'h-2 w-2 rounded-full',
                isOnline ? 'bg-success animate-pulse-dot' : 'bg-muted-foreground',
              )}
            />
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
        </button>
      </div>
    </motion.header>
  );
}
