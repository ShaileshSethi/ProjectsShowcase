"use client";
import {useEffect,useRef} from "react";
export default function HauntedCursor(){
 const root=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  const fine=matchMedia("(pointer:fine) and (hover:hover)"),reduce=matchMedia("(prefers-reduced-motion:reduce)");
  if(!root.current)return;
  const el=root.current;let x=-100,y=-100,fx=x,fy=y,frame=0,active=false;
  const follower=el.querySelector<HTMLElement>(".cursor-familiar")!;
  const eligible=()=>fine.matches&&!reduce.matches;
  const hide=()=>{active=false;el.classList.remove("visible");document.documentElement.classList.remove("haunted-pointer")};
  const move=(e:PointerEvent)=>{
   if(!eligible()||e.pointerType==="touch"){hide();return}
   const target=e.target as HTMLElement;
   if(target.closest("input,textarea,select,[contenteditable=true]")){hide();return}
   x=e.clientX;y=e.clientY;
   if(!active){fx=x;fy=y;active=true}
   el.classList.add("visible");document.documentElement.classList.add("haunted-pointer");
   el.classList.toggle("cursor-hover",!!target.closest("button,a,[role=button],label"));
  };
  const down=()=>el.classList.add("cursor-down"),up=()=>el.classList.remove("cursor-down");
  const leave=(e:PointerEvent)=>{if(!e.relatedTarget)hide()};
  const tick=()=>{if(active){el.style.transform="translate3d("+x+"px,"+y+"px,0)";fx+=(x-fx)*.15;fy+=(y-fy)*.15;follower.style.transform="translate3d("+(fx-x+22)+"px,"+(fy-y+24)+"px,0)"}frame=requestAnimationFrame(tick)};tick();
  window.addEventListener("pointermove",move,{passive:true});window.addEventListener("pointerdown",down);window.addEventListener("pointerup",up);window.addEventListener("blur",hide);document.addEventListener("pointerout",leave);fine.addEventListener("change",hide);reduce.addEventListener("change",hide);
  return()=>{cancelAnimationFrame(frame);hide();window.removeEventListener("pointermove",move);window.removeEventListener("pointerdown",down);window.removeEventListener("pointerup",up);window.removeEventListener("blur",hide);document.removeEventListener("pointerout",leave);fine.removeEventListener("change",hide);reduce.removeEventListener("change",hide)};
 },[]);
 return <div ref={root} className="haunted-cursor" aria-hidden="true"><svg className="cursor-wand" width="32" height="40" viewBox="0 0 32 40"><path d="M1 1 27 17l-12 2-6 12z" fill="#261533" stroke="#ffb262" strokeWidth="1.5"/><path d="m1 1 10 9-4 2z" fill="#ffcc83"/><circle cx="1" cy="1" r="2" fill="#fff3ce"/></svg><span className="cursor-halo"/><div className="cursor-familiar"><svg viewBox="0 0 32 40" width="22" height="28"><path d="M5 35V15c0-16 22-16 22 0v20l-6-4-5 4-5-4z" fill="#d8c6ed" fillOpacity=".85"/><ellipse cx="12" cy="16" rx="2" ry="3" fill="#22112e"/><ellipse cx="21" cy="16" rx="2" ry="3" fill="#22112e"/></svg><i>✦</i></div></div>
}
