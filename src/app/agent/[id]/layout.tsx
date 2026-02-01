import { getAgents } from '@/lib/cookies';
import { Sidebar } from '@/components/sidebar';
import { redirect } from 'next/navigation';

export default async function AgentLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const agents = await getAgents();
  const agent = agents.find((a) => a.id === id);

  if (!agent) {
    redirect('/');
  }

  return (
    <div className="flex min-h-screen bg-bg-primary">
      <Sidebar agents={agents} activeAgentId={id} />
      <main className="flex-1 overflow-y-auto">
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
