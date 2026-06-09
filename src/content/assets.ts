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
  "week9.journeyMap": {
    src: "/refs/nng-journey-map.png",
    contain: true, // a dense, wide chart: show all of it, don't crop
    caption:
      "A customer journey map: \"Jumping Jamie\" switching mobile plans. Phases across the top; actions, thoughts, and an emotion line below; opportunities at the bottom",
    credit: "Nielsen Norman Group",
    href: "https://www.nngroup.com/articles/journey-mapping-101/",
  },
  "week9.loginFlow": {
    src: "/refs/login-signup-flow.webp",
    contain: true, // a dense chart: show all of it, don't crop
    caption: "A login and signup flow chart: the happy path, the branches, the dead ends",
    credit: "Dribbble", // TODO: confirm the author's name for attribution
    href: "https://dribbble.com/shots/25331267-User-Flow-For-Mobile-App-Login-Signup",
  },
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
  "week9.storyFlow": {
    src: "/refs/salesforce-flow.webp", // TODO: drop a Salesforce lead→close flow (Mobbin) here
    contain: true,
    aspect: "4/3", // near-square shot; fills the side-by-side column
    caption: "A real flow, screen by screen: a Salesforce rep turns a new lead into a closed deal",
    credit: "add a real set (Salesforce via Mobbin)",
  },
  "week9.asanaPeak": {
    src: "/refs/asana-celebration.jpeg",
    contain: true,
    aspect: "16/10",
    caption: "Asana celebrates when you clear your tasks: the peak, designed on purpose",
    credit: "Asana",
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
  "week9.graffiti": {
    src: "/refs/berlin-graffiti.jpg",
    caption: "Spotting this is the trigger to post it; the likes are the reward. The loop starts out here, in the user's world, before any app opens.",
    credit: "Rikin Katyal, Unsplash",
    href: "https://unsplash.com/photos/a-wall-with-graffiti-ILxNUIvDetM",
  },
  "week9.customerMessage": {
    src: "/refs/customer-message.png", // drop a phone DM / inbox screenshot: a customer asking about an order
    contain: true,
    caption: "The trigger: a customer's question lands, before the app is even open",
    credit: "add a real screenshot",
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
    src: "/refs/flow-transition-demo.mp4",
    poster: "/refs/skeleton-loading-finance.png",
    caption: "A screen-to-screen transition (drop a clip or paste a URL to play it live)",
    credit: "add a real product clip",
  },
};

/** Look up a slot. Returns an empty captioned asset if the id is unknown,
 *  so a slide renders a tidy placeholder rather than crashing. */
export const asset = (id: string): Asset => assets[id] ?? { caption: "" };
