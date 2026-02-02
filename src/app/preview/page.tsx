'use client';

import { Brain, Heart, Settings, Sparkles, Wrench } from 'lucide-react';
import { StatusDot } from '@/components/ui/status-dot';
import { IconButton } from '@/components/ui/icon-button';
import { GlassCard } from '@/components/glass-card';
import { CardHeader } from '@/components/ui/card-header';
import { ProfilePill } from '@/components/ui/profile-pill';

function SectionLabel({ name }: { name: string }) {
  return (
    <span className="mb-2 inline-block rounded bg-[#111111]/10 px-2 py-0.5 font-mono text-xs text-[#111111]/60 dark:bg-white/10 dark:text-white/60">
      {name}
    </span>
  );
}

export default function PreviewPage() {
  return (
    <div className="relative min-h-screen">
      {/* Background */}
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/bg-dashboard.jpg)' }}
      />
      <div className="fixed inset-0 -z-10 bg-[#F0EEEB]/70 dark:bg-[#1A1A1A]/70" />

      {/* Content */}
      <div className="mx-auto max-w-3xl space-y-10 p-10">
        <h1 className="font-inter text-2xl font-bold text-[#111111] dark:text-[#e1e1e1]">
          Component Preview
        </h1>

        {/* StatusDot */}
        <section>
          <SectionLabel name="StatusDot" />
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <StatusDot isOnline={true} />
              <span className="font-mono text-xs text-[#111111] dark:text-[#e1e1e1]">Online</span>
            </div>
            <div className="flex items-center gap-2">
              <StatusDot isOnline={false} />
              <span className="font-mono text-xs text-[#111111] dark:text-[#e1e1e1]">Offline</span>
            </div>
          </div>
        </section>

        {/* IconButton */}
        <section>
          <SectionLabel name="IconButton" />
          <div className="flex items-center gap-3">
            <IconButton icon={Settings} ariaLabel="Settings" />
            <IconButton icon={Sparkles} ariaLabel="Sparkles" />
            <IconButton icon={Wrench} ariaLabel="Tools" />
            <IconButton icon={Heart} ariaLabel="Heartbeat" />
          </div>
        </section>

        {/* GlassCard */}
        <section>
          <SectionLabel name="GlassCard" />
          <div className="space-y-4">
            <GlassCard>
              <p className="font-inter text-sm text-[#111111] dark:text-[#e1e1e1]">
                Empty glass card with default padding.
              </p>
            </GlassCard>
            <GlassCard>
              <p className="font-inter text-sm font-semibold text-[#111111] dark:text-[#e1e1e1]">
                Agent Status
              </p>
              <p className="mt-1 font-mono text-xs text-[#cbcbcb]">
                Model: claude-sonnet-4-20250514 &middot; Uptime: 3h 42m
              </p>
            </GlassCard>
          </div>
        </section>

        {/* CardHeader */}
        <section>
          <SectionLabel name="CardHeader" />
          <div className="space-y-4">
            <GlassCard>
              <CardHeader icon={Brain} title="Brain" />
              <p className="font-mono text-xs text-[#cbcbcb]">Card content goes here...</p>
            </GlassCard>
            <GlassCard>
              <CardHeader
                icon={Sparkles}
                title="Skills"
                action={<IconButton icon={Wrench} ariaLabel="Edit skills" />}
              />
              <p className="font-mono text-xs text-[#cbcbcb]">Card with action button in header.</p>
            </GlassCard>
          </div>
        </section>

        {/* ProfilePill */}
        <section>
          <SectionLabel name="ProfilePill" />
          <div className="flex items-center gap-4">
            <ProfilePill name="clawdbot" emoji="🦞" />
            <ProfilePill name="agent-2" emoji="🤖" />
          </div>
        </section>
      </div>
    </div>
  );
}
