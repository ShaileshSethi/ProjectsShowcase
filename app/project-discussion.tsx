"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";

type Message = { id: string; author: string; message: string; kind: "comment" | "connect" };
type Mode = Message["kind"];

export default function ProjectDiscussion({ projectId, team }: { projectId: string; team: string }) {
  const id = useId();
  const latestRead = useRef(0);
  const [mode, setMode] = useState<Mode | null>(null);
  const [comments, setComments] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [posting, setPosting] = useState(false);
  const [author, setAuthor] = useState("");
  const [message, setMessage] = useState("");
  const open = mode !== null;

  useEffect(() => {
    if (!open) return;
    const controller = new AbortController();
    const endpoint = "/api/project-comments?projectId=" + encodeURIComponent(projectId);
    setLoading(true);
    async function refresh() {
      const read = ++latestRead.current;
      try {
        const response = await fetch(endpoint, { signal: controller.signal });
        if (!response.ok) throw new Error();
        const data = await response.json() as { comments: Message[] };
        if (!controller.signal.aborted && read === latestRead.current) setComments(data.comments);
      } catch {
        if (!controller.signal.aborted) setError("Could not load the discussion. Retrying soon.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    void refresh();
    const interval = setInterval(refresh, 12000);
    return () => { controller.abort(); clearInterval(interval); };
  }, [open, projectId]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (posting || !mode) return;
    setPosting(true);
    setError("");
    try {
      const response = await fetch("/api/project-comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, author, message, kind: mode }),
      });
      const result = await response.json() as { comment: Message; error?: string };
      if (!response.ok) throw new Error(result.error);
      latestRead.current++;
      setComments(previous => previous.some(comment => comment.id === result.comment.id)
        ? previous : [...previous, result.comment].slice(-100));
      setMessage("");
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : "Could not post your message.");
    } finally {
      setPosting(false);
    }
  }

  return <section className="project-discussion">
    <div className="discussion-actions">
      <button type="button" aria-controls={id} aria-expanded={mode === "comment"} onClick={() => setMode(mode === "comment" ? null : "comment")}>Comments</button>
      <button type="button" aria-controls={id} aria-expanded={mode === "connect"} onClick={() => setMode(mode === "connect" ? null : "connect")}>Connect</button>
    </div>
    <div id={id} hidden={!open}>
      {loading && <p role="status">Loading discussion…</p>}
      {!loading && !comments.length && <p>Start the conversation.</p>}
      {comments.length > 0 && <ul className="discussion-list" aria-label="Project discussion">
        {comments.map(comment => <li key={comment.id}>
          <strong>{comment.author}</strong>{comment.kind === "connect" && <small> · Connection invitation</small>}
          <p>{comment.message}</p>
        </li>)}
      </ul>}
      <form onSubmit={submit}>
        <p>{mode === "connect" ? `Invite ${team} to discuss their project. Your invitation appears in this public thread.` : "Comments are public."}</p>
        <label>Display name<input value={author} onChange={event => setAuthor(event.target.value)} maxLength={60} required /></label>
        <label>{mode === "connect" ? "Invitation" : "Comment"}
          <textarea value={message} onChange={event => setMessage(event.target.value)} maxLength={600} rows={3} required />
        </label>
        {error && <p role="alert">{error}</p>}
        <button type="submit" disabled={posting || !author.trim() || !message.trim()}>
          {posting ? "Posting…" : mode === "connect" ? "Post invitation" : "Post comment"}
        </button>
      </form>
    </div>
  </section>;
}
