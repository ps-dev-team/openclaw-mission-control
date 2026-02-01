import { getAgents } from '@/lib/cookies';
import { HomeClient } from '@/components/home-client';

export default async function Home() {
  const agents = await getAgents();
  return <HomeClient agents={agents} />;
}
