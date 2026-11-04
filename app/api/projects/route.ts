import { getDb } from '../../../db';
import { projects } from '../../../db/schema';
import { desc } from 'drizzle-orm';
export async function GET() {
 try { return Response.json({ projects: await getDb().select().from(projects).orderBy(desc(projects.createdAt)).limit(200) }); }
 catch { return Response.json({error:'The showcase is temporarily unavailable. Please try again.'}, {status:503}); }
}
export async function POST(request: Request) {
 try {
  const body = await request.json() as Record<string, string>;
  const fields = ['title','author','description','category','url'];
  if(fields.some(k => typeof body[k] !== 'string' || !body[k].trim())) return Response.json({error:'Please complete every field.'},{status:400});
  if(body.title.length>80 || body.author.length>60 || body.description.length>500 || body.url.length>2048 || !['Website','Game','Tool'].includes(body.category)) return Response.json({error:'Check the field lengths and project category.'},{status:400});
  let url; try { url=new URL(body.url); } catch { return Response.json({error:'Enter a valid project URL.'},{status:400}); }
  if(!['https:','http:'].includes(url.protocol) || url.username || url.password) return Response.json({error:'Use a public http or https link.'},{status:400});
  const project={id:crypto.randomUUID(),title:body.title.trim(),author:body.author.trim(),description:body.description.trim(),category:body.category,url:url.href,createdAt:Date.now()};
  await getDb().insert(projects).values(project);
  return Response.json({project},{status:201});
 } catch { return Response.json({error:'Your project could not be saved. Please try again.'},{status:503}); }
}

