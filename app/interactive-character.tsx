"use client";
import {useEffect,useId,useRef,useState} from "react";
const lines={
 ghost:[
  "Boo! Build a website that gets braver every time someone is kind to it. Even haunted buttons need encouragement.",
  "Spooky secret: one surprising interaction beats ten unfinished features. Make the main thing playable first.",
  "What if a ghost ran a lost-and-found for memories? Let visitors discover a tiny story inside every object.",
  "Try a secret ending. Three clicks on a pumpkin could reveal an entirely different world.",
  "Haunt responsibly: keep your text readable, your buttons reachable, and your animations optional.",
 ],
 robot:[
  "Start your Codex prompt with what the visitor can DO. A haunted game is more than a purple background.",
  "Build a monster interview simulator: three questions, three ridiculous answers, one very dramatic hiring vampire.",
  "Stuck? Tell Codex what you expected, what happened, and the exact error. I call that an exorcism with evidence.",
  "Build one working screen first. Test it on your phone. Then ask Codex to add personality.",
  "Ready to summon visitors? Publish a playable link, then submit it to the showcase. Your house is waiting.",
 ],
};
export default function InteractiveCharacter({kind="robot",onIdea,context="Explore"}:{kind?:"robot"|"ghost";onIdea?:()=>void;context?:string}){
 const root=useRef<HTMLDivElement>(null),trigger=useRef<HTMLButtonElement>(null);
 const [open,setOpen]=useState(false),[index,setIndex]=useState(0);
 const id=useId(),name=kind==="robot"?"Hex":"Boo";
 useEffect(()=>{
  const el=root.current;if(!el)return;
  const reduce=matchMedia("(prefers-reduced-motion: reduce)");let frame=0;
  const move=(e:PointerEvent)=>{if(reduce.matches||e.pointerType==="touch")return;cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{const r=el.querySelector(".character-body")?.getBoundingClientRect();if(!r)return;const dx=(e.clientX-r.left-r.width/2)/180,dy=(e.clientY-r.top-r.height/2)/180;el.style.setProperty("--look-x",Math.max(-4,Math.min(4,dx*4))+"px");el.style.setProperty("--look-y",Math.max(-3,Math.min(3,dy*3))+"px");el.style.setProperty("--lean",Math.max(-5,Math.min(5,dx*3))+"deg")})};
  const reset=()=>{el.style.setProperty("--look-x","0px");el.style.setProperty("--look-y","0px");el.style.setProperty("--lean","0deg")};
  window.addEventListener("pointermove",move,{passive:true});window.addEventListener("blur",reset);reduce.addEventListener("change",reset);
  return()=>{cancelAnimationFrame(frame);window.removeEventListener("pointermove",move);window.removeEventListener("blur",reset);reduce.removeEventListener("change",reset)};
 },[]);
 useEffect(()=>{if(!open)return;const key=(e:KeyboardEvent)=>{if(e.key==="Escape"){setOpen(false);trigger.current?.focus()}};const outside=(e:PointerEvent)=>{if(!root.current?.contains(e.target as Node))setOpen(false)};document.addEventListener("keydown",key);document.addEventListener("pointerdown",outside);return()=>{document.removeEventListener("keydown",key);document.removeEventListener("pointerdown",outside)}},[open]);
 useEffect(()=>setOpen(false),[context]);
 return <div ref={root} className={"interactive-character character-"+kind+(open?" is-chatting":"")}>
  <button className="character-trigger" ref={trigger} aria-label={"Talk to "+name+", the "+(kind==="robot"?"witch robot":"ghost")} aria-expanded={open} aria-controls={id} onClick={()=>setOpen(!open)}>
   <svg className="character-body" viewBox="0 0 120 145" aria-hidden="true">
    <ellipse className="character-shadow" cx="60" cy="134" rx="34" ry="7" fill="#000" opacity=".25"/>
    {kind==="robot"?<><path d="m30 113 9 19h18l3-17 3 17h18l9-19z" fill="#cdb5d4"/><path d="M20 75 8 90l9 18 13-9m70-24 12 15-9 18-13-9" fill="#bba1ce"/><rect x="20" y="46" width="80" height="70" rx="27" fill="#dbcbdc" stroke="#ad8fb6" strokeWidth="3"/><rect x="31" y="61" width="59" height="40" rx="13" fill="#171725"/><path d="M6 53 37 45 50 3 78 12 67 20 84 43l30 12-6 10-95-2z" fill="#69447f" stroke="#382343" strokeWidth="2"/><path d="m38 39 43-4 3 8-49 5z" fill="#e9924d"/><rect x="54" y="34" width="13" height="12" rx="2" fill="#f5c06a"/><path d="M58 37h5v6h-5z" fill="#69447f"/></>:<path d="M22 119V56C22 4 98 4 98 56v64l-19-12-19 14-19-14z" fill="#e2d2f1" stroke="#b39ac9" strokeWidth="2"/>}
    <g className="character-eyes" fill={kind==="robot"?"#a3f3d3":"#392641"}>{kind==="robot"?<><rect x="43" y="73" width="8" height="12" rx="3"/><rect x="72" y="73" width="8" height="12" rx="3"/><path d="M56 88q6 7 12 0" fill="none" stroke="#a3f3d3" strokeWidth="3" strokeLinecap="round"/></>:<><ellipse cx="45" cy="58" rx="6" ry="10"/><ellipse cx="76" cy="58" rx="6" ry="10"/><ellipse cx="60" cy="83" rx={open?8:5} ry={open?10:5}/><circle cx="34" cy="78" r="6" fill="#d7afcc"/><circle cx="87" cy="78" r="6" fill="#d7afcc"/></>}</g>
    <path className="character-twinkle" d="m104 73 3 7 7 3-7 3-3 7-3-7-7-3 7-3z" fill="#ffbb67"/>
   </svg><span className="character-name">{name}<small>{open?"Listening…":"Click for a spooky hint"}</small></span>
  </button>
  {open&&<section className="character-speech" id={id} aria-label={name+"'s spooky advice"}><div className="speech-heading"><span>{name} · {kind==="robot"?"YOUR BUILD FAMILIAR":"RESIDENT IDEA GHOST"}</span><button aria-label={"Close "+name+"'s hint"} onClick={()=>{setOpen(false);trigger.current?.focus()}}>×</button></div><p role="status">{lines[kind][index]}</p><div className="speech-actions"><button onClick={()=>setIndex((index+1)%lines[kind].length)}>Another hint ↻</button>{onIdea&&<button onClick={()=>{setOpen(false);onIdea()}}>Give me a project idea ↗</button>}</div><small>Little hints from the club’s spellbook.</small></section>}
 </div>
}
