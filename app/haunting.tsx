"use client";
import {useEffect,useRef,useState} from "react";
export function SpookyIcon({kind="bat",className=""}:{kind?:string;className?:string}){
 return <svg className={"spooky-icon "+className} viewBox="0 0 64 64" fill="currentColor" aria-hidden="true">{kind==="bat"?<path d="M32 22 27 14 25 25C18 16 10 12 2 10c5 10 6 17 3 26 7-4 13-3 17 5 3-5 6-7 10-3 4-4 7-2 10 3 4-8 10-9 17-5-3-9-2-16 3-26-8 2-16 6-23 15l-2-11z"/>:kind==="ghost"?<><path d="M12 53V26C12 0 52 0 52 26v27l-10-7-10 7-10-7z"/><ellipse cx="25" cy="27" rx="3" ry="6" fill="#201329"/><ellipse cx="40" cy="27" rx="3" ry="6" fill="#201329"/></>:kind==="skull"?<><path d="M13 34C-1 0 65 0 51 34l-7 7v13H20V41z"/><circle cx="23" cy="27" r="7" fill="#201329"/><circle cx="42" cy="27" r="7" fill="#201329"/><path d="m32 34-4 7h8zM26 46h3v10h-3m9-10h3v10h-3" fill="#201329"/></>:<path d="m34 3-8 31h-9l-4 25h36l-5-25H33l7-31z"/>}</svg>
}
export function HauntedDecor(){return <div className="haunted-decor" aria-hidden="true"><svg className="cobweb web-left" viewBox="0 0 200 200"><g fill="none" stroke="currentColor"><path d="M0 0 190 10M0 0l175 75M0 0l140 140M0 0l75 175M0 0l10 190"/>{[.25,.5,.75,1].map(s=><path key={s} transform={"scale("+s+")"} d="M190 10Q153 27 175 75q-42-2-35 65-67-7-65 35-48-22-65 15"/>)}</g></svg><svg className="cobweb web-right" viewBox="0 0 200 200"><g fill="none" stroke="currentColor"><path d="M0 0 190 10M0 0l175 75M0 0l140 140M0 0l75 175M0 0l10 190"/>{[.25,.5,.75,1].map(s=><path key={s} transform={"scale("+s+")"} d="M190 10Q153 27 175 75q-42-2-35 65-67-7-65 35-48-22-65 15"/>)}</g></svg><div className="hanging-spider"><div/><svg viewBox="0 0 60 60"><g fill="none" stroke="currentColor" strokeWidth="2"><path d="m25 25-15-8-8 10m23 3L8 29 2 40m24-5L12 43l-2 12m25-30 15-8 8 10M35 30l17-1 6 11M34 35l14 8 2 12"/></g><ellipse cx="30" cy="31" rx="9" ry="12" fill="currentColor"/><circle cx="27" cy="27" r="1.5" fill="#ffb14c"/><circle cx="33" cy="27" r="1.5" fill="#ffb14c"/></svg></div><div className="fog fog-one"/><div className="fog fog-two"/><div className="wandering-bat bat-one"><SpookyIcon/></div><div className="wandering-bat bat-two"><SpookyIcon/></div><div className="edge-spirit"><SpookyIcon kind="ghost"/></div></div>}
export function HauntedRadio({enabled,onToggle}:{enabled:boolean;onToggle:()=>void}){
 const [volume,setVolume]=useState(.35),[failed,setFailed]=useState(false);
 const ctx=useRef<AudioContext|null>(null),master=useRef<GainNode|null>(null);
 useEffect(()=>{
  if(!enabled)return;
  let timer:ReturnType<typeof setInterval>|undefined;
  try{
   const ac=new AudioContext();ctx.current=ac;
   const mix=ac.createGain();mix.gain.value=volume*.22;mix.connect(ac.destination);master.current=mix;
   const delay=ac.createDelay(1);delay.delayTime.value=.38;const feedback=ac.createGain();feedback.gain.value=.24;delay.connect(feedback);feedback.connect(delay);delay.connect(mix);
   const drone=ac.createOscillator(),droneGain=ac.createGain();drone.type="sine";drone.frequency.value=110;droneGain.gain.value=.12;drone.connect(droneGain);droneGain.connect(mix);drone.start();
   const notes=[659.25,0,783.99,739.99,659.25,0,523.25,0,587.33,0,493.88,0,440,0,0,0,659.25,0,880,783.99,739.99,0,659.25,0,523.25,587.33,493.88,0,440,0,0,0];
   let beat=0,next=ac.currentTime+.1;
   function schedule(){if(ac.state!=="running")return;while(next<ac.currentTime+.3){const f=notes[beat%notes.length];if(f){const tone=ac.createOscillator(),gain=ac.createGain();tone.type="sine";tone.frequency.value=f;gain.gain.setValueAtTime(0,next);gain.gain.linearRampToValueAtTime(.3,next+.015);gain.gain.exponentialRampToValueAtTime(.001,next+1.8);tone.connect(gain);gain.connect(mix);gain.connect(delay);tone.start(next);tone.stop(next+2)}next+=.43;beat++}}
   const visibility=()=>{if(document.hidden)ac.suspend();else{next=ac.currentTime+.1;ac.resume().catch(()=>setFailed(true))}};
   document.addEventListener("visibilitychange",visibility);ac.resume().then(schedule).catch(()=>setFailed(true));timer=setInterval(schedule,100);
   return()=>{if(timer)clearInterval(timer);document.removeEventListener("visibilitychange",visibility);master.current=null;ctx.current=null;ac.close().catch(()=>{})};
  }catch{setFailed(true)}
 },[enabled]);
 useEffect(()=>{if(master.current&&ctx.current)master.current.gain.setTargetAtTime(volume*.22,ctx.current.currentTime,.15)},[volume]);
 return <aside className={"haunted-radio "+(enabled?"playing":"")} aria-label="Halloween background music"><button onClick={onToggle} aria-pressed={enabled} aria-label={enabled?"Pause Halloween music":"Play Halloween music"}><SpookyIcon kind="skull"/><span><strong>HAUNTED RADIO</strong><small>{failed?"Audio unavailable in this browser":enabled?"Now playing · Midnight music box":"Set the mood · Music off"}</small></span><i className="equalizer"><b/><b/><b/><b/></i></button>{enabled&&<label className="radio-volume">Volume<input aria-label="Music volume" type="range" min="0" max="1" step=".05" value={volume} onChange={e=>setVolume(Number(e.target.value))}/></label>}</aside>
}
