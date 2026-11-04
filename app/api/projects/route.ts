import { getDb } from '../../../db';
import { projects, applause } from '../../../db/schema';
import { desc, sql, eq } from 'drizzle-orm';
import { env } from 'cloudflare:workers';
import { visitorFor } from '../../../lib/visitor';
export async function GET(request:Request) {
 const who=visitorFor(request);
 try {
  const db=getDb();
  const rows=await db.select().from(projects).orderBy(desc(projects.createdAt)).limit(200);
  const totals=await db.select({projectId:applause.projectId,kind:applause.kind,count:sql<number>`count(*)`}).from(applause).groupBy(applause.projectId,applause.kind);
  const own=await db.select().from(applause).where(eq(applause.visitor,who.id));
  return Response.json({projects:rows.map(p=>({...p,counts:Object.fromEntries(totals.filter(t=>t.projectId===p.id).map(t=>[t.kind,t.count])),mine:own.filter(t=>t.projectId===p.id).map(t=>t.kind)}))},{headers:who.headers});
 }catch{return Response.json({error:'The showcase is temporarily unavailable. Please try again.'},{status:503})}
}
export async function POST(request:Request) {
 let storedKey='';
 try {
  if(request.headers.get('origin')&&request.headers.get('origin')!==new URL(request.url).origin)return Response.json({error:'Submit from this site.'},{status:403});
  const form=request.headers.get('content-type')?.includes('multipart/form-data')?await request.formData():null;
  const body=(form?Object.fromEntries(form):await request.json()) as Record<string,unknown>;
  const fields=['title','author','description','category','url'];
  if(!body||fields.some(k=>typeof body[k]!=='string'||!(body[k] as string).trim()))return Response.json({error:'Please complete every required field.'},{status:400});
  const b=body as Record<string,string>;
  if(b.title.length>80||b.author.length>60||b.description.length>500||b.url.length>2048||(b.members||'').length>240||!['Website','Game','Tool'].includes(b.category)||!['ghost','pumpkin','bat','robot'].includes(b.mascot||'ghost'))return Response.json({error:'Check the field lengths and project type.'},{status:400});
  let url;try{url=new URL(b.url)}catch{return Response.json({error:'Enter a valid project URL.'},{status:400})}
  if(!['https:','http:'].includes(url.protocol)||url.username||url.password)return Response.json({error:'Use a public http or https link.'},{status:400});
  const id=crypto.randomUUID();let screenshot='';const file=form?.get('screenshot');
  if(file instanceof File&&file.size){
   if(file.size>3*1024*1024)return Response.json({error:'Use a screenshot smaller than 3 MB.'},{status:400});
   const bytes=new Uint8Array(await file.arrayBuffer());
   const png=bytes[0]===137&&bytes[1]===80&&bytes[2]===78&&bytes[3]===71;
   const jpeg=bytes[0]===255&&bytes[1]===216&&bytes[2]===255;
   const webp=new TextDecoder().decode(bytes.slice(0,4))==='RIFF'&&new TextDecoder().decode(bytes.slice(8,12))==='WEBP';
   if(!png&&!jpeg&&!webp)return Response.json({error:'Upload a PNG, JPEG, or WebP screenshot.'},{status:400});
   if(!env.BUCKET)throw new Error();storedKey='screenshots/'+id;
   await env.BUCKET.put(storedKey,bytes,{httpMetadata:{contentType:png?'image/png':jpeg?'image/jpeg':'image/webp'}});screenshot='/api/media/'+id;
  }
  const project={id,title:b.title.trim(),author:b.author.trim(),description:b.description.trim(),category:b.category,url:url.href,createdAt:Date.now(),members:(b.members||'').trim(),mascot:b.mascot||'ghost',screenshot};
  await getDb().insert(projects).values(project);
  return Response.json({project},{status:201});
 }catch{if(storedKey)await env.BUCKET?.delete(storedKey).catch(()=>{});return Response.json({error:'Your project could not be saved. Please try again.'},{status:503})}
}
