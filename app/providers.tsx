'use client';
import { NeonAuthUIProvider } from '@neondatabase/auth-ui';
import { createAuthClient } from '@neondatabase/auth/next';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
const authClient = createAuthClient();
export function Providers({children}:{children:ReactNode}) {
  const router = useRouter();
  return <NeonAuthUIProvider authClient={authClient} navigate={router.push} replace={router.replace}
    onSessionChange={()=>router.refresh()} emailOTP social={{providers:['google']}} redirectTo="/dashboard" Link={Link}>
    {children}
  </NeonAuthUIProvider>;
}
