'use client';
import { useState } from 'react';
import { authClient } from '@/lib/auth-client';

export function GoogleOnlySignIn() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');

  async function signInWithGoogle() {
    if (pending) return;
    setPending(true);
    setError('');
    try {
      const response = await authClient.signIn.social({
        provider: 'google',
        callbackURL: '/dashboard',
      });
      if (response?.error) setError('Google 로그인에 연결하지 못했습니다. 계정을 확인하고 다시 시도해 주세요.');
    } catch {
      setError('로그인 과정에서 문제가 발생했습니다. 다시 시도해 주세요.');
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="auth-card auth-google-only">
      <p className="oauth-kicker">VERIFIED ADMIN ACCESS</p>
      <h1 className="oauth-title">관리자 계정 로그인</h1>
      <p className="oauth-copy">
        투자자·IR 자료는 인증된 Google 계정과 관리자 권한이 모두 확인된 경우에만 열립니다.
      </p>
      <button className="oauth-google-button" type="button" disabled={pending} onClick={signInWithGoogle}>
        <span className="oauth-google-mark" aria-hidden="true">G</span>
        {pending ? 'Google 인증 연결 중…' : 'Google 계정으로 계속하기'}
      </button>
      {error ? <p className="oauth-error" role="alert">{error}</p> : null}
      <p className="oauth-hint">승인된 관리자 이메일만 운영 워크스페이스에 접근할 수 있습니다.</p>
    </div>
  );
}
