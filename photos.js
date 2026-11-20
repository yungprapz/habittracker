// Weekly scalp photos. Images are too big for localStorage, so they live in IndexedDB on this device only,
// one per Monday–Sunday week (keyed by the week's Monday), downscaled to keep storage small.
import {weekStart,today} from './model.js';

export const photoWeek=(date=today())=>weekStart(date);
// Longest side at most max px, never upscaled.
export function fitSize(w,h,max=1600){const k=Math.min(1,max/Math.max(w,h));return {w:Math.round(w*k),h:Math.round(h*k)}}
// Weeks between two week keys, for "6 weeks apart".
export const weeksApart=(a,b)=>Math.round(Math.abs(new Date(b+'T12:00:00')-new Date(a+'T12:00:00'))/(7*864e5));

let dbName='bloom-photos';export const usePhotoDb=name=>{dbName=name};
function db(){return new Promise((ok,no)=>{const r=indexedDB.open(dbName,1);r.onupgradeneeded=()=>r.result.createObjectStore('scalp',{keyPath:'week'});r.onsuccess=()=>ok(r.result);r.onerror=()=>no(r.error)})}
async function tx(mode,fn){const d=await db();return new Promise((ok,no)=>{const t=d.transaction('scalp',mode),req=fn(t.objectStore('scalp'));t.oncomplete=()=>{d.close();ok(req?.result)};t.onerror=t.onabort=()=>{d.close();no(t.error)}})}

// Metadata only ({week,date}), oldest first; blobs are loaded per image.
export async function listPhotos(){const all=await tx('readonly',s=>s.getAll());return (all||[]).map(({week,date})=>({week,date})).sort((a,b)=>a.week.localeCompare(b.week))}
export const getPhoto=week=>tx('readonly',s=>s.get(week)).then(r=>r?.blob||null);
export const deletePhoto=week=>tx('readwrite',s=>{s.delete(week)});

async function shrink(file){
  let img;try{img=await createImageBitmap(file,{imageOrientation:'from-image'})}catch{img=await new Promise((ok,no)=>{const i=new Image();i.onload=()=>ok(i);i.onerror=no;i.src=URL.createObjectURL(file)})}
  const {w,h}=fitSize(img.width,img.height),c=document.createElement('canvas');c.width=w;c.height=h;c.getContext('2d').drawImage(img,0,0,w,h);img.close?.();
  return new Promise((ok,no)=>c.toBlob(b=>b?ok(b):no(Error('encode')),'image/jpeg',.85))}

// Saves (or replaces) the photo for date's week.
export async function savePhoto(file,date=today()){const blob=await shrink(file),week=photoWeek(date);await tx('readwrite',s=>{s.put({week,date,blob})});navigator.storage?.persist?.().catch(()=>{});return {week,date}}
