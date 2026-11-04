import {env} from 'cloudflare:workers';
export async function GET(_request:Request,{params}:{params:Promise<{id:string}>}){
 const {id}=await params;
 if(!/^[a-f0-9-]{36}$/.test(id)||!env.BUCKET)return new Response('Not found',{status:404});
 const object=await env.BUCKET.get('screenshots/'+id);
 if(!object)return new Response('Not found',{status:404});
 return new Response(object.body,{headers:{'Content-Type':object.httpMetadata?.contentType||'image/png','Cache-Control':'public, max-age=31536000, immutable','X-Content-Type-Options':'nosniff'}});
}
