import { isResource, type Resource } from './constants';
export type GenericRow = Record<string, unknown>;
/** Error suitable for returning to an authenticated client without exposing database details. */
export class InputError extends Error { constructor(message:string){ super(message); this.name='InputError'; } }
export const MODEL: Record<Resource, {table:string;editable:string[];creatable:string[];sort:string}> = {
  projects:{table:'ir_projects',editable:['name','sector','stage','priority','summary','public_summary','repo_url','deck_url','website_url','validation_note','public_enabled'],creatable:['slug','name','sector','stage','priority','summary','repo_url','deck_url','website_url','validation_note'],sort:'priority ASC, name ASC'},
  investors:{table:'ir_investors',editable:['name','firm','sector','stage','website_url','email','contact_channel','status','notes'],creatable:['name','firm','sector','stage','website_url','email','contact_channel','status','notes'],sort:'created_at DESC'},
  programs:{table:'ir_programs',editable:['name','organization','category','website_url','deadline','deadline_verified_at','eligibility','description','status'],creatable:['name','organization','category','website_url','deadline','eligibility','description'],sort:'deadline ASC NULLS LAST'},
  applications:{table:'ir_applications',editable:['project_id','investor_id','program_id','target_name','target_url','status','contact_date','follow_up_date','owner_note','evidence_url'],creatable:['project_id','investor_id','program_id','target_name','target_url','status','contact_date','follow_up_date','owner_note','evidence_url'],sort:'created_at DESC'},
  documents:{table:'ir_documents',editable:['title','kind','source_type','source_url','verified','confidential','version_label'],creatable:['project_id','title','kind','source_type','source_url','verified','confidential','version_label'],sort:'created_at DESC'},
  issues:{table:'ir_issues',editable:['title','description','severity','status','evidence_url'],creatable:['project_id','title','description','severity','status','evidence_url'],sort:'severity ASC, created_at DESC'}
};
export function validResource(value:unknown):Resource | null { return isResource(value)?value:null; }
const validPriority = (x:unknown)=>['P0','P1','P2','P3'].includes(String(x));
const validStatus:Record<string,string[]>={
  investors:['new','qualified','contacted','replied','meeting','inactive'],
  applications:['planned','researching','draft','needs_review','submitted','follow_up','meeting','rejected','won','withdrawn'],
  issues:['open','in_review','resolved']
};
export function validatePayload(resource:Resource,data:unknown,creating:boolean):Record<string,unknown>{
 if(!data||typeof data!=='object'||Array.isArray(data)) throw new InputError('JSON 객체가 필요합니다');
 const schema=MODEL[resource];const allowed=creating?schema.creatable:schema.editable;
 const result:Record<string,unknown>={};
 for(const [key,value] of Object.entries(data as Record<string,unknown>)){
   if(!allowed.includes(key))throw new InputError(`수정할 수 없는 필드: ${key}`);
   if(value!==null && typeof value!=='string' && typeof value!=='boolean')throw new InputError(`필드 형식 오류: ${key}`);
   if(typeof value==='string' && value.length>6000)throw new InputError(`필드 길이 초과: ${key}`);
   if(['website_url','repo_url','deck_url','source_url','target_url','evidence_url'].includes(key) && value!==null && value!=='') {
     try{const u=new URL(String(value));if(!['https:','http:'].includes(u.protocol))throw Error('protocol');}
     catch{throw new InputError(`유효하지 않은 웹 URL: ${key}`);}
   }
   if(key==='slug' && !/^[a-z][a-z0-9-]{1,60}$/.test(String(value)))throw new InputError('slug는 영문 소문자 및 하이픈이어야 합니다');
   if(['priority','severity'].includes(key)&&!validPriority(value))throw new InputError(`${key} 등급 오류`);
   if(key==='status' && validStatus[resource] && !validStatus[resource].includes(String(value)))throw new InputError('상태 코드 오류');
   if(['public_enabled','verified','confidential'].includes(key)&&typeof value!=='boolean')throw new InputError(`${key}는 불리언이어야 합니다`);
   if(['project_id','investor_id','program_id'].includes(key)&&value!==null && !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(value)))throw new InputError(`ID 형식 오류: ${key}`);
   if(['deadline','deadline_verified_at','contact_date','follow_up_date'].includes(key) && value!==null && value!=='' && !/^\d{4}-\d{2}-\d{2}$/.test(String(value)))throw new InputError(`날짜 형식 오류: ${key}`);
   if(['deadline','deadline_verified_at','contact_date','follow_up_date'].includes(key) && typeof value==='string' && value!=='') {
     const parsed=new Date(value+'T00:00:00.000Z');
     if(Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0,10)!==value) throw new InputError(`실제 존재하지 않는 날짜: ${key}`);
   }
   let cleaned=value;
   if(typeof cleaned==='string' && ['name','firm','sector','title','email','website_url','repo_url','deck_url','source_url','target_url','evidence_url'].includes(key)) cleaned=cleaned.trim();
   if(key==='email' && typeof cleaned==='string' && cleaned) {
     if(cleaned.length>254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleaned)) throw new InputError('유효하지 않은 이메일 형식');
     cleaned=cleaned.toLowerCase();
   }
   const nonBlank:Partial<Record<Resource,string[]>>={
     projects:['name','sector'], investors:['name'], programs:['name','website_url'],
     documents:['title','source_url'], issues:['title']
   };
   if(nonBlank[resource]?.includes(key) && typeof cleaned==='string' && !cleaned) throw new InputError(`필수값 누락: ${key}`);
   result[key] = cleaned === '' && ['deadline','deadline_verified_at','contact_date','follow_up_date','investor_id','program_id'].includes(key)?null:cleaned;
 }
 if(creating) {
   const required:Record<string,string[]>={projects:['name','slug','sector'],investors:['name'],programs:['name','website_url'],applications:['project_id'],documents:['project_id','title','source_url'],issues:['project_id','title']};
   for(const key of required[resource]) if(!result[key])throw new InputError(`필수값 누락: ${key}`);
   if(resource==='applications' && !result.investor_id && !result.program_id && !result.target_name)throw new InputError('투자자, 프로그램 또는 대상명을 지정하세요');
 }
 if(!Object.keys(result).length)throw new InputError('변경할 내용이 없습니다');
 return result;
}
export function escapeCSV(value:unknown):string {
  let text=value===null||value===undefined?'':String(value);
  if(/^[\s]*[=+\-@\t\r]/.test(text))text="'"+text;
  return '"'+text.replace(/"/g,'""')+'"';
}
