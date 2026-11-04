import {env} from 'cloudflare:workers';
import {visitorFor} from '../../../lib/visitor';
export async function POST(request:Request){
 const who=visitorFor(request);
 try{
  if(request.headers.get('origin') && request.headers.get('origin')!==new URL(request.url).origin)return Response.json({error:'Use the project controls on this site.'},{status:403});
  const b=await request.json() as {projectId?:unknown;kind?:unknown;active?:unknown};
  if(!b||typeof b.projectId!=='string'||!['vote','weird','haunted','again'].includes(String(b.kind))||typeof b.active!=='boolean')return Response.json({error:'Invalid reaction.'},{status:400});
  if(!env.DB)throw new Error();
  const project=await env.DB.prepare('SELECT id FROM projects WHERE id = ?').bind(b.projectId).first();
  if(!project)return Response.json({error:'Project not found.'},{status:404});
  if(b.active)await env.DB.prepare('INSERT INTO applause (project_id,visitor,kind) VALUES (?,?,?) ON CONFLICT DO NOTHING').bind(b.projectId,who.id,b.kind).run();
  else await env.DB.prepare('DELETE FROM applause WHERE project_id=? AND visitor=? AND kind=?').bind(b.projectId,who.id,b.kind).run();
  return Response.json({ok:true},{headers:who.headers});
 }catch{return Response.json({error:'Could not save your reaction. Please try again.'},{status:503})}
}
