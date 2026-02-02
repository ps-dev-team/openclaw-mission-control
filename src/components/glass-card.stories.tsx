import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Activity, Settings } from 'lucide-react';
import { withDashboardBackground } from '../../.storybook/decorators/DashboardBackground';
import { CardHeader } from './ui/card-header';
import { IconButton } from './ui/icon-button';
import { GlassCard } from './glass-card';

const meta = {
  title: 'Components/GlassCard',
  component: GlassCard,
  tags: ['autodocs'],
  decorators: [withDashboardBackground],
} satisfies Meta<typeof GlassCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: {
    children: (
      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px' }}>
        A basic glass card with text content.
      </p>
    ),
  },
};

export const WithCardHeader: Story = {
  args: {
    children: (
      <>
        <CardHeader icon={Activity} title="Activity Log" />
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', opacity: 0.7 }}>
          Card content goes here.
        </p>
      </>
    ),
  },
};

export const WithContent: Story = {
  args: {
    children: (
      <>
        <CardHeader
          icon={Activity}
          title="Agent Status"
          action={<IconButton icon={Settings} ariaLabel="Settings" />}
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px',
            }}
          >
            <span style={{ opacity: 0.6 }}>Model</span>
            <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>claude-sonnet-4-20250514</span>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px',
            }}
          >
            <span style={{ opacity: 0.6 }}>Uptime</span>
            <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>3d 14h 22m</span>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px',
            }}
          >
            <span style={{ opacity: 0.6 }}>Sessions</span>
            <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>142</span>
          </div>
        </div>
      </>
    ),
  },
};
