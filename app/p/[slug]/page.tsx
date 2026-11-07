import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { brandImage } from '@/lib/branding';
import { sql } from '@/lib/db';
import { ArrowUpRight, ShieldCheck } from 'lucide-react';
export const dynamic = 'force-dynamic';
export default async function PublicProject({params}:{params:Promise<{slug:string}>}) {
 const {slug}=await params;
 const rows=await sql()`SELECT name,sector,summary,public_summary,website_url FROM ir_projects WHERE slug=${slug} AND public_enabled=true LIMIT 1`;
 const p=rows[0]; if(!p)notFound();
 return <main className="public-project"><div className="container"><header className="landing-nav"><Link href="/" className="brand">L<span>✦</span> LEXID INVEST</Link><Link href="/" className="text-link">Back to Lexid <ArrowUpRight size={15}/></Link></header><div className="public-sheet"><div className="public-brand-image"><Image src={brandImage(slug)} width={1200} height={680} alt={`${p.name} 프로젝트 브랜드 콘셉트`} priority/></div><div className="eyebrow">INVESTOR INTRODUCTION / PUBLIC INFORMATION ONLY</div><span className="pill">{p.sector}</span><h1>{p.name}</h1><p>{p.public_summary}</p><div className="public-notice"><ShieldCheck size={20}/><span>실적·투자조건·지분 및 비공개 문서는 승인된 별도 자료실에서만 제공됩니다.</span></div>{p.website_url && <a className="btn btn-accent" href={p.website_url} target="_blank" rel="noopener noreferrer">제품 웹사이트 <ArrowUpRight size={16}/></a>}</div></div></main>;
}
