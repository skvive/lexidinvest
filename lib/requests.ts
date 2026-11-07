import { NextResponse, type NextRequest } from 'next/server';
import { getAdmin } from './auth';
export async function authorized(){const admin=await getAdmin();if(!admin)return {error:NextResponse.json({error:'승인된 관리자 계정으로 로그인하세요'},{status:401})};return {admin};}
export async function checkOrigin(req:NextRequest){
  // Never treat a missing Origin as an authorization bypass for cookie-backed API writes.
  const origin=req.headers.get('origin');
  const contentType=req.headers.get('content-type')||'';
  const fetchSite=req.headers.get('sec-fetch-site');
  if(!origin || !/^application\/json(?:;|$)/i.test(contentType))return false;
  if(fetchSite && fetchSite!=='same-origin' && fetchSite!=='none')return false;
  const host=req.headers.get('x-forwarded-host')||req.headers.get('host');
  if(!host)return false;
  try{
    const source=new URL(origin);
    if(source.origin!==origin || source.host!==host)return false;
    return source.protocol==='https:' || (process.env.NODE_ENV!=='production' && ['localhost','127.0.0.1'].includes(source.hostname));
  }catch{return false;}
}
export function fail(err:unknown){console.error('API_ERROR', err instanceof Error ? err.name : 'unknown');const msg=err instanceof Error?err.message:'처리 중 오류';const safe=/누락|유효|형식|필수|찾을|오류|missing|Invalid|수정할|길이|변경할|객체/.test(msg);return NextResponse.json({error:safe?msg:'서버 요청을 처리하지 못했습니다'},{status:safe?400:500,headers:{'cache-control':'no-store'}})}
