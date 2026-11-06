import { eq, sql } from "drizzle-orm";
import { getDb } from "../../../../db";
import { applause, projects } from "../../../../db/schema";
import { visitorFor } from "../../../../lib/visitor";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[a-f0-9-]{36}$/.test(id)) return Response.json({ error: "Invalid project." }, { status: 400 });
  const visitor = visitorFor(request);
  try {
    const db = getDb();
    const [project] = await db.select().from(projects).where(eq(projects.id, id)).limit(1);
    if (!project) return Response.json({ error: "Project not found." }, { status: 404, headers: visitor.headers });
    const [totals, own] = await Promise.all([
      db.select({ kind: applause.kind, count: sql<number>`count(*)` }).from(applause).where(eq(applause.projectId, id)).groupBy(applause.kind),
      db.select({ kind: applause.kind }).from(applause).where(eq(applause.visitor, visitor.id)),
    ]);
    return Response.json({ project: { ...project, counts: Object.fromEntries(totals.map(item => [item.kind, item.count])), mine: own.map(item => item.kind) } }, { headers: visitor.headers });
  } catch { return Response.json({ error: "Could not load this project." }, { status: 503 }); }
}
