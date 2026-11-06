"use client";

import { useEffect, useRef } from "react";

export default function RealmDepth({ scene }: { scene: "workshop" | "lab" | "desk" | "village" }) {
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = host.current;
    if (!element || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let px = 0, py = 0, frame = 0;
    const update = () => {
      frame = 0;
      const top = element.getBoundingClientRect().top;
      const scroll = Math.max(-1, Math.min(1, -top / innerHeight));
      const layers = [
        ["far", -px * 5, scroll * 9 - py * 3],
        ["mid", px * 10, scroll * 18 + py * 6],
        ["near", px * 22, scroll * 30 + py * 11],
      ] as const;
      for (const [layer, x, y] of layers) {
        element.style.setProperty(`--${layer}-x`, `${x.toFixed(1)}px`);
        element.style.setProperty(`--${layer}-y`, `${y.toFixed(1)}px`);
      }
    };
    const queue = () => { if (!frame) frame = requestAnimationFrame(update); };
    const move = (event: PointerEvent) => { if (event.pointerType === "touch") return; px = event.clientX / innerWidth - .5; py = event.clientY / innerHeight - .5; queue(); };
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", queue);
    queue();
    return () => { cancelAnimationFrame(frame); window.removeEventListener("pointermove", move); window.removeEventListener("scroll", queue); window.removeEventListener("resize", queue); };
  }, []);

  return <div ref={host} className={`realm-depth depth-${scene}`} aria-hidden="true">
    <svg className="depth-far" viewBox="0 0 1400 650" preserveAspectRatio="xMidYMid slice">
      <defs><radialGradient id={`moon-${scene}`}><stop stopColor="#d6c1ff" stopOpacity=".65"/><stop offset=".35" stopColor="#a674dd" stopOpacity=".22"/><stop offset="1" stopColor="#a674dd" stopOpacity="0"/></radialGradient></defs>
      <circle cx="1115" cy="140" r="175" fill={`url(#moon-${scene})`} />
      {[...Array(18)].map((_, i) => <circle key={i} cx={105 + (i * 179) % 1190} cy={45 + (i * 83) % 360} r={i % 4 === 0 ? 2.5 : 1.3} fill={i % 3 === 0 ? "#ffd19a" : "#d4bcf4"} opacity={i % 3 === 0 ? .8 : .55} />)}
      <path d="M100 250q190-70 350-10t320-8q190-70 390 20" fill="none" stroke="#d6aeef" strokeOpacity=".09" strokeWidth="2"/>
    </svg>
    <svg className="depth-mid" viewBox="0 0 1400 650" preserveAspectRatio="xMidYMid slice">
      <path d="M0 545q170-110 310-25t330-18q170-70 340 16t420-22v154H0z" fill="#4a3059" opacity=".25"/>
      <path d="M0 590q230-85 420-27t330-12q180-70 370 12t280 0v87H0z" fill="#1a1326" opacity=".5"/>
      <g className="depth-lantern" transform="translate(1250 290)"><path d="M0-62v62" stroke="#8f6a97" strokeWidth="3"/><path d="M-18 0h36l-5 48h-26z" fill="#25172d" stroke="#bb8b80" strokeWidth="2"/><path d="M-8 9h16v29H-8z" fill="#ffb558"/><circle cx="0" cy="23" r="48" fill="#ffa948" opacity=".06"/></g>
    </svg>
    <svg className="depth-near" viewBox="0 0 1400 650" preserveAspectRatio="xMidYMid slice">
      <g fill="none" stroke="#27172f" strokeLinecap="round"><path d="M-30 590Q95 250 0 0M-15 330Q85 280 145 145M40 415Q145 340 205 315M1430 620Q1270 260 1400-30M1370 330Q1240 255 1185 115M1330 465Q1230 375 1165 370" strokeWidth="17"/><path d="M-12 320Q64 180 125 95M45 416Q100 445 160 420M1380 365Q1330 190 1265 130M1320 454Q1260 480 1210 470" strokeWidth="8"/></g>
      <g fill="#6c3d48" opacity=".8"><path d="m128 136 30-12-11 30zM177 312l23-20-3 32zM1265 135l-22-20 4 29zM1163 367l-31-13 15 30z"/></g>
      <g fill="#d4783e" opacity=".85"><path d="m60 275 19-24-1 27zM135 397l24-16-9 27zM1281 281l-24-16 8 29zM1208 463l-18-22 27 5z"/></g>
    </svg>
  </div>;
}
