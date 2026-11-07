import { NextRequest,NextResponse } from 'next/server';
import { authorized,checkOrigin,fail } from '@/lib/requests';
import { validResource } from '@/lib/model';
import { listData,createData } from '@/lib/server-data';
export const dynamic='force-dynamic';
export async function GET(req:NextRequest){
 const result=await authorized();if(result.error)return result.error;
 try{
   if(req.nextUrl.searchParams.has('all')){
      const resources=['projects','investors','programs','applications','documents','issues'] as const;
      const tables=await Promise.all(resources.map(listData));
      return NextResponse.json(Object.fromEntries(resources.map((k,i)=>[k,tables[i]])),{headers:{'cache-control':'no-store'}});
   }
   const r=validResource(req.nextUrl.searchParams.get('resource'));if(!r)return NextResponse.json({error:'resource 오류'},{status:400});
   return NextResponse.json({items:await listData(r)},{headers:{'cache-control':'no-store'}});
 }catch(err){return fail(err);}
}
export async function POST(req:NextRequest){
 const result=await authorized();if(result.error)return result.error;
 if(!await checkOrigin(req))return NextResponse.json({error:'origin 허용되지 않음'},{status:403});
 try{const body=await req.json(),resource=validResource(body.resource);if(!resource)return NextResponse.json({error:'resource 오류'},{status:400});
 const item=await createData(resource,body.data,result.admin!.email);return NextResponse.json({item},{status:201});
 }catch(err){return fail(err);}
}
