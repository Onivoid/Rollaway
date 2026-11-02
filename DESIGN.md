---
name: Rollaway
description: Arcade ticket counter for Twitch giveaways — charcoal desk, porcelain guichet, yellow till.
colors:
  desk: "#12141A"
  desk-raised: "#1C1F28"
  porcelain: "#F4F2EC"
  porcelain-ink: "#12141A"
  ticket: "#F5D547"
  ticket-ink: "#12141A"
  punch: "#E11D7A"
  punch-ink: "#FFFFFF"
  live: "#3DDC84"
  foreground: "#F4F2EC"
  muted: "#2A2E3A"
  muted-foreground: "#A8ADB8"
  border: "#2E3340"
  field-bg: "#FFFFFF"
typography:
  display:
    fontFamily: "Barlow Condensed, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.5rem, 4vw, 4.5rem)"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "0.02em"
  headline:
    fontFamily: "Barlow Condensed, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0.04em"
  title:
    fontFamily: "Barlow Condensed, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "0.04em"
  body:
    fontFamily: "Source Sans 3, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  label:
    fontFamily: "Source Sans 3, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "0.12em"
rounded:
  none: "0px"
  full: "9999px"
spacing:
  xs: "6px"
  sm: "8px"
  md: "16px"
  lg: "20px"
  xl: "24px"
components:
  button-draw:
    backgroundColor: "{colors.ticket}"
    textColor: "{colors.ticket-ink}"
    typography: "{typography.display}"
    rounded: "{rounded.none}"
    padding: "0 24px"
    height: "64px"
  button-draw-hover:
    backgroundColor: "{colors.ticket}"
    textColor: "{colors.ticket-ink}"
  button-desk:
    backgroundColor: "{colors.desk}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.none}"
    padding: "0 16px"
    height: "44px"
  button-desk-hover:
    backgroundColor: "{colors.desk-raised}"
    textColor: "{colors.foreground}"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.porcelain-ink}"
    rounded: "{rounded.none}"
    padding: "0 16px"
    height: "40px"
  button-capture-stop:
    backgroundColor: "transparent"
    textColor: "{colors.punch}"
    rounded: "{rounded.none}"
    padding: "0 16px"
    height: "44px"
  chip-idle:
    backgroundColor: "{colors.desk-raised}"
    textColor: "{colors.muted-foreground}"
    rounded: "{rounded.none}"
    padding: "4px 10px"
  chip-ticket:
    backgroundColor: "{colors.ticket}"
    textColor: "{colors.ticket-ink}"
    rounded: "{rounded.none}"
    padding: "4px 10px"
  chip-punch:
    backgroundColor: "{colors.punch}"
    textColor: "{colors.punch-ink}"
    rounded: "{rounded.none}"
    padding: "4px 10px"
  chip-live:
    backgroundColor: "color-mix(in srgb, #3DDC84 15%, transparent)"
    textColor: "{colors.live}"
    rounded: "{rounded.none}"
    padding: "4px 10px"
  input-field:
    backgroundColor: "{colors.field-bg}"
    textColor: "{colors.porcelain-ink}"
    rounded: "{rounded.none}"
    padding: "0 12px"
    height: "44px"
  ticket-stub:
    backgroundColor: "{colors.porcelain}"
    textColor: "{colors.porcelain-ink}"
    rounded: "{rounded.none}"
    padding: "10px 12px 10px 28px"
  guichet-panel:
    backgroundColor: "{colors.porcelain}"
    textColor: "{colors.porcelain-ink}"
    rounded: "{rounded.none}"
  till-banner:
    backgroundColor: "{colors.ticket}"
    textColor: "{colors.ticket-ink}"
    rounded: "{rounded.none}"
    padding: "16px 20px"
  winner-stamp:
    backgroundColor: "{colors.porcelain}"
    textColor: "{colors.porcelain-ink}"
    rounded: "{rounded.none}"
    width: "512px"
---

# Design System: Rollaway

## Overview

**Creative North Star: "The Arcade Ticket Counter"**

Rollaway is a charcoal desk till for Twitch giveaways. Each chat entry becomes a porcelain ticket stub; the yellow draw is the isolated cashier action. The world is physical and square — desk shell, guichet panel, perforated stubs — not a purple SaaS dashboard and not a costume arcade HUD.

