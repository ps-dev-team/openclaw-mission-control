import { getAgents } from '@/lib/cookies';
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

  // The DashboardLayout (client component) is now rendered per-page
  // so each page can pass isOnline and activePage properly.
  // This layout just validates the agent exists.
  return <>{children}</>;
}
