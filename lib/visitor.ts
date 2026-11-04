export function visitorFor(request:Request){
 const match=request.headers.get('cookie')?.match(/(?:^|;\s*)midnight_visitor=([a-f0-9-]{36})(?:;|$)/);
 const id=match?.[1]||crypto.randomUUID();
 return {id,headers:{"Cache-Control":"no-store","Set-Cookie":`midnight_visitor=${id}; HttpOnly; SameSite=Lax; Path=/; Max-Age=31536000${new URL(request.url).protocol==="https:"?"; Secure":""}`}};
}
