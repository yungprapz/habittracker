# UX review

Research consulted on 2026-11-11:
- W3C Target Size (Minimum): https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html
- W3C Focus Not Obscured (Minimum): https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html

The public W3C and Nielsen Norman Group sites were blocked by this environment's network policy. W3C's official source was read via https://github.com/w3c/wcag/tree/main/understanding/22 . No claim is made to have read the blocked NN/g article.

Applied guidance: generous full-row checkbox labels, 44px day-selection buttons, visible focus outlines, scroll padding above fixed navigation, and retained focus after checkoffs. WCAG minimum target size is 24 CSS pixels; 44px is the enhanced target, not a universal compliance claim.

Product choices: put daily actions before the hair goal; concise headings and per-routine counts; expose habit editing through native details/summary; retain expanded editors after changes; filter daily history alongside the calendar; keep notification limitations explicit. These are design judgments, not results from user research. Validate on physical iPhone Safari before release.

Validation: model tests plus Chromium checks at 320, 390 and 768 CSS pixels, checkbox keyboard-focus retention, editor persistence, filtered history, local persistence and offline reload/undo. No deployment or publication performed.
