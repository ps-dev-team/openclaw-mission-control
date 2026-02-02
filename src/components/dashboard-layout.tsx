'use client';

import type { ReactNode } from 'react';
import { ThemeProvider, useTheme } from '@/lib/theme';
import { TopBar } from '@/components/top-bar';
import { LeftNav } from '@/components/left-nav';
import { useEffect } from 'react';

interface DashboardLayoutProps {
  children: ReactNode;
  agentId: string;
  agentName: string;
  agentEmoji: string;
  isOnline: boolean;
  activePage?: string;
}

function DashboardLayoutInner({
  children,
  agentId,
  agentName,
  agentEmoji,
  isOnline,
  activePage = 'dashboard',
}: DashboardLayoutProps) {
  const { setAgentState } = useTheme();

  useEffect(() => {
    setAgentState(isOnline ? 'online' : 'idle');
  }, [isOnline, setAgentState]);

  return (
    <div className="relative min-h-screen">
      {/* Full-screen fixed background image */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/bg-dashboard.jpg)' }}
      />
      {/* Semi-transparent overlay — lets bg pattern show through */}
      <div className="fixed inset-0 z-0 bg-[#F0EEEB]/70 dark:bg-[#1A1A1A]/70" />

      {/* Content layer */}
      <div className="relative z-10 flex min-h-screen flex-col">
        {/* Top bar */}
        <TopBar agentName={agentName} agentEmoji={agentEmoji} isOnline={isOnline} />

        {/* Left nav */}
        <LeftNav activeAgentId={agentId} activePage={activePage} />

        {/* Main content area with left margin for nav */}
        <main className="flex-1 pl-20 pr-6 pb-6">{children}</main>
      </div>

      {/* 3D robot mascot - bottom left decorative (prominent, per Figma) */}
      <div className="fixed bottom-0 left-0 z-[5] pointer-events-none">
        <img
          src="/mascot-dark.png"
          alt=""
          className="hidden dark:block h-[420px] w-auto animate-float drop-shadow-2xl"
          aria-hidden="true"
        />
        <img
          src="/mascot-light.png"
          alt=""
          className="dark:hidden h-[420px] w-auto animate-float drop-shadow-2xl"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}

export function DashboardLayout(props: DashboardLayoutProps) {
  return (
    <ThemeProvider>
      <DashboardLayoutInner {...props} />
    </ThemeProvider>
  );
}
