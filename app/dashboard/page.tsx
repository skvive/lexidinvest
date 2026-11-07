import { redirect } from 'next/navigation';
import { getAdmin } from '@/lib/auth';
import { Workspace } from './workspace';
export const dynamic = 'force-dynamic';
export default async function Dashboard() {
  const admin = await getAdmin();
  if (!admin) redirect('/auth/sign-in');
  return <Workspace email={admin.email}/>;
}
