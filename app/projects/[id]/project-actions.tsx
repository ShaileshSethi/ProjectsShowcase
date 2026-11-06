"use client";
import { useEffect, useState } from "react";

export default function ProjectActions({ id, votes }: { id: string; votes: number }) {
  const [count, setCount] = useState(votes);
  const [voted, setVoted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  useEffect(() => {
    fetch(`/api/projects/${id}`, { cache: "no-store" }).then(response => response.json())
      .then(data => { const project = (data as { project?: { mine: string[]; counts: Record<string, number> } }).project; if (project) { setVoted(project.mine.includes("vote")); setCount(project.counts.vote || 0); } })
      .catch(() => {});
  }, [id]);
  async function vote() {
    if (busy) return;
    setBusy(true); setMessage("");
    const next = !voted;
    try {
      const response = await fetch("/api/applause", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ projectId: id, kind: "vote", active: next }) });
      if (!response.ok) throw new Error();
      setVoted(next); setCount(value => value + (next ? 1 : -1));
    } catch { setMessage("Could not save your vote. Try again."); }
    finally { setBusy(false); }
  }
  async function share() {
    try { await navigator.clipboard.writeText(window.location.href); setMessage("Project link copied!"); }
    catch { setMessage("Copy this page’s address to share it."); }
  }
  return <div className="project-page-actions"><button type="button" className={`vote-button ${voted ? "voted" : ""}`} aria-pressed={voted} disabled={busy} onClick={vote}>{voted ? "✦ Voted · Undo" : "✦ Vote for this project"}<b>{count}</b></button><button type="button" className="button outline full" onClick={share}>Share this project ↗</button><p role="status">{message}</p></div>;
}
