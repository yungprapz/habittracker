# Bloom handoff

Read README.md first. This is a dependency-free, mobile-first PWA for skincare, hair care, and supplement habits. It runs directly as static ES modules; Node 24 runs the tests, Python 3 serves the app. Use the existing checkout. No worktree is necessary unless requested.

## Run
- `npm start` (port 3000)
- `npm test`
- Open `http://localhost:3000/?demo` in the browser on the machine running the server. Cloud deployments require a forwarded preview or HTTPS hosting; localhost on someone else's device will not reach this server.
- Demo uses separate localStorage (`bloom-demo`) from real data (`bloom-v1`).

## Product direction approved by user
Cream, sage/olive, butter yellow, muted rose. Botanical flower-shop theme, no smiling flowers. Quiet serif headings and readable body text. Pressed-flower journal look: paper cards with soft shadows, washi tape, wax seals, a forest-green streak card, a progress ring and a week strip on Today (style.css tokens on :root). Florist-tag buttons for primary actions. Navigation is a floating pill tab bar with line icons (Today, Flowers, Progress, Routines); Bouquet and Collection were merged into Flowers at the user’s request. Earn a flower per qualifying day, collect seven stems into a bouquet, retain finished bouquets on a shelf. Avoid crowded garden plots and generic pill-card UI.

Habit history must remain accurate after edits. Local dates, offline checkoffs and undo are required. Morning: thyroid medicine, Vitamin C SERUM, moisturizer, sunscreen. Night: red light mask, serum, moisturizer, retinol any 2 nights a week (a weekly habit, habit.perWeek; editable), hair oiling; then Vitamin D, iron and creatine as separate checkoffs. Reminder preferences 07:00/22:00 local time. These DO NOT send notifications; Apple Reminders fallback is documented.

Hair goal: 42 then 66 streak days under a "never miss twice" rule (one rest day pauses, two reset), separate from cumulative flower collection. Surprise treats unlock at 21, 42 and 66 days, scratch or accessible button to reveal, swap and claim. Fixed £10/£25 rewards were superseded: user wants variable surprises within chosen spending limits. The spending-limits UI was removed at the user's request, so treats are free unless a save already holds limits; never buy anything automatically.

## Files
- app.js: main views and persistence
- model.js: local dates, schedule versions, streaks
- garden.js: stem eligibility, collection, milestones, budget reservations, SVG art
- garden-ui.js: bouquet, collection and scratch UI
- sw.js: offline shell; bump cache on asset changes

## Known limitations / next work
The implemented SVG flowers are simpler than the approved visual mockups. Custom reward categories, exclusions, wishlists, manually arranging individual stems, and editable daily flower goal are unfinished (each completed routine, morning and evening, earns one stem; light-tracked habits are excluded). Surprise pool is curated local suggestions, not AI-generated or live shopping inventory. Budget caps reserve allowances in reveal month; review UX for cross-month claims. Reward milestones persist once earned; review explicit policy for historical corrections. Harden imported backup validation, including garden data, and recovery from corrupt localStorage before release. App is not deployed, push is not configured, and physical iPhone Safari installation/testing is outstanding. GitHub publication is source-code sharing, not deployment.

## Validation
Eighteen Node tests cover defaults, history, local dates/DST, never-miss-twice streaks, weekly habits, light tracking, automaticity scoring, save upgrades, morning/evening stems, rare and comeback blooms, milestones (21/42/66), budget reservations and serialization. Chromium checks were run at 320/390/768 widths, with offline reload, isolated demo data, collection, reveal, pointer scratching and persistence. Screenshots/video in demo are illustrative demo data, not real user history.

## Habit-science features (feat/habit-science)
Never-miss-twice streaks (model.js streakInfo), inline flower pick on Today plus evening flowers (garden-ui.js pickers, garden.js stemKey: evening stems are keyed `date:night`, morning stems keep the bare date), "After I…" routine anchors (state.anchors), 66-day milestone, optional light tracking (habit.light, excluded via model.js active()). The monthly automaticity check UI was removed at the user's request; model.js still exports its helpers and old state.auto data is kept. Weekly habits (habit.perWeek 1–6) show every day, are excluded from active() and measured Monday–Sunday (weekCount, weeksMet). Following a UI review (Clue-inspired, keep colours/theme): Today is checklist-first (slim ring header, no instruction copy, daily habits have no subtitle, a finished routine folds into a card holding its own flower picker via garden-ui.js pickerFor, unfinished routines first, one-line hair streak with the rule behind "?", no studio link); Progress is calendar plus a collapsible day summary; Flowers shows earned envelopes plus one next-treat timeline row; Routines groups habit editors by routine with anchor and time in the header, tap-to-edit rows, Up/Down reorder within a routine. Naming: "habits", "Morning routine", "Evening routine". Notices clear after ~3s. The Flowers tab no longer has wrapping, collect-for-date or spending-limit controls; collect for a past day by picking it in Today's week strip, and unannounced rare blooms (10% chance, always on a comeback day). README "Why it works this way" lists the research behind each.
