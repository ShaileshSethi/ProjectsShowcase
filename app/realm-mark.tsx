type Kind = "potion" | "scroll" | "lantern" | "house" | "moon";

export default function RealmMark({ kind, className = "" }: { kind: Kind; className?: string }) {
  return <svg className={`realm-mark ${className}`} viewBox="0 0 64 64" fill="none" aria-hidden="true">
    {kind === "potion" && <><path d="M25 6h14M29 6v13L16 43c-4 8 2 15 11 15h10c9 0 15-7 11-15L35 19V6" stroke="#e2d4ee" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/><path d="M19 43q11-8 26 0l3 8q-2 7-11 7H27q-9 0-11-7z" fill="#8bdabc"/><path d="M24 37h17" stroke="#a3e6d0" strokeWidth="2"/><circle cx="32" cy="48" r="3" fill="#284d50"/><circle cx="37" cy="29" r="2" fill="#ffb46e"/><path d="m48 13 2-5 2 5 5 2-5 2-2 5-2-5-5-2z" fill="#ffb46e"/></>}
    {kind === "scroll" && <><path d="M15 12h34v36q0 10-10 10H17q-8 0-8-8t8-8h26V12" fill="#f0ddbd" stroke="#8a668c" strokeWidth="3" strokeLinejoin="round"/><path d="M17 42q8 0 8 8t-8 8" stroke="#8a668c" strokeWidth="3"/><path d="M23 24h18M23 31h13" stroke="#8a668c" strokeWidth="3" strokeLinecap="round"/><path d="m39 5 2-4 2 4 4 2-4 2-2 4-2-4-4-2z" fill="#ffae68"/></>}
    {kind === "lantern" && <><path d="M23 13q0-9 9-9t9 9M22 16h20l8 7-4 31H18l-4-31z" fill="#38283f" stroke="#d8b68a" strokeWidth="3" strokeLinejoin="round"/><path d="M22 26h20l-2 21H24z" fill="#ffb65d"/><path d="m32 30-5 11h10z" fill="#fff0bc"/><path d="M16 55h32" stroke="#d8b68a" strokeWidth="3" strokeLinecap="round"/></>}
    {kind === "house" && <><path d="M7 30 32 10l25 20-5 3v24H12V33z" fill="#46314f" stroke="#c39391" strokeWidth="3" strokeLinejoin="round"/><path d="M24 57V39h16v18" fill="#211629" stroke="#c39391" strokeWidth="2"/><path d="M17 35h9v10h-9zm21 0h9v10h-9z" fill="#ffaf5a"/><path d="M31 6v-4M3 32l-2 2m62-2-2 2" stroke="#ffaf5a" strokeWidth="2" strokeLinecap="round"/></>}
    {kind === "moon" && <><path d="M42 7a23 23 0 1 0 15 38A24 24 0 0 1 42 7Z" fill="#e8d8b7" stroke="#bca0dc" strokeWidth="2"/><path d="m12 12 2-5 2 5 5 2-5 2-2 5-2-5-5-2zm40 7 2-5 2 5 5 2-5 2-2 5-2-5-5-2z" fill="#ffb46e"/></>}
  </svg>;
}
