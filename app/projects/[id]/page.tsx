import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { eq, sql } from "drizzle-orm";
import { getDb } from "../../../db";
import { applause, projects } from "../../../db/schema";
import ProjectMascot from "../../project-mascot";
import ProjectDiscussion from "../../project-discussion";
import ProjectActions from "./project-actions";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ id: string }> };
const validId = (id: string) => /^[a-f0-9-]{36}$/.test(id);

async function loadProject(id: string) {
  if (!validId(id)) return null;
  const db = getDb();
  const [project] = await db.select().from(projects).where(eq(projects.id, id)).limit(1);
  if (!project) return null;
  const counts = await db.select({ kind: applause.kind, count: sql<number>`count(*)` })
    .from(applause).where(eq(applause.projectId, id)).groupBy(applause.kind);
  return { ...project, counts: Object.fromEntries(counts.map(item => [item.kind, item.count])) };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const project = await loadProject(id);
    if (!project) return { title: "Project not found | Midnight Build Club" };
    return {
      title: `${project.title} | Midnight Build Club`,
      description: project.description,
      openGraph: { title: project.title, description: project.description, images: project.screenshot ? [project.screenshot] : [] },
    };
  } catch { return { title: "Midnight Build Club" }; }
}

export default async function ProjectPage({ params }: Props) {
  const { id } = await params;
  const project = await loadProject(id).catch(() => null);
  if (!project) notFound();
  const tech = project.technologies.split(",").map(item => item.trim()).filter(Boolean);
  return <main className="project-page">
    <div className="project-page-glow" aria-hidden="true" />
    <header className="project-page-nav"><a href="/" className="project-page-brand">✦ MIDNIGHT BUILD CLUB</a><a href="/?view=Showcase" className="button outline">← All projects</a></header>
    <div className="project-page-layout">
      <div>
        <div className="project-page-cover">{project.screenshot
          ? <img src={project.screenshot} alt={`${project.title} screenshot`} />
          : <div className={`mascot-house mascot-${project.mascot}`}><ProjectMascot kind={project.mascot} /><span>{project.title}</span></div>}</div>
        <div className="project-page-story">
          <span className="section-label">THE PROJECT</span>
          <h2>What you’re stepping into</h2>
          <p>{project.description}</p>
          {project.story && <><h2>Behind the build</h2><p>{project.story}</p></>}
          {tech.length > 0 && <><h2>Made with</h2><div className="project-tech">{tech.map(item => <span key={item}>{item}</span>)}</div></>}
        </div>
      </div>
      <aside className="project-page-side">
        <span className="section-label">{project.category.toUpperCase()} / STUDENT CREATION</span>
        <h1>{project.title}</h1>
        <p className="project-page-byline">Built by <strong>{project.author}</strong>{project.members && <span> with {project.members}</span>}</p>
        <p className="project-page-date">Joined the village {new Date(project.createdAt).toLocaleDateString("en", { day: "numeric", month: "long", year: "numeric" })}</p>
        <a className="button primary full" href={project.url} target="_blank" rel="noopener noreferrer">Explore live project ↗</a>
        {project.sourceUrl && <a className="button outline full" href={project.sourceUrl} target="_blank" rel="noopener noreferrer">View source code ↗</a>}
        <ProjectActions id={project.id} votes={project.counts.vote || 0} />
        <ProjectDiscussion projectId={project.id} team={project.author} />
      </aside>
    </div>
  </main>;
}
