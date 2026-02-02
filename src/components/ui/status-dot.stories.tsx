import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { StatusDot } from './status-dot';

const meta = {
  title: 'UI/StatusDot',
  component: StatusDot,
  tags: ['autodocs'],
  argTypes: {
    isOnline: { control: 'boolean' },
  },
} satisfies Meta<typeof StatusDot>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Online: Story = {
  args: {
    isOnline: true,
  },
};

export const Offline: Story = {
  args: {
    isOnline: false,
  },
};
