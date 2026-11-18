importScripts('./reminders.js');
const CACHE='bloom-v12';const FILES=['./','./index.html','./app.js','./model.js','./garden.js','./garden-ui.js','./reminders.js','./style.css','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
const PATHS=new Set(FILES.map(f=>new URL(f,location).pathname));
// Activate a new version straight away so new routes, like calendar reminders, work on the next tap.
// cache:'reload' skips the browser's HTTP cache. GitHub Pages lets browsers reuse files for 10 minutes, which could
// otherwise save the previous version's files into the new offline cache.
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES.map(f=>new Request(f,{cache:'reload'})))))});
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('bloom-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{const url=new URL(e.request.url);if(e.request.method!=='GET'||url.origin!==location.origin)return;
  // Calendar reminders. The default-times file goes straight to the network: a real text/calendar response from the
  // host is what iOS hands to Calendar most reliably. Custom times (?m=HH:MM&n=HH:MM) are generated here.
  if(url.pathname.endsWith('/bloom-reminders.ics')){if(url.search)e.respondWith(new Response(bloomReminders.ics({morning:url.searchParams.get('m'),night:url.searchParams.get('n')},{url:self.registration.scope}),{headers:{'Content-Type':'text/calendar; charset=utf-8','Content-Disposition':'inline; filename="bloom-reminders.ics"','Cache-Control':'no-store'}}));return}
  // Network first. cache:'no-cache' checks each file with the server (a quick "not modified" when nothing changed), so a
  // new version shows on the next open instead of up to 10 minutes later. Fresh copies of the app's own files also
  // refresh the offline cache, which is used when the network fails.
  const nav=e.request.mode==='navigate';
  e.respondWith(fetch(e.request,{cache:'no-cache'}).then(res=>{if(res.ok&&PATHS.has(url.pathname)){const copy=res.clone();e.waitUntil(caches.open(CACHE).then(c=>c.put(url.pathname,copy)))}return res})
    .catch(()=>caches.match(e.request,{ignoreSearch:nav}).then(r=>r||(nav?caches.match('./index.html'):Response.error()))))});
