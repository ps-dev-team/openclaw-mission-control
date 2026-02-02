import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Activity, Maximize2, Settings } from 'lucide-react';
import { IconButton } from './icon-button';
import { CardHeader } from './card-header';

const meta = {
  title: 'UI/CardHeader',
  component: CardHeader,
  tags: ['autodocs'],
} satisfies Meta<typeof CardHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Simple: Story = {
  args: {
    icon: Activity,
    title: 'Activity Log',
  },
};

export const WithAction: Story = {
  args: {
    icon: Settings,
    title: 'Agent Status',
    action: <IconButton icon={Maximize2} ariaLabel="Expand" />,
  },
};
