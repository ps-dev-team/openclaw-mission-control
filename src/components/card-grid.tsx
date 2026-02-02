'use client';

import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CardGridProps {
  children: ReactNode;
  className?: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

/**
 * 3-column grid layout for dashboard cards.
 * 400px columns, 24px gap, scrollable.
 */
export function CardGrid({ children, className }: CardGridProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className={cn(
        'grid gap-6',
        'grid-cols-1 md:grid-cols-2 xl:grid-cols-3',
        'xl:[grid-template-columns:repeat(3,400px)]',
        className,
      )}
    >
      {children}
    </motion.div>
  );
}

interface CardGridItemProps {
  children: ReactNode;
  className?: string;
  /** Span multiple columns */
  span?: 1 | 2 | 3;
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

export function CardGridItem({ children, className, span = 1 }: CardGridItemProps) {
  return (
    <motion.div
      variants={itemVariants}
      className={cn(
        span === 2 && 'md:col-span-2',
        span === 3 && 'md:col-span-2 xl:col-span-3',
        className,
      )}
    >
      {children}
    </motion.div>
  );
}
