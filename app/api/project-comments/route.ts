import { desc, eq } from 'drizzle-orm';
import { getDb } from '../../../db';
import { projectComments, projects } from '../../../db/schema';

const validId = (value: unknown): value is string =>
  typeof value === 'string' && /^[a-f0-9-]{36}$/.test(value);

export async function GET(request: Request) {
  const projectId = new URL(request.url).searchParams.get('projectId');
  if (!validId(projectId)) return Response.json({ error: 'Invalid project.' }, { status: 400 });
  try {
    const comments = await getDb().select().from(projectComments)
      .where(eq(projectComments.projectId, projectId))
      .orderBy(desc(projectComments.createdAt), desc(projectComments.id)).limit(100);
    return Response.json({ comments: comments.reverse() }, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return Response.json({ error: 'Could not load the discussion.' }, { status: 503 });
  }
}

export async function POST(request: Request) {
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) {
    return Response.json({ error: 'Post from the showcase.' }, { status: 403 });
  }
  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  if (!body || !validId(body.projectId) || typeof body.author !== 'string' || typeof body.message !== 'string'
    || (body.kind !== 'comment' && body.kind !== 'connect')) {
    return Response.json({ error: 'Enter a name and message.' }, { status: 400 });
  }
  const author = body.author.trim();
  const message = body.message.trim();
  if (!author || author.length > 60 || !message || message.length > 600) {
    return Response.json({ error: 'Use a name of up to 60 characters and a message of up to 600.' }, { status: 400 });
  }
  try {
    const db = getDb();
    const [project] = await db.select({ id: projects.id }).from(projects).where(eq(projects.id, body.projectId)).limit(1);
    if (!project) return Response.json({ error: 'Project not found.' }, { status: 404 });
    const comment = { id: crypto.randomUUID(), projectId: body.projectId, author, message, kind: body.kind, createdAt: Date.now() } as const;
    await db.insert(projectComments).values(comment);
    return Response.json({ comment }, { status: 201 });
  } catch {
    return Response.json({ error: 'Could not post your message. Please try again.' }, { status: 503 });
  }
}
