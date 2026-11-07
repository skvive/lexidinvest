import { NextResponse, type NextRequest } from 'next/server';
import { getAdmin } from './auth';
import { InputError } from './model';
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
export function fail(err:unknown) {
  if(err instanceof InputError) {
    return NextResponse.json({error:err.message},{status:400,headers:{'cache-control':'no-store'}});
  }
  const code=err && typeof err==='object' && 'code' in err ? String((err as {code?:unknown}).code) : '';
  // PostgreSQL codes are mapped to safe user feedback; never echo raw SQL errors.
  if(code==='23505') return NextResponse.json({error:'이미 등록된 이메일 또는 중복된 자료입니다.'},{status:409,headers:{'cache-control':'no-store'}});
  if(code==='23503') return NextResponse.json({error:'연결된 프로젝트 또는 투자자 자료가 존재하지 않습니다.'},{status:422,headers:{'cache-control':'no-store'}});
  if(['23502','23514','22007','22P02'].includes(code)) return NextResponse.json({error:'입력값 또는 연결된 자료를 확인해 주세요.'},{status:400,headers:{'cache-control':'no-store'}});
  console.error('API_ERROR',code|| (err instanceof Error ? err.name : 'unknown'));
  return NextResponse.json({error:'서버 요청을 처리하지 못했습니다'},{status:500,headers:{'cache-control':'no-store'}});
}
