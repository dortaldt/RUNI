# Reference visuals

Drop image files here and they appear automatically in the deck (and the PDF). The
`GallerySlide` / `RefImage` components look for files by the exact `src` path you pass, e.g.
`src="/refs/pnc-button-inventory.jpg"` -> `public/refs/pnc-button-inventory.jpg`. Until a file
exists, the slide shows a tidy placeholder naming the file to add, so nothing breaks.

## "Design sprint (ish)" workshop deck (resolved, real images)
The interface-inventory gallery ships two real, attributed images, framed as a before/after:
- `pnc-button-inventory.jpg` -> PNC's many inconsistent button styles on one site.
  Source: Brad Frost, Interface Inventory (https://bradfrost.com/blog/post/interface-inventory/).
- `dribbble-component-sheet.png` -> a real design-system button sheet: one button, every state and
  variant, defined once. Source: Shitij Nain, Dribbble
  (https://dribbble.com/shots/21073052-Design-System-Component-Buttons).

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
