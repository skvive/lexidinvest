import { NextRequest,NextResponse } from 'next/server';
import { authorized,checkOrigin,fail } from '@/lib/requests';
import { validResource } from '@/lib/model';
import { updateData } from '@/lib/server-data';
export async function PATCH(req:NextRequest,{params}:{params:Promise<{id:string}>}){
 const result=await authorized();if(result.error)return result.error;
 if(!await checkOrigin(req))return NextResponse.json({error:'origin 허용되지 않음'},{status:403});
 try{const {id}=await params,body=await req.json(),resource=validResource(body.resource);if(!resource)return NextResponse.json({error:'resource 오류'},{status:400});
 const item=await updateData(resource,id,body.data,result.admin!.email);return NextResponse.json({item});
 }catch(err){return fail(err);}
}
