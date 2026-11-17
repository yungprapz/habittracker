# Bloom
A mobile-first, dependency-free habit PWA. Node 24 runs tests; Python 3 serves the app. No build step or account required.

## Develop
Run `npm start` from this directory (port 3000). Run `TZ=America/Toronto npm test` for schedule, history, persistence serialization, leap-year, DST and consecutive-streak tests.

## Host and install
Upload index.html, app.js, model.js, style.css, sw.js, manifest.webmanifest and both PNG icons to a static HTTPS host (for example GitHub Pages). Relative URLs support subdirectories. Serve the manifest with a JSON/manifest MIME type and sw.js as JavaScript without long-lived HTTP caching. Increment the service worker CACHE version whenever shell files change. Open the hosted URL in Safari, Share → Add to Home Screen → Add. Open once online before offline use. No Xcode or Apple Developer membership needed. This repository has not been deployed.

## Data
LocalStorage stores checkoffs and dated routine versions. Edits apply today onward; older routines retain their original names, schedules and order. Tracking begins on first use. Export/restore JSON backups from Your Routines. Browser data deletion removes local records; there is no cloud sync. Hair goal measures consecutive calendar days, allowing an unfinished current day without losing yesterday’s streak. Archived habits retain past records. Calendar dots mark hair-oiling completion.

## Reminders
Times default to 07:00 and 22:00 local time. Saving them DOES NOT schedule notifications. Use the in-app instructions to create two daily recurring Apple Reminders; changing an app time requires updating those reminders separately.

For actual Web Push on iPhone, iOS 16.4+ requires installation on the Home Screen and permission requested from a user gesture. A future deployment needs a VAPID key pair, subscription API with validation, persistent subscription storage, unsubscribe/delete support, and a scheduled server job. Store an IANA timezone and both local reminder times per subscription; handle DST, deduplicate each local date/routine, and remove expired subscriptions on 404/410. Send encrypted Web Push and handle push/notificationclick events in the worker. Keep VAPID private keys on the server. Do not use browser timers for background delivery. This static version has no subscription endpoint, push sender, or scheduler, so push is not enabled or tested. No hosting credentials are configured here.

## Flower studio and demo
Open `/?demo` on the running server for isolated sample progress (21 hair-oiling days, a finished bouquet, and an unlocked scratch reward). It uses a separate `bloom-demo` storage key; exit demo returns to real data. No demo progress is stored in the normal profile.

Complete the scheduled morning routine to collect one Cosmos, Anemone or Daisy per local day. Seven stems form a bouquet. Change wrapping in the Bouquet screen; finished bouquets appear in Collection. Daily requirements are captured when evaluated. Correcting a qualifying checkoff reconciles that day's stem. Missed future days do not remove collected stems.

Hair-oiling milestones at 21 and 42 consecutive days unlock a reward once each. Reveals use a local curated surprise pool, not an AI service or live shopping search. Scratch with a pointer or use the accessible Reveal reward button. Free treats are the default. Set per-treat and monthly caps for optional Vinted allowances. Revealed paid allowances reserve budget in the month revealed. Lowering limits replaces unclaimed paid suggestions with a free treat; claimed rewards remain recorded. No purchases or notifications are sent.

Current illustrations are lightweight original SVG artwork rather than the detailed mockup illustration assets. Physical iPhone Safari testing and HTTPS deployment remain outstanding. Browser screenshots in demo/ show the actual implementation.
