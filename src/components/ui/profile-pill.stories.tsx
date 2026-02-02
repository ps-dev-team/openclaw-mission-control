import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ProfilePill } from './profile-pill';

const meta = {
  title: 'UI/ProfilePill',
  component: ProfilePill,
  tags: ['autodocs'],
  argTypes: {
    onClick: { action: 'clicked' },
  },
} satisfies Meta<typeof ProfilePill>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    emoji: '🤖',
    name: 'Clawdbot',
  },
};

export const WithAvatar: Story = {
  args: {
    emoji: '🐱',
    name: 'Felix',
    avatarUrl: 'https://api.dicebear.com/9.x/bottts/svg?seed=Felix',
  },
};
