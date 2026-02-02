import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Maximize2, Pencil, Settings, Trash2 } from 'lucide-react';
import { IconButton } from './icon-button';

const meta = {
  title: 'UI/IconButton',
  component: IconButton,
  tags: ['autodocs'],
  argTypes: {
    onClick: { action: 'clicked' },
  },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SettingsButton: Story = {
  args: {
    icon: Settings,
    ariaLabel: 'Settings',
  },
};

export const Expand: Story = {
  args: {
    icon: Maximize2,
    ariaLabel: 'Expand',
  },
};

export const Edit: Story = {
  args: {
    icon: Pencil,
    ariaLabel: 'Edit',
  },
};

export const AllVariants: Story = {
  args: {
    icon: Settings,
    ariaLabel: 'Settings',
  },
  render: () => (
    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
      <IconButton icon={Settings} ariaLabel="Settings" />
      <IconButton icon={Maximize2} ariaLabel="Expand" />
      <IconButton icon={Pencil} ariaLabel="Edit" />
      <IconButton icon={Trash2} ariaLabel="Delete" />
    </div>
  ),
};
