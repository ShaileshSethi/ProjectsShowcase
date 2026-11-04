"use client";
import { useEffect, useRef } from "react";
export default function MagicScene(){
 const host=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  if(!host.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;
  let disposed=false,cleanup=()=>{};
  import("three").then(T=>{
   if(disposed||!host.current)return;
   let renderer:InstanceType<typeof T.WebGLRenderer>;
   try{renderer=new T.WebGLRenderer({alpha:true,antialias:true})}catch{return}
   const el=host.current;renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));el.appendChild(renderer.domElement);
   const scene=new T.Scene(),camera=new T.PerspectiveCamera(45,1,.1,100);camera.position.z=9;
   const geometry=new T.IcosahedronGeometry(.09,0);
   const group=new T.Group();scene.add(group);
   const gems=Array.from({length:18},(_,i)=>{
    const m=new T.Mesh(geometry,new T.MeshBasicMaterial({color:i%3===0?0xa3e6d0:0xffa552,transparent:true,opacity:.45}));
    m.position.set((Math.random()-.5)*15,(Math.random()-.5)*9,Math.random()*2-2);group.add(m);return m;
   });
   let px=0,py=0,frame=0;const pointer=(e:PointerEvent)=>{px=(e.clientX/innerWidth-.5)*.25;py=(e.clientY/innerHeight-.5)*.15};
   const resize=()=>{if(!el)return;camera.aspect=el.clientWidth/el.clientHeight;camera.updateProjectionMatrix();renderer.setSize(el.clientWidth,el.clientHeight)};
   resize();window.addEventListener("resize",resize);window.addEventListener("pointermove",pointer,{passive:true});
   const clock=new T.Clock();function tick(){if(disposed)return;const t=clock.getElapsedTime();gems.forEach((g,i)=>{g.rotation.x=t*.3+i;g.rotation.y=t*.2;g.position.y+=Math.sin(t*.5+i)*.0018});group.rotation.y+=(px-group.rotation.y)*.025;group.rotation.x+=(py-group.rotation.x)*.025;renderer.render(scene,camera);frame=requestAnimationFrame(tick)}tick();
   cleanup=()=>{cancelAnimationFrame(frame);window.removeEventListener("resize",resize);window.removeEventListener("pointermove",pointer);geometry.dispose();gems.forEach(m=>(m.material as InstanceType<typeof T.MeshBasicMaterial>).dispose());renderer.dispose();renderer.domElement.remove()};
  });return()=>{disposed=true;cleanup()};
 },[]);
 return <div className="magic-canvas" ref={host} aria-hidden="true"/>;
}