Density stays operational: status chips in the top bar, controls in the guichet, stubs stacking in the till. Contrast is hard (porcelain on charcoal, yellow committed fields). Motion is brief and mechanical — stubs slide in, the winner stamp lands.

**Key Characteristics:**
- Charcoal desk shell with porcelain work surfaces
- Ticket yellow reserved for count field and primary draw
- Magenta reserved for active capture only
- Condensed display type for counts and till labels; Source Sans 3 for controls
- Square corners, perforated stub rows, standard web inputs

## Colors

A short, high-contrast till palette: charcoal desk, porcelain paper, ticket yellow as the committed field, magenta as the capture alarm.

### Primary
- **Ticket Yellow** (`ticket`): Committed field for the ticket-count banner and the “Tirer un gagnant” draw CTA. Also marks winner chips/rings. Not decorative fill.

### Secondary
- **Capture Magenta** (`punch`): Active capture only — capture-on chip, “En cours” / “Nouveau” badges, stop-capture outline, newest-stub outline, error alert. Never a general accent wash.

### Tertiary
- **Live Green** (`live`): Connection-on chip only (soft tint + solid text/dot).

### Neutral
- **Charcoal Desk** (`desk`): App shell / page background.
- **Raised Desk** (`desk-raised`): Till list well, idle chip ground.
- **Porcelain** (`porcelain`): Guichet panel and stub paper.
- **Porcelain Ink** (`porcelain-ink`): Text/controls on porcelain.
- **Foreground** (`foreground`): Primary text on desk.
- **Muted / Muted Foreground** (`muted`, `muted-foreground`): Idle chip ground and secondary copy.
- **Border** (`border`): Hairlines on desk surfaces.
- **Field White** (`field-bg`): Input fills inside the guichet.
- **Ticket Ink / Punch Ink** (`ticket-ink`, `punch-ink`): Ink on yellow and magenta fills.

### Named Rules
**The Yellow Field Rule.** Ticket yellow is a committed field for count and draw — never a page wash, card chrome, or decorative accent strip outside those roles.

**The Punch Capture Rule.** Magenta appears only for active capture, capture-adjacent alerts, and the newest stub while capturing. Idle UI stays charcoal / porcelain / yellow.

## Typography

**Display Font:** Barlow Condensed (with ui-sans-serif, system-ui)
**Body Font:** Source Sans 3 (with system-ui, sans-serif)

**Character:** Condensed display type reads as stamped till labels and arcade counts; Source Sans 3 keeps fields and buttons as ordinary working UI.

### Hierarchy
- **Display** (800, clamp ~1.5rem–4.5rem, line-height 1): Ticket count (`ticket-count`, tabular nums, tracking −0.04em), brand wordmark, draw CTA, winner stamp name.
- **Headline** (700, ~1.25rem, tracking wide, uppercase): Guichet and section titles (“Guichet”, “Souches empilées”).
- **Title** (700, ~1.125rem, uppercase): Secondary till headings.
- **Body** (400, 0.875rem): Helper copy, stub usernames (semibold), alerts.
- **Label** (700, 0.75rem, tracking ~0.12em, uppercase): Field labels, status chips, till micro-labels (“Tickets émis”).

### Named Rules
**The Count Face Rule.** Only Barlow Condensed carries ticket counts and till headlines. Controls, body, and field labels stay on Source Sans 3.

## Layout

Desk shell full-bleed (`min-h-dvh`, `bg-desk`). Top bar: brand left, status chips right (`px-4 py-3` / `md:px-6`). Main stage: `max-w-[1440px]`, `gap-4` / `md:gap-5`, `p-4` / `md:p-6`. Desktop is two columns — guichet `minmax(280px, 340px)` left, till well `1fr` right. Mobile stacks till first (`order-1`), guichet second (`order-2`); no bottom nav. Guichet draw zone pins to the panel bottom behind a dashed separator. Till well targets ~52vh mobile / ~70vh desktop.

## Elevation & Depth

Depth is tonal first: desk → raised desk → porcelain paper → yellow field. Shadows are rare and structural — only under the draw CTA and the winner stamp.

### Shadow Vocabulary
- **Draw lift** (`box-shadow: 0 8px 18px rgba(18,20,26,0.28)`): Primary yellow draw button at rest; removed when disabled.
- **Stamp drop** (`box-shadow: 0 18px 40px rgba(0,0,0,0.45)`): Winner reveal dialog over the desk scrim (`bg-desk/85`).
- **Stub yellow spine** (`box-shadow: inset 12px 0 0` ticket at 35% mix): Left edge of `.ticket-stub`, with perforation radial holes into desk.

