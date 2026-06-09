# Reference visuals

Drop image files here and they appear automatically in the deck (and the PDF). The
`GallerySlide` / `RefImage` components look for files by the exact `src` path you pass, e.g.
`src="/refs/pnc-button-inventory.jpg"` -> `public/refs/pnc-button-inventory.jpg`. Until a file
exists, the slide shows a tidy placeholder naming the file to add, so nothing breaks.

## Adding motion: gifs, videos, and embeds (via the `Media` component)
The `Media` / `MediaSlide` / `SplitMediaSlide` components accept a **URL or a local `/refs` file** and
render the right thing automatically:
- A `.gif`, `.png`, or `.jpg` -> image. A `.mp4` / `.webm` / `.mov` -> autoplaying, looping, muted video.
  A YouTube or Vimeo link -> a responsive embed. No config needed, just pass the `src`.
- Two ways to add: (a) paste a remote URL straight into the slide data, or (b) drop a file here and
  reference it as `/refs/<name>`.
- For video, also pass a `poster` still. The slot shows the poster until the clip exists, then plays it.
  The poster is also what prints (video can't print).

Open media slots (poster shows now; add the clip to make it move):
- `skeleton-loading-demo.mp4` (Week 7 deck) -> a skeleton resolving into content. Poster is
  `skeleton-loading-finance.png`. Add an .mp4/.gif here, or swap the slide's `src` for a URL.
- `flow-transition-demo.mp4` (Week 9 deck) -> a screen-to-screen transition (a card opening into a
  full page). Poster falls back to `skeleton-loading-finance.png`. Add a real product clip or paste a
  URL on the "Continuity in motion" slide.

## The asset registry (the one place to add visuals)
Slides no longer hardcode image paths. They read from `deck/src/content/assets.ts`, a registry keyed by
slot id (e.g. `week9.journeyMap`). To fill a slot, edit that one file: either set `src` to a dropped
file here (`/refs/<name>`) or paste a remote URL (image, gif, .mp4, or YouTube/Vimeo all auto-detect).
Hand Dor's pasted URL or dropped file straight into the matching slot.

Week 9 slots (in `assets.ts`) and the files they expect if you drop locally:
- `week9.journeyMap` -> `journey-map-example.png`. A real journey map (phases, actions, mindset, emotion
  line). Source: Ekaterina Mogilnikova, Dribbble (dribbble.com/shots/10774638-Customer-Journey-Map-UX-Research).
- `week9.onboardingFlow` -> `onboarding-flow-sequence.png`. An onboarding flow in sequence, progress
  shown. Source: Octet Design Studio (dribbble.com/shots/19444015-SaaS-App-Sign-Up-and-Onboarding-Flow-UI-Design-Animation).
- `week9.crossScreen` -> `cross-screen-consistency.png`. One app across screens, same shell. Source: a
  real set from Mobbin (Gmail, Linear, Stripe).
- `week9.transition` -> `flow-transition-demo.mp4`. A screen-to-screen transition. Poster falls back to
  `skeleton-loading-finance.png`.

NOTE (2026-06-07): auto-fetching Dribbble currently fails. The AWS WAF challenge now also blocks the
r.jina.ai reader-proxy and WebFetch (both return the WAF page, not the shot). Until that changes, fill
these by hand: open the shot link, save the image into this folder under the exact filename above, or
paste a direct image URL into the slide's `src`. Google AI Studio raster is the other approved source.

## "Design sprint (ish)" workshop deck (resolved, real images)
The interface-inventory gallery ships three real, attributed images, framed as problem then system:
- `pnc-button-inventory.jpg` -> PNC's many inconsistent button styles on one site.
  Source: Brad Frost, Interface Inventory (https://bradfrost.com/blog/post/interface-inventory/).
- `dribbble-component-sheet.png` -> a real design-system button sheet: one button, every state and
  variant, defined once. Source: Shitij Nain, Dribbble
  (https://dribbble.com/shots/21073052-Design-System-Component-Buttons).
- `button-system-cheatsheet.png` -> one button across the full set (filled, outlined, text, disabled,
  FAB), the emphasis ladder defined once. Source: Roman Kamushken for Setproduct, Dribbble
  (https://dribbble.com/shots/14797587-Material-design-buttons-UI-Figma-templates).

Two activity slides now carry a reference visual beside their steps (via the `ActivitySlide` `figure`
prop, two-column layout):
- `ux-audit-case-study.png` -> a real checkout UX audit: the 10 heuristics run on the flow, issues
  plotted and ranked by severity (a worked artifact, not a blank template). Beside Activity 2's steps.
  Source: Stanislav Stefaniuk, Dribbble (https://dribbble.com/shots/20945867--2020-UX-Audit-Case-Study).
  (Replaced the earlier `heuristic-eval-template.png` template-advert shot.)
- `crazy8s-sketch-sheet.jpg` -> eight rough screens sketched fast, quantity over polish (Activity 3,
  beside the 8-box worksheet). Source: Ignacio Valdes, Dribbble
  (https://dribbble.com/shots/4008877-Crazy-Eights-Exercise).

The pattern-audit "what good patterns look like" gallery uses three more real Dribbble shots:
- `empty-state-traveloka.png` -> empty/error states that name the problem and give a next step.
  Source: Steve Lianardo for Traveloka (https://dribbble.com/shots/2419464-Empty-state-illustration-mobile-web).
- `form-field-states.png` -> input fields across every state, with an inline error in plain language.
  Source: Steven Striegel (https://dribbble.com/shots/3523742-Inline-Form-Validation).
- `skeleton-loading-finance.png` -> a skeleton on load instead of a blank screen.
  Source: Isaac Sanchez (https://dribbble.com/shots/12105359-Skeleton-Loading-for-a-Finance-App).

## Pulling images from Dribbble (the working method)
Dribbble puts an AWS WAF JS challenge on its HTML pages (`dribbble.com` answers bots with an empty
202), but `cdn.dribbble.com` is NOT challenged. So:
1. Get the shot's real hero URL without touching the WAF. A rendering reader-proxy works:
   `curl -H "X-Return-Format: html" "https://r.jina.ai/https://dribbble.com/shots/<id-slug>"`
   then grep `og:image` for the `cdn.dribbble.com/userupload/.../original-*.png?...resize=1600x1200` URL.
2. Download straight from the CDN with a browser UA and `Referer: https://dribbble.com/`.
3. Verify the image is actually the shot (the proxy also lists sidebar "More by" shots), grab the
   author for attribution, and keep that credit on the slide. These are others' work, shown as
   teaching references.
Openly hosted canonical sources (Brad Frost, NN/g, platform docs) can be pulled directly, no proxy.
