"use client";
import {useEffect,useState} from "react";
export default function SubmissionExtras(){
 const [preview,setPreview]=useState(""),[error,setError]=useState("");
 useEffect(()=>()=>{if(preview)URL.revokeObjectURL(preview)},[preview]);
 return <fieldset className="submission-extras"><legend>Make your house yours</legend><label>Team members <small>(optional)</small><input name="members" maxLength={240} placeholder="Names, separated by commas"/></label><label>Choose your monster mascot<select name="mascot" defaultValue="ghost"><option value="ghost">Boo the ghost</option><option value="pumpkin">Glowing pumpkin</option><option value="bat">Midnight bat</option><option value="robot">Witch robot</option></select></label><label>Project screenshot <small>(optional · PNG, JPEG, WebP · max 3 MB)</small><input name="screenshot" type="file" accept="image/png,image/jpeg,image/webp" onChange={e=>{setError("");setPreview("");const f=e.target.files?.[0];if(!f)return;if(f.size>3*1024*1024||!['image/png','image/jpeg','image/webp'].includes(f.type)){setError("Choose a PNG, JPEG, or WebP under 3 MB.");e.target.value="";return}setPreview(URL.createObjectURL(f))}}/></label>{error&&<p role="alert" className="error">{error}</p>}{preview&&<img className="screenshot-preview" src={preview} alt="Your selected project screenshot"/>}</fieldset>
}