### Named Rules
**The Flat Desk Rule.** Panels, chips, and fields stay flat. Soft lift shadows exist only on the draw CTA and the winner stamp — never as default card chrome.

## Shapes

Square till language: panels, buttons, chips, inputs, and the stamp use `0` radius. The only round form is the 6px status-chip LED dot (`rounded-full`). Stub silhouette comes from left-edge perforation holes + repeating dashed score + inset yellow spine, not from corner radius. Guichet header sits on a 4px solid ticket-yellow rule. Winner stamp uses a 4px ticket-yellow border.

### Named Rules
**The Square Till Rule.** No soft SaaS rounding on working surfaces. If a control needs a radius to feel “friendly,” it is out of world.

## Components

Working controls are square, standard, and role-colored. Signature pieces are the perforated stub and the yellow draw / stamp.

### Buttons
- **Shape:** Square (`0` radius).
- **Draw (primary):** Full-width, height 64px, ticket yellow fill, display extrabold uppercase; soft draw-lift shadow; hover `brightness(1.05)`; disabled opacity 35%.
- **Desk:** Height 44px, charcoal fill on porcelain, hover raised desk; used for connect and start-capture.
- **Outline / reset:** Hairline porcelain-ink border, transparent fill, height 40–44px.
- **Capture stop:** 2px punch border, punch text, hover punch/10 fill.
- **Stamp close:** Desk fill, display uppercase, height 48px.

### Chips
- **Idle:** Raised desk + border + muted text, uppercase bold xs, LED dot muted.
- **Live active:** Live tint fill + live text/border.
- **Punch active:** Solid punch fill + punch-ink text (capture on).
- **Ticket active:** Solid ticket fill + ticket-ink text (ticket count chip).

### Cards / Containers
- **Guichet:** Porcelain block, square; header with 4px ticket bottom rule; body `p-4` / `space-y-4`; draw zone `mt-auto` behind dashed top border.
- **Till well:** Raised desk, 1px border; yellow till banner on top; stub list scrolls below.
- **No generic elevated cards** — containers are desk materials, not floating product cards.

### Inputs / Fields
- **Style:** White fill, 1px porcelain-ink/15 border, height 44px, square, 12px horizontal padding, 14px text.
- **Label:** Uppercase bold xs, tracking 0.12em, porcelain-ink/55.
- **Focus:** Border shifts to ticket yellow; global focus-visible outline is 2px ticket, offset 2px. Caret is ticket yellow.
- **Disabled:** Opacity ~55%, not-allowed cursor.

### Navigation
- **Top bar only:** Ticket “R” mark (32px square) + display wordmark + optional muted product line; status chips opposite. Footer is quiet credit links (hover ticket), not a nav system. No bottom nav.

### Ticket Stub
Porcelain row with left perforation into desk, dashed score line, inset yellow spine, rank (display tabular), username, optional time, trailing meta (command / Nouveau / Gagnant). Newest stub while capturing gets a punch outline; winner gets a ticket ring.

### Winner Stamp
Fullscreen desk scrim; centered porcelain stamp, max-width ~32rem, 4px ticket border, stamp-drop shadow, `stamp-reveal` animation. Yellow perforated header (“Ticket gagnant” / “Gagnant”), display winner name, desk close button.

## Do's and Don'ts

### Do:
- **Do** keep ticket yellow on the count banner and the isolated draw CTA (Yellow Field Rule).
- **Do** stack participants as perforated porcelain stubs with the yellow left spine.
- **Do** use Barlow Condensed for counts, till titles, draw, and stamp; Source Sans 3 for fields and body.
- **Do** show connection / capture / ticket state as top-bar chips before asking the streamer to hunt for status.
- **Do** respect `prefers-reduced-motion` by killing stub-enter and stamp-reveal animations.

### Don't:
- **Don't** wash screens in purple/indigo Twitch SaaS gradients or card grids.
- **Don't** costume the UI as an arcade HUD (neon frames, fake CRT chrome, sticker clusters).
- **Don't** use magenta as a general brand accent — capture and capture-adjacent only.
- **Don't** round working panels, buttons, chips, or inputs into soft product cards.
- **Don't** scatter soft drop shadows onto every surface; lift is for draw + stamp only.
