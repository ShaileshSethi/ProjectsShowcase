"use client";
import { useEffect, useState } from "react";

export default function SubmissionExtras() {
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");
  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);

  return <fieldset className="submission-extras">
    <legend>Make your house yours</legend>
    <label>Team members <small>(optional)</small><input name="members" maxLength={240} placeholder="Names, separated by commas" /></label>
    <label>Behind the build <small>(optional)</small><textarea name="story" maxLength={1200} rows={4} placeholder="What inspired it? What was tricky? What should visitors try?" /></label>
    <label>Built with <small>(optional)</small><input name="technologies" maxLength={160} placeholder="React, Three.js, OpenAI API…" /></label>
    <label>Source code link <small>(optional)</small><input name="sourceUrl" type="url" maxLength={2048} placeholder="https://github.com/your-team/project" /></label>
    <label>Choose your monster mascot<select name="mascot" defaultValue="ghost"><option value="ghost">Boo the ghost</option><option value="pumpkin">Glowing pumpkin</option><option value="bat">Midnight bat</option><option value="robot">Witch robot</option></select></label>
    <label>Project screenshot <small>(optional · PNG, JPEG, WebP · max 3 MB)</small><input name="screenshot" type="file" accept="image/png,image/jpeg,image/webp" onChange={e => {
      setError(""); setPreview(""); const file = e.target.files?.[0]; if (!file) return;
      if (file.size > 3 * 1024 * 1024 || !["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
        setError("Choose a PNG, JPEG, or WebP under 3 MB."); e.target.value = ""; return;
      }
      setPreview(URL.createObjectURL(file));
    }} /></label>
    {error && <p role="alert" className="error">{error}</p>}
    {preview && <img className="screenshot-preview" src={preview} alt="Your selected project screenshot" />}
  </fieldset>;
}
