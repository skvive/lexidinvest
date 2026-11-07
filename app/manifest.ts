import type { MetadataRoute } from 'next';
export default function manifest(): MetadataRoute.Manifest {
 return {
  name: 'LEXID INVEST — Fundraising OS',
  short_name: 'LEXID INVEST',
  description: '프로젝트 IR, 투자자 관계, 지원 일정의 보안형 웹앱',
  start_url: '/', scope:'/', display:'standalone',
  background_color:'#142025', theme_color:'#142025',
  icons:[
   {src:'/icons/icon-192.png',sizes:'192x192',type:'image/png',purpose:'any'},
   {src:'/icons/icon-512.png',sizes:'512x512',type:'image/png',purpose:'any'},
  ],
  categories:['business','finance','productivity'],
 };
}
