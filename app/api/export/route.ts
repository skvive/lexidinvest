import { NextRequest,NextResponse } from 'next/server';
import { authorized,fail } from '@/lib/requests';
import { validResource,escapeCSV } from '@/lib/model';
import { listData } from '@/lib/server-data';
export async function GET(req:NextRequest){
 const result=await authorized();if(result.error)return result.error;
 const resource=validResource(req.nextUrl.searchParams.get('resource'));
 if(!resource)return NextResponse.json({error:'지원하지 않는 자료'},{status:400});
 try{const rows=await listData(resource);const keys=rows.length?Object.keys(rows[0]):['id'];
 const csv='\uFEFF'+[keys.map(escapeCSV).join(','),...rows.map(r=>keys.map(k=>escapeCSV(r[k])).join(','))].join('\r\n');
 return new NextResponse(csv,{headers:{'content-type':'text/csv; charset=utf-8','content-disposition':`attachment; filename="lexid-${resource}.csv"`,'cache-control':'no-store'}});
 }catch(e){return fail(e);}
}
