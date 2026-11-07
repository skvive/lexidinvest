import { neon } from '@neondatabase/serverless';
import { MODEL,validatePayload } from './model';
import type { Resource } from './constants';
function db(){if(!process.env.DATABASE_URL)throw Error('DATABASE_URL missing');return neon(process.env.DATABASE_URL);}
export async function listData(resource:Resource){ const {table,sort}=MODEL[resource];return await db().query(`SELECT * FROM ${table} ORDER BY ${sort} LIMIT 500`,[]); }
export async function createData(resource:Resource,input:unknown,email:string){
 const data=validatePayload(resource,input,true),keys=Object.keys(data),table=MODEL[resource].table;
 if(resource==='applications' && ['submitted','won'].includes(String(data.status)))throw Error('제출 또는 투자확정 증빙 검증을 위해 계획 상태로 생성한 뒤 전환하세요');
 const binds=keys.map((_,i)=>`$${i+1}`);
 const rows=await db().query(`INSERT INTO ${table} (${keys.join(',')}) VALUES(${binds.join(',')}) RETURNING *`,keys.map(k=>data[k]));
 await audit(resource,rows[0].id,'create',email,{keys});return rows[0];
}
export async function updateData(resource:Resource,id:string,input:unknown,email:string){
 if(!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id))throw Error('Invalid record ID');
 const data=validatePayload(resource,input,false),keys=Object.keys(data),table=MODEL[resource].table;
 if(resource==='projects' && data.public_enabled===true){
   let summary=data.public_summary;
   if(!summary){const previous=await db().query('SELECT public_summary FROM ir_projects WHERE id=$1',[id]);summary=previous[0]?.public_summary;}
   if(typeof summary!=='string' || summary.trim().length<40)throw Error('공개 전 40자 이상의 승인된 공개 소개문이 필요합니다');
 }
 if(resource==='applications' && ['submitted','won'].includes(String(data.status))){
   let evidence=data.evidence_url;
   if(!evidence){const old=await db().query('SELECT evidence_url FROM ir_applications WHERE id=$1',[id]);evidence=old[0]?.evidence_url;}
   if(!evidence || !/^https:\/\//i.test(String(evidence))) throw Error('제출 완료 및 투자 확정 상태에는 실제 증빙 HTTPS URL이 필요합니다');
 }
 const pairs=keys.map((k,i)=>`${k}=$${i+1}`);
 if(resource==='applications' && data.status==='submitted')pairs.push('submitted_at=COALESCE(submitted_at,now())');
 const rows=await db().query(`UPDATE ${table} SET ${pairs.join(',')},updated_at=now() WHERE id=$${keys.length+1} RETURNING *`,[...keys.map(k=>data[k]),id]);
 if(!rows.length)throw Error('대상 항목을 찾을 수 없습니다');
 await audit(resource,id,'update',email,{keys});return rows[0];
}
export async function audit(resource:string,id:string,operation:string,email:string,details:unknown){
 try{await db().query('INSERT INTO ir_audit(resource,resource_id,operation,actor_email,details) VALUES($1,$2,$3,$4,$5::jsonb)',[resource,id,operation,email,JSON.stringify(details)]);}catch(error){console.error('AUDIT_WRITE_ERROR',error);}
}
