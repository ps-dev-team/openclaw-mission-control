'use client';

import { FolderOpen, MessageSquare, Timer } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface LeftNavProps {
  activeAgentId: string;
  activePage?: string;
}

const NAV_ITEMS = [
  {
    id: 'files',
    icon: FolderOpen,
    label: 'Files',
    href: '/files',
  },
  {
    id: 'sessions',
    icon: MessageSquare,
    label: 'Sessions',
    href: '/sessions',
  },
  {
    id: 'crons',
    icon: Timer,
    label: 'Automations',
    href: '/crons',
  },
];

export function LeftNav({ activeAgentId, activePage = 'dashboard' }: LeftNavProps) {
  return (
    <TooltipProvider delayDuration={0}>
      <motion.nav
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="fixed left-4 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-2"
      >
        {NAV_ITEMS.map((item) => {
          const isActive = activePage === item.id;
          const href = `/agent/${activeAgentId}${item.href}`;

          return (
            <Tooltip key={item.id}>
              <TooltipTrigger asChild>
                <a
                  href={href}
                  className={cn(
                    'flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-200',
                    isActive
                      ? 'glass glow-brand text-foreground'
                      : 'glass-subtle text-muted-foreground hover:glass hover:text-foreground',
                  )}
                >
                  <item.icon className="h-5 w-5" />
                </a>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={8}>
                {item.label}
              </TooltipContent>
            </Tooltip>
          );
        })}
      </motion.nav>
    </TooltipProvider>
  );
}
