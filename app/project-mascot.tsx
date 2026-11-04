import {SpookyIcon} from "./haunting";
export default function ProjectMascot({kind}:{kind:string}){
 if(kind==="pumpkin")return <svg className="spooky-icon" viewBox="0 0 64 64" aria-hidden="true"><path d="m31 17 2-12 9 2-6 11" fill="#94b477"/><path d="M32 17C3 5-4 57 20 56q12 6 24 0C68 57 61 5 32 17" fill="#ff9c43" stroke="#ce6530" strokeWidth="2"/><path d="m13 35 10-11 4 13m10 0 4-13 10 11M15 43l9 4 8-4 8 4 9-4-8 10H23z" fill="#342035"/></svg>;
 if(kind==="robot")return <svg className="spooky-icon" viewBox="0 0 64 64" aria-hidden="true"><rect x="10" y="26" width="44" height="32" rx="12" fill="#ddd0e5"/><rect x="16" y="32" width="32" height="19" rx="6" fill="#1d192b"/><path d="m4 26 15-6 8-18 17 6-7 4 9 8 14 6-3 6H8z" fill="#83599e"/><path d="m19 18 25-2 3 6-31 2z" fill="#ffac55"/><path d="m23 38 4 3-4 3m18-6-4 3 4 3m-12 1q3 3 6 0" fill="none" stroke="#a3e6d0" strokeWidth="2"/></svg>;
 return <SpookyIcon kind={kind==="bat"?"bat":"ghost"}/>;
}
