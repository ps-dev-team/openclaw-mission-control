import { getAgent } from '@/lib/cookies';
import { redirect } from 'next/navigation';
import { DashboardClient } from './dashboard-client';

export default async function AgentDashboard({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const agent = await getAgent(id);
  if (!agent) redirect('/');

  return (
    <DashboardClient
      agentId={agent.id}
      agentName={agent.name}
      agentEmoji={agent.emoji || '🤖'}
    />
  );
}
