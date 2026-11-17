importScripts('./reminders.js');
const CACHE='bloom-v10';const FILES=['./','./index.html','./app.js','./model.js','./garden.js','./garden-ui.js','./reminders.js','./style.css','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
// Activate a new version straight away so new routes, like calendar reminders, work on the next tap.
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)))});
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('bloom-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{const url=new URL(e.request.url);if(e.request.method!=='GET'||url.origin!==location.origin)return;
  // Calendar reminders. The default-times file goes straight to the network: a real text/calendar response from the
  // host is what iOS hands to Calendar most reliably. Custom times (?m=HH:MM&n=HH:MM) are generated here.
  if(url.pathname.endsWith('/bloom-reminders.ics')){if(url.search)e.respondWith(new Response(bloomReminders.ics({morning:url.searchParams.get('m'),night:url.searchParams.get('n')},{url:self.registration.scope}),{headers:{'Content-Type':'text/calendar; charset=utf-8','Content-Disposition':'inline; filename="bloom-reminders.ics"','Cache-Control':'no-store'}}));return}
  e.respondWith(fetch(e.request).catch(()=>caches.match(e.request).then(r=>r||(e.request.mode==='navigate'?caches.match('./index.html'):Response.error()))))});
