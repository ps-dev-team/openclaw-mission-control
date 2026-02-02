import { Sidebar } from '@/components/sidebar';

const MOCK_AGENTS = [
  {
    id: 'demo-berto',
    name: 'Berto',
    gatewayUrl: 'https://agent.openclaw.dev',
    gatewayToken: '',
    emoji: '🦞',
    addedAt: '2026-01-28T00:00:00Z',
  },
  {
    id: 'demo-scout',
    name: 'Scout',
    gatewayUrl: 'https://scout.openclaw.dev',
    gatewayToken: '',
    emoji: '🔭',
    addedAt: '2026-01-30T00:00:00Z',
  },
];

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar agents={MOCK_AGENTS} activeAgentId="demo-berto" />
      <main className="flex-1 overflow-y-auto">
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
