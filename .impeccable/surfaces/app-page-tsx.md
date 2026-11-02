---
version: 1
slug: "app-page-tsx"
primary_target: "app/page.tsx"
related_targets: ["app/giveaway/page.tsx"]
---

# Surface: Giveaway (`/`)

Mode: Operate
Audience: streamer mid-live on a secondary monitor
Job: connect chat → capture exact command → watch unique participants → draw winner
Constraints: preserve tmi.js anonymous IRC, exact command match, capture gate, dedupe, random roll; no Better Chat; no toolbox home

## Direction contract

THESIS: Rollaway is an arcade ticket counter — each chat entry becomes a stub in the till; the draw is the isolated cashier action. Refuses purple Twitch SaaS card grids and costume arcade HUDs.

OWN-WORLD: Charcoal desk shell `#12141A`, porcelain panels `#F4F2EC`, ticket yellow `#F5D547` as committed field for count and primary draw, magenta `#E11D7A` only for active capture. Condensed display for the ticket count; workhorse grotesk for UI. Ticket-stub rows with perforation edge. Controls stay standard web inputs/buttons.

STORY: Streamer sees connection and capture state at a glance, watches stubs stack as viewers type the command, then hits an isolated yellow draw to reveal the winner as the singular focal moment.

FIRST VIEWPORT: Top bar — Rollaway wordmark left, status chips (Connecté / Capture / count) right. Left rail — Guichet: channel, command, connect/disconnect, start/stop capture. Right stage — yellow ticket-count plate + stacked stub list. Bottom of guichet — isolated « Tirer un gagnant » with breathing room. No bottom nav.

FORM: Arcade ticket redemption counter (grounded list #5, seed key f449bb58). Signature interaction: new stubs punch in; winner reveal owns the viewport as a ticket stamp/pull, not a generic modal card.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
