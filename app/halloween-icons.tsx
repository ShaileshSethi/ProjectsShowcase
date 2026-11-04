import type {SVGProps} from "react";
type Props=SVGProps<SVGSVGElement>&{size?:number};
const art:Record<string,React.ReactNode>={
 arrow:<><path d="M4 12h15m-6-6 6 6-6 6"/><path d="m5 9-2 3 2 3"/></>,
 external:<><path d="M6 18 18 6M9 6h9v9"/><path d="m5 14-2 7 7-2"/></>,
 ghost:<><path d="M5 21V10a7 7 0 0 1 14 0v11l-3-2-4 2-4-2z"/><path d="M9 9v3m6-3v3m-5 4q2 2 4 0"/></>,
 cauldron:<><path d="M3 10h18M5 11c-3 12 17 12 14 0M7 20l-1 2m11-2 1 2M9 7c-3-3 3-3 0-6m6 6c-3-3 3-3 0-6"/><path d="m9 14 1 1m4-1 1 1m-5 3h4"/></>,
 wand:<><path d="m4 21 12-12 3 3L7 24M14 11l3 3M17 2v3m4 2h3m-3-5-2 2M7 5v4M5 7h4"/></>,
 skull:<><path d="M7 17c-9-12 19-20 14-4l-4 4v5H8v-5z"/><circle cx="9" cy="10" r="2"/><circle cx="16" cy="10" r="2"/><path d="m12 14 1-1 1 1m-3 5v3m3-3v3"/></>,
 bat:<path d="m12 9-2-3-1 4Q5 6 2 6q2 5 0 10 4-2 6 2 2-4 4-1 2-3 4 1 2-4 6-2-2-5 0-10-3 0-7 4l-1-4z"/>,
 game:<><path d="M6 9 4 6 2 9l1 10 5-3h8l5 3 1-10-2-3-2 3zM6 12v4m-2-2h4m8-1h.1m3 2h.1"/><path d="m10 10 2-4 2 4"/></>,
 globe:<><path d="M3 8 7 3h10l4 5v9l-4 4H7l-4-4zM3 8h18M7 5h.1m3 0h.1"/><path d="m8 12 2-1v3l-2 1m8-3-2-1v3l2 1m-5 3h2"/></>,
 copy:<><path d="M8 6h11v15H8zM8 17H4V3h11v3M11 10h5m-5 4h3"/><path d="m11 18 2-1 3 1"/></>,
 check:<><path d="m4 12 5 6L20 5M4 9l-2 3 2 3m13-9 3-3 2 2"/></>,
 close:<><path d="m5 5 14 14M19 5 5 19M3 6l3-3m12 18 3-3M18 3l3 3M3 18l3 3"/></>,
 spark:<><path d="m12 2 2 7 7 3-7 2-2 8-3-8-7-2 7-3zM20 3v3m-1-2h3"/></>,
 sound:<><path d="M3 9h4l5-5v16l-5-5H3zM16 8q6 4 0 8m3-11q9 7 0 14"/></>,
 mute:<><path d="M3 9h4l5-5v16l-5-5H3zm13 0 6 6m0-6-6 6"/></>,
 down:<><path d="m5 8 7 9 7-9M8 8l4 5 4-5"/></>,
 menu:<><path d="M3 6h18M5 12h14M3 18h18M5 4v4m12 2v4m-7 2v4"/></>,
 reset:<><path d="M4 10a8 8 0 1 1 0 7M4 4v6h6M12 7v5l3 2"/></>,
};
function Glyph({name,size=24,...props}:Props&{name:string}){return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.55" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{art[name]}</svg>}
export const ArrowRight=(p:Props)=><Glyph name="arrow" {...p}/>;
export const ArrowUpRight=(p:Props)=><Glyph name="external" {...p}/>;
export const ExternalLink=ArrowUpRight;
export const Ghost=(p:Props)=><Glyph name="ghost" {...p}/>;
export const FlaskConical=(p:Props)=><Glyph name="cauldron" {...p}/>;
export const WandSparkles=(p:Props)=><Glyph name="wand" {...p}/>;
export const Code2=(p:Props)=><Glyph name="skull" {...p}/>;
export const Layers=(p:Props)=><Glyph name="bat" {...p}/>;
export const Gamepad2=(p:Props)=><Glyph name="game" {...p}/>;
export const Globe=(p:Props)=><Glyph name="globe" {...p}/>;
export const Copy=(p:Props)=><Glyph name="copy" {...p}/>;
export const Check=(p:Props)=><Glyph name="check" {...p}/>;
export const X=(p:Props)=><Glyph name="close" {...p}/>;
export const Sparkles=(p:Props)=><Glyph name="spark" {...p}/>;
export const Volume2=(p:Props)=><Glyph name="sound" {...p}/>;
export const VolumeX=(p:Props)=><Glyph name="mute" {...p}/>;
export const ChevronDown=(p:Props)=><Glyph name="down" {...p}/>;
export const Menu=(p:Props)=><Glyph name="menu" {...p}/>;
export const RotateCcw=(p:Props)=><Glyph name="reset" {...p}/>;
export const Send=WandSparkles;
