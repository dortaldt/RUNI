import type { MediaSpec } from "./types";

/* ──────────────────────────────────────────────────────────────
   Visual asset registry. THE one place to put images, gifs, videos,
   and embeds that the decks use. Slides reference a slot by id, so
   you edit here once and the deck updates. No hunting through JSX.

   To fill a slot, two ways (either works):
     (a) Drop a file into deck/public/refs/ and set `src: "/refs/<file>"`.
     (b) Paste a remote URL into `src` (images, gifs, .mp4, or a
         YouTube/Vimeo link all work; kind is auto-detected).
   For a video, also set a `poster` still: it shows until the clip
   loads, and it is what prints in the PDF.

   Hand Dor's pasted URL or dropped file straight into the matching
   slot below. Add new slots as `"<week>.<name>"` when new ones appear.
   ────────────────────────────────────────────────────────────── */

/** An asset is a MediaSpec with a required caption (for attribution/alt). */
export type Asset = MediaSpec & { caption: string };

export const assets: Record<string, Asset> = {
  // ── Week 9: Layouts across a flow ──────────────────────────────
  "week9.checkoutFlow": {
    src: "/refs/checkout-flow.svg",
    contain: true, // a flowchart: show the whole story, don't crop
    caption:
      "A checkout flow, mapped before pixels: cart → checkout → sign-in decision → shipping → payment → review → approval (with a retry loop) → confirmed",
  },
  "week9.wireframe": {
    src: "/refs/landing-wireframe.webp",
    contain: true, // grey-box wireframe: show all of it
    aspect: "16/10",
    caption: "A landing page in grey boxes: structure before any visual polish",
  },
  "week9.storyboard": {
    src: "/refs/star-wars-storyboard.jpg",
    contain: true, // rough panels: show the whole sequence
    aspect: "16/10",
    caption:
      "Storyboard for the Death Star trench run in Star Wars: rough panels that plan the whole sequence before a single frame is shot",
    credit: "Lucasfilm",
  },
  "week9.asanaPeak": {
    src: "/refs/asana-celebration.jpeg",
    contain: true,
    aspect: "16/10",
    caption: "Asana celebrates when you clear your tasks: the peak, designed on purpose",
    credit: "Asana",
  },
  "week9.hookModel": {
    src: "/refs/hook-model.png",
    contain: true,
    aspect: "4/3",
    caption: "The Hook Model: trigger → action → variable reward → investment, and around again",
    credit: "Nir Eyal, Hooked (2014)",
  },
  "week9.emailPrototype": {
    src: "/refs/prototype-demo.mp4",
    poster: "/refs/prototype-demo-poster.png",
    contain: true,
    aspect: "16/10",
    caption: "A clickable wireframe prototype in motion: walk it to feel where the flow stalls",
    credit: "Dribbble",
    href: "https://dribbble.com/shots/18405210-Capstone-Project-Email-Client-Wireframe-Prototypes",
  },
  "week9.spotifyFlow": {
    src: "/refs/spotify_flow.mp4",
    contain: true,
    caption: "Spotify, beat by beat: home → playlist → pick a song → it's playing",
    credit: "Spotify",
  },
  "week9.gongFlow": {
    src: "/refs/gong_flow.gif",
    contain: true,
    caption: "Gong, beat by beat: my to-dos → open the account → complete the task → done, next up",
    credit: "Gong",
  },
  "week9.gongTodos": {
    src: "/refs/gong-todos.png",
    contain: true,
    aspect: "16/9",
    caption: "Gong, To-dos",
    credit: "Gong",
  },
  "week9.gongDeals": {
    src: "/refs/gong-deals.png",
    contain: true,
    aspect: "16/9",
    caption: "Gong, Deals: same nav and header, different content",
    credit: "Gong",
  },
  "week9.customerMessage": {
    src: "/refs/realworld-trigger.webp",
    contain: true,
    caption: "The journey starts out in the user's day, phone in hand, before any app opens",
    credit: "Mika Baumeister, Unsplash",
    href: "https://unsplash.com/@mikabaumeister",
  },
  "week9.ipod": {
    src: "/refs/ipod-job.jpg",
    caption: "Apple sold the job: 1,000 songs in your pocket",
    credit: "insung yoon, Unsplash",
    href: "https://unsplash.com/photos/turned-on-white-ipod-classic-JMvfuYiMlJo",
  },
  "week9.flowDemo": {
    src: "/refs/onboarding-flow-microinteractions.mp4",
    poster: "/refs/onboarding-flow-microinteractions.png",
    caption: "One flow in motion: a 12-step onboarding, with a progress bar and microinteractions carrying you from screen to screen",
    credit: "Virgil Pana, Dribbble",
    href: "https://dribbble.com/shots/25845830-Onboarding-flow-with-microinteractions-for-saas-app-dashboard",
  },
  "week9.transition": {
    src: "https://cdn.dribbble.com/userupload/46770976/file/103a25920f355a9587e73c7f91a78868.mp4",
    aspect: "4/3", // matches the clip's native 3324×2494, so no crop or letterbox
    caption: "A checkout in motion: shared elements move from screen to screen, so cart → payment → confirmation feels like one continuous place",
    credit: "Dribbble",
  },
  "week9.stateByState": {
    src: "/refs/state-by-state.mp4",
    aspect: "3112/2160", // clip's native size; keep the ratio so it isn't cropped or letterboxed
    caption: "One screen, every state: empty, loading, error, success, each one designed, not left to chance",
    credit: "Dribbble",
  },
};

/** Look up a slot. Returns an empty captioned asset if the id is unknown,
 *  so a slide renders a tidy placeholder rather than crashing. */
export const asset = (id: string): Asset => assets[id] ?? { caption: "" };
