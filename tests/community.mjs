import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const base='http://127.0.0.1:5173';
let cookie='';
async function call(path,options={}){const r=await fetch(base+path,{...options,headers:{...options.headers,...(cookie?{cookie}:{})}});const set=r.headers.get('set-cookie');if(set)cookie=set.split(';')[0];return r}
let r=await call('/api/projects');assert.equal(r.status,200);await r.json();
const form=new FormData();for(const [k,v] of Object.entries({title:'Local test — Pumpkin Portal',author:'Night Builders',description:'Local integration test project',category:'Game',url:'https://example.com',members:'Boo, Hex',mascot:'pumpkin'}))form.set(k,v);
form.set('screenshot',new Blob([await readFile('public/workshop.png')],{type:'image/png'}),'preview.png');
r=await call('/api/projects',{method:'POST',body:form});assert.equal(r.status,201,await r.clone().text());const {project}=await r.json();assert.equal(project.members,'Boo, Hex');assert.ok(project.screenshot);
r=await call(project.screenshot);assert.equal(r.status,200);assert.equal(r.headers.get('content-type'),'image/png');
async function react(kind,active=true){const x=await call('/api/applause',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({projectId:project.id,kind,active})});assert.equal(x.status,200)}
await react('vote');await react('vote');for(const kind of ['weird','haunted','again'])await react(kind);
async function own(){return (await (await call('/api/projects')).json()).projects.find(x=>x.id===project.id)}
let p=await own();assert.equal(p.counts.vote,1);assert.equal(p.mine.length,4);
const firstCookie=cookie;cookie='';await call('/api/projects');await react('vote');p=await own();assert.equal(p.counts.vote,2);
cookie=firstCookie;await react('vote',false);await react('weird',false);p=await own();assert.equal(p.counts.vote,1);assert.ok(!p.mine.includes('vote'));assert.ok(!p.mine.includes('weird'));
r=await call('/api/applause',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({projectId:project.id,kind:'bad',active:true})});assert.equal(r.status,400);
form.set('screenshot',new Blob(['not an image'],{type:'image/png'}),'fake.png');r=await call('/api/projects',{method:'POST',body:form});assert.equal(r.status,400);
console.log('PASS: screenshot upload/retrieval, team and mascot persistence, idempotent votes, second visitor voting, undo, three reactions, invalid reaction and fake image rejection.');
