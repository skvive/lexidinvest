import { AuthView } from '@neondatabase/auth-ui';
import { authViewPaths } from '@neondatabase/auth-ui/server';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { GoogleOnlySignIn } from '../google-only-sign-in';

export const dynamicParams = false;
export function generateStaticParams() {
  return Object.values(authViewPaths).map(path => ({ path }));
}

export default async function AuthPage({ params }: { params: Promise<{ path: string }> }) {
  const { path } = await params;
  if (path !== 'sign-in' && path !== 'callback' && path !== 'sign-out') {
    redirect('/auth/sign-in');
  }

  return (
    <div className="auth-page">
      <Link href="/" className="brand auth-brand">L<span>✦</span> LEXID INVEST</Link>
      {path === 'sign-in' ? (
        <GoogleOnlySignIn />
      ) : (
        <div className="auth-card"><AuthView path={path} /></div>
      )}
      <p className="auth-note">투자유치 운영 데이터는 승인된 관리자 계정에서만 열람할 수 있습니다.</p>
    </div>
  );
}
