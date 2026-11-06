"use client";

import { useState } from "react";

type Brief = { title: string; description: string; features: string[] };
const examples = [
  "A spooky maze game where a ghost chases the player and the score goes up when they escape",
  "A Halloween website where visitors make their own monster and share its name",
  "A tool that turns my friends' names into funny haunted stories",
];

function makeFeatures(requirements: string, category: string) {
  const starter = category === "Game"
    ? ["A clear way to start, play, win, and try again", "Controls that work with a keyboard and on a phone"]
    : category === "Tool"
      ? ["A simple input and a useful, surprising result", "A way to copy or share the result"]
      : ["A memorable first screen and one clear action", "A complete experience that works on a phone"];
  return [requirements.trim(), ...starter, "Friendly instructions for first-time visitors"];
}

export function BeginnerGuide({ category, onCategory, onStart }: { category: string; onCategory: (category: string) => void; onStart: (brief: Brief) => void }) {
  const [requirements, setRequirements] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  function start() {
    const text = requirements.trim();
    if (text.length < 15) { setError("Add a little more detail so Codex knows what to build."); return; }
    setError("");
    onStart({ title: name.trim() || `My Halloween ${category.toLowerCase()}`, description: text, features: makeFeatures(text, category) });
  }
  return <section className="beginner-guide" aria-labelledby="beginner-guide-title">
    <div className="beginner-guide-intro"><span className="section-label">NEW HERE? START WITH YOUR OWN IDEA</span><h2 id="beginner-guide-title">Tell us what you want to make.</h2><p>Write like you would tell a friend. You do not need to know coding terms. We’ll turn your words into a build brief you can use with Codex.</p></div>
    <div className="beginner-guide-form"><div className="beginner-type" role="group" aria-label="Project type"><span>I want to make a</span>{["Website", "Game", "Tool"].map(type => <button type="button" key={type} className={category === type ? "chip selected" : "chip"} aria-pressed={category === type} onClick={() => onCategory(type)}>{type}</button>)}</div><label>What should your {category.toLowerCase()} do?<textarea value={requirements} onChange={event => { setRequirements(event.target.value); setError(""); }} maxLength={1200} rows={4} placeholder={`I want to make a ${category.toLowerCase()} where…`} /></label><div className="beginner-examples"><span>Try an example:</span>{examples.map(example => <button type="button" key={example} onClick={() => { setRequirements(example); setError(""); }}>{example}</button>)}</div><label>Project name <small>(optional)</small><input value={name} onChange={event => setName(event.target.value)} maxLength={80} placeholder="We can use a simple name for now" /></label>{error && <p role="alert" className="error">{error}</p>}<button type="button" className="button primary" onClick={start}>Make my build brief ↗</button></div>
  </section>;
}

const helpTopics = ["I don't know where to start", "Something is broken", "Make it look better", "Help me publish it"];
export function ProjectHelp({ title, brief, category, copy }: { title: string; brief: string; category: string; copy: (text: string) => Promise<void> }) {
  const [topic, setTopic] = useState(helpTopics[0]);
  const [question, setQuestion] = useState("");
  const help = `I'm a beginner building a Halloween ${category.toLowerCase()} called "${title || "My project"}".\nMy idea: ${brief || "I am still figuring it out."}\nI need help with: ${topic}.\n${question.trim() ? `More detail: ${question.trim()}\n` : ""}\nPlease explain the next step in plain language. Ask only for information you truly need. If you can edit the code, make the change and show me how to test it. If this is about publishing, guide me to a public link and help me check it before I add it to the Midnight Build Club showcase.`;
  return <section id="project-help" className="project-help"><span className="section-label">YOUR BUILDING COMPANION</span><h2>Stuck? Ask in your own words.</h2><p>Choose what you need, add a detail if you want, then paste the request into Codex. It includes your project idea so you do not have to explain everything again.</p><div className="help-topics" role="group" aria-label="Help topic">{helpTopics.map(item => <button type="button" key={item} className={topic === item ? "chip selected" : "chip"} aria-pressed={topic === item} onClick={() => setTopic(item)}>{item}</button>)}</div><label>Tell Codex what is happening <small>(optional)</small><textarea value={question} onChange={event => setQuestion(event.target.value)} maxLength={1000} rows={3} placeholder="For example: The play button does nothing when I click it…" /></label><button type="button" className="button outline" onClick={() => copy(help)}>Copy my help request ↗</button><p className="helper">Open your project in Codex, paste this request, and send it. You can come back here anytime.</p></section>;
}

export function ShowcaseGuide({ onSubmit, onHelp, projectId }: { onSubmit: () => void; onHelp: () => void; projectId: string }) {
  const [copied, setCopied] = useState(false);
  async function copyLink() {
    try { await navigator.clipboard.writeText(`${window.location.origin}/projects/${projectId}`); setCopied(true); }
    catch { setCopied(false); }
  }
  return <section className="showcase-guide" aria-labelledby="showcase-guide-title">
    {projectId && <div className="showcase-success" role="status"><div><strong>Your project is in the showcase!</strong><p>Share its page with friends so they can visit and vote.</p></div><a href={`/projects/${projectId}`}>View my project ↗</a><button type="button" onClick={copyLink}>{copied ? "Link copied" : "Copy link"}</button></div>}
    <div className="showcase-guide-heading"><div><span className="section-label">FOR FIRST-TIME BUILDERS</span><h2 id="showcase-guide-title">How do I add my project?</h2><p>You add a link to your finished project here. Visitors can then open it, vote, and talk with your team.</p></div><button type="button" className="button primary" onClick={onSubmit}>Add my project ↗</button></div>
    <div className="showcase-guide-steps"><div><b>1</b><h3>Build it</h3><p>Make your website, game, or tool in your own workspace.</p></div><div><b>2</b><h3>Put it online</h3><p>Publish it so it has a public <code>https://</code> link. Open that link in another browser tab to check it works.</p></div><div><b>3</b><h3>Add it here</h3><p>Press “Add my project.” Enter your name, a short description, and the live link. A screenshot is optional.</p></div></div>
    <p className="showcase-guide-note">Need a live link? <button type="button" onClick={onHelp}>Get help publishing ↗</button> We’ll prepare a beginner-friendly request for Codex.</p>
  </section>;
}
