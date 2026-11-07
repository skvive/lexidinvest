import type { Metadata } from 'next';
import { Providers } from './providers';
import '@neondatabase/auth-ui/css';
import './globals.css';
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://ir.lexid.site"),
  title: {default:'Lexid Invest — Global Fundraising OS',template:'%s · Lexid Invest'},
  description:'글로벌 스타트업 투자유치를 위한 프로젝트 포트폴리오, 투자자 파이프라인, 제안서 및 지원 일정 관리',
  robots: { index:false, follow:false },
  manifest:'/manifest.webmanifest',
  icons:[{url:'/icons/icon-192.png',sizes:'192x192',type:'image/png'},{url:'/icons/icon-512.png',sizes:'512x512',type:'image/png'}],
  openGraph:{title:'LEXID INVEST',description:'Fundraising Intelligence & Investor Relations Operating System',type:'website',images:['/opengraph-image']},
  twitter:{card:'summary_large_image',images:['/opengraph-image']},
};
export default function RootLayout({children}:{children:React.ReactNode}) { return <html lang="ko"><body><Providers>{children}</Providers></body></html>; }
