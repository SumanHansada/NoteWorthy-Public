import type { Scheme } from "./theme";

/**
 * Everything the page says, in one place.
 *
 * House style: short sentences, and almost no em dashes. An earlier draft used
 * one in nearly every paragraph, which reads as a tic rather than as emphasis.
 * Where a dash was doing real work it has become a full stop or a comma.
 */

export const LINKS = {
  // No storefront in the path, so each visitor lands in their own region.
  appStore: "https://apps.apple.com/app/id6799721933",
  // Same listing. On a Mac either link opens the Mac App Store; in a browser
  // elsewhere this one shows the Mac version's page rather than the iPhone's.
  macAppStore: "https://apps.apple.com/app/id6799721933?platform=mac",
  github: "https://github.com/sumanhansada",
  linkedin: "https://www.linkedin.com/in/sumanhansada/",
  x: "https://x.com/SumanHansada",
  // The notarized Mac build as a DMG. GitHub's `latest/download` path follows
  // whichever release is marked Latest, and the file keeps the same name every
  // release, so this never needs changing.
  macDownload:
    "https://github.com/SumanHansada/NoteWorthy-Public/releases/latest/download/NoteWorthy.dmg",
};

// For privacy questions and anything else. Written out in full wherever it
// appears, so it can be copied as well as clicked.
export const CONTACT_EMAIL = "sumansjs@gmail.com";

// The same notarized Mac build is also a Homebrew cask. The qualified name taps
// and installs in one command.
export const BREW_INSTALL = "brew install --cask sumanhansada/tap/noteworthy";

// The Mac app is in review for the Mac App Store, under the same listing as
// the iPhone app (Universal Purchase), so the badge needs no new URL. Flip this
// once the Mac version is live; until then the DMG and Homebrew are the ways
// onto a Mac.
export const MAC_APP_STORE_LIVE = false;

// The 90-second "Everywhere" film: iPhone, then iPad, then Mac. The hero
// loops a muted copy from public/video; these are the YouTube uploads, for
// sound. Wide on desktop, the vertical cut (uploaded as a Short) on phones.
// Both cuts are the same edit to the frame, so a timestamp from one loop is
// the same moment in either upload.
export const FILM = {
  title: "NoteWorthy: AI Notes, Private by Design | iPhone, iPad & Mac",
  wide: {
    youtube: "4ylp5x53fYA",
    src: "video/everywhere-1080.mp4",
    poster: "video/everywhere-poster.webp",
  },
  tall: {
    youtube: "qTsQO3UMi-I",
    src: "video/everywhere-720x1280.mp4",
    poster: "video/everywhere-poster-720x1280.webp",
  },
};

export const PILLARS = [
  { from: 100, to: 0, suffix: "", label: "network requests" },
  { from: 100, to: 0, suffix: "", label: "accounts to create" },
  { from: 0, to: 100, suffix: "%", label: "on your device" },
];

/**
 * Screenshots come in light and dark. The page shows whichever matches the
 * scheme the reader is in, so the shots never look like a different product
 * from the page around them.
 */
export type Device = "iphone" | "ipad" | "mac";

// The Mac shots are WebP: they are wide desktop captures with a soft gradient
// behind the window, which is 2 MB as PNG and under 100 KB as WebP.
export const shot = (scheme: Scheme, name: string, device: Device = "iphone") =>
  `shots/${device}/${scheme}-${name}.${device === "mac" ? "webp" : "png"}`;

export type Feature = {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  points: string[];
  shotName: string;
};

export const FEATURES: Feature[] = [
  {
    id: "start",
    eyebrow: "Getting started",
    title: "It explains itself, then gets out of the way",
    body: "Three screens on first launch: what the labels do, what AI Organize does, and exactly what happens to your writing. Then you are in.",
    points: [
      "No account, no sign-in, no email",
      "Sample notes to poke at, deletable in one tap",
      "The privacy promise stated before you write anything",
    ],
    shotName: "01-welcome",
  },
  {
    id: "write",
    eyebrow: "Write",
    title: "Rich text, with real Markdown underneath",
    body: "Checkboxes, headings, bold and italic, tables and images. You edit it the way you'd expect, and it is stored as Markdown you can take anywhere.",
    points: [
      "Six paper colors",
      "Scan text straight out of a photo",
      "Export any note as Markdown",
    ],
    shotName: "04-new-note",
  },
  {
    id: "ai",
    eyebrow: "AI Format and AI Summarize",
    title: "Jot it messily. Let it become a note.",
    body: "Formatting turns a scrappy line into headings, bullets and checkboxes without changing your wording. Summarizing pulls a page of thinking down to a sentence. You see the result before either touches the note.",
    points: [
      "Preview, then copy, insert or replace",
      "Both run on device, with no network either way",
      "Falls back to fast built-in heuristics on older hardware",
    ],
    shotName: "10-ai-format",
  },
  {
    id: "organize",
    eyebrow: "Let it organize",
    title: "Every note lands where it belongs",
    body: "Notes get a title and file themselves into Tasks, Ideas, Info or Personal. Make your own labels and pin the ones you use to the tab bar.",
    points: [
      "One tap on AI Organize tidies the whole library",
      "Run it twice and nothing moves. Filing reads what is already stored instead of asking a model to guess again.",
      "Custom labels with your own icon and color",
    ],
    shotName: "03-labels",
  },
  {
    id: "everywhere",
    eyebrow: "Everywhere you already are",
    title: "Capture without opening the app",
    body: "Select something in Safari, share it, and it is a note. Siri and Shortcuts do the rest.",
    points: [
      "Five Shortcuts actions. Summarize and Format work on text from any app.",
      "Widgets in four sizes, with checkboxes you can tick without opening anything",
    ],
    shotName: "12-safari-action",
  },
  {
    id: "find",
    eyebrow: "Find it again",
    title: "Search in the app, or from the Home Screen",
    body: "Keyword search inside NoteWorthy, and every note indexed with Spotlight so the system search finds it without opening anything.",
    points: [
      "Highlighted matches, filtered by color",
      "Spotlight results open the note directly",
      "Indexing happens on device, like everything else",
    ],
    shotName: "09-spotlight",
  },
  {
    id: "joined-up",
    eyebrow: "Joined up",
    title: "Your notes know what they contain",
    body: "A date becomes a calendar event. A name links to your contacts. An address opens in Maps. Write \"remind me before Friday\" and the note offers to set one.",
    points: [
      "Detected on device, never uploaded",
      "Nothing happens until you tap it",
      "Reminders arrive as a local notification",
    ],
    shotName: "14-reminder",
  },
  {
    id: "yours",
    eyebrow: "Yours alone",
    title: "Private because it cannot be otherwise",
    body: "There is no server to trust, because the app makes no network requests at all. Privacy here is a property of the build rather than a promise.",
    points: [
      "Lock the app with Face ID",
      "Notes written to disk with file protection",
      "Nothing collected, nothing tracked",
    ],
    shotName: "08-welcome-3",
  },
];

/** The two models, both running locally. */
export const MODELS = [
  {
    vendor: "Apple",
    name: "Foundation Models",
    role: "Writes the words",
    body: "Titles, summaries and the Markdown rewrite come from Apple Intelligence, running on the Neural Engine. Nothing is sent anywhere, and the app has no way to send it.",
    points: ["AI Format", "AI Summarize", "Note titles", "Topic extraction"],
  },
  {
    vendor: "Google",
    name: "EmbeddingGemma 300M",
    role: "Decides where it goes",
    body: "A 300M-parameter embedding model, 4-bit, bundled inside the app and run through MLX. It matches a note to a label by meaning rather than by keyword. Being an embedding model, it can also say that none of them fit.",
    points: ["Semantic filing", "4-bit, on-device", "Loaded lazily", "Never downloads"],
  },
];

/**
 * Decorative notes for the empty half of the page. Real-looking rather than
 * lorem: these are the kinds of things people actually write down, and the
 * point is to make the margins feel like the app.
 */
export const SCATTER = [
  {
    tint: "mint",
    label: "Follow-ups",
    title: "Reply to Theo",
    body: "He sent the signed statement of work on Thursday and it has been sitting all week.",
  },
  {
    tint: "butter",
    label: "Tasks",
    title: "Market",
    todos: [
      { text: "Tomatoes", done: false },
      { text: "Basil", done: true },
      { text: "Sourdough", done: false },
    ],
  },
  {
    tint: "blossom",
    label: "Admin",
    title: "Dentist + insurance",
    todos: [
      { text: "Rebook cleaning", done: false },
      { text: "Check renewal cover", done: false },
    ],
  },
  {
    tint: "sky",
    label: "Travel",
    title: "Pack for Lisbon",
    body: "Passport, chargers, the good sunscreen.",
    remind: "Remind me before Friday?",
  },
  {
    tint: "lavender",
    label: "Ideas",
    title: "Sourdough starter",
    body: "Feed it Saturday morning, bake Sunday.",
  },
];

export const COMING_SOON = [
  {
    title: "iCloud Sync",
    body: "Your notes on every device, through your own iCloud account. Nothing passes through our servers.",
  },
  {
    title: "Shared Notes",
    body: "Hand a note, or a whole label, to someone else over that same private channel.",
  },
];

export const TAGS = [
  "note", "notes", "ai", "markdown", "offline", "private", "checklist",
  "todo", "widget", "shortcuts", "summarize", "organize", "label",
];

/**
 * The privacy policy, in full. It lives on the page rather than behind a link
 * because it is short, and it is short because there is almost nothing to
 * declare. Every claim is checkable against the app: `PrivacyInfo.xcprivacy`
 * declares no collected data, the Mac entitlements carry no network key, and
 * the permissions listed are every usage string in the Info.plists.
 *
 * Change the date whenever the text changes.
 */
export const PRIVACY_UPDATED = "28 September 2026";
export const PRIVACY_CHANGES =
  `If any of this changes, this page changes first, with a new date. Questions about privacy, or anything else: ${CONTACT_EMAIL}.`;

export type PolicyItem = {
  title: string;
  body: string;
  points?: { name: string; why: string }[];
};

export const PRIVACY_POLICY: PolicyItem[] = [
  {
    title: "What the app collects",
    body: "Nothing. There is no account, no analytics, no advertising and no crash reporter of our own. The app makes no network requests, so your notes have nowhere to go. We never see them.",
  },
  {
    title: "Where your notes live",
    body: "On your device, in the app's own storage. On iPhone and iPad they are written with Apple's file protection. On a Mac they stay inside the app's sandbox.",
  },
  {
    title: "Permissions it may ask for",
    body: "The system asks before any of these is used, and you can say no. Nothing read through them leaves your device.",
    points: [
      { name: "Photos", why: "to import an image and pull the text out of it" },
      { name: "Calendar, add only", why: "to add an event for a date in a note. It cannot read your calendar." },
      { name: "Contacts", why: "to link a name in a note to the person" },
      { name: "Face ID or Touch ID", why: "for the optional app lock. The system does the check; the app only learns pass or fail." },
      { name: "Camera", why: "in the App Clip only, to scan text from a photo" },
    ],
  },
  {
    title: "The AI",
    body: "Titles, summaries and formatting come from Apple's Foundation Models. Filing uses an embedding model bundled inside the app. Both run on your device, and neither sends your text anywhere.",
  },
  {
    title: "Apple",
    body: "The App Store handles downloads. If you have chosen to share analytics with app developers in your device's Privacy & Security settings, Apple may pass on anonymous crash reports and usage figures. That is Apple's setting, and it never includes what you wrote.",
  },
  {
    title: "Coming later",
    body: "iCloud Sync and Shared Notes, when they ship, will go through your own iCloud account under Apple's iCloud terms, not through a server of ours. Both are opt-in, and this page will change before they do.",
  },
  {
    title: "This website",
    body: "No cookies and no analytics. Your light or dark choice is kept in your browser's local storage and never leaves it. The film is served from this site, and YouTube is only contacted if you press Watch with sound. The site is hosted by Netlify, which keeps standard server logs. Mac downloads, the DMG and Homebrew alike, come from GitHub.",
  },
];

/**
 * Questions people actually ask about a notes app that says it is offline.
 * Backticks mark a command, rendered as code; [text](url) is a link.
 */
export const FAQ: { q: string; a: string }[] = [
  {
    q: "Is NoteWorthy free?",
    a: "Yes. Everything it does today is free, with no ads and no subscription. iCloud Sync and Shared Notes, when they arrive, will be a single one-time unlock. Everything that happens on your device stays free.",
  },
  {
    q: "What do I need to run it?",
    a: "An iPhone or iPad on iOS or iPadOS 26 or later, or a Mac with Apple silicon on macOS 26 or later. It is one Universal Purchase, so the same app covers all three.",
  },
  {
    q: "Do I need Apple Intelligence?",
    a: "Only for the writing. AI Format, AI Summarize and generated titles use Apple Intelligence, so they need a device that supports it, with it switched on. Without it, NoteWorthy falls back to fast built-in heuristics, and writing, filing and search work just as well.",
  },
  {
    q: "Does it work offline?",
    a: "Always. It never goes online in the first place, so airplane mode changes nothing.",
  },
  {
    q: "How can I check that it makes no network requests?",
    a: "On a Mac the app is sandboxed without the network entitlement, so macOS itself would refuse any connection. To see it for yourself, run `codesign -d --entitlements - /Applications/NoteWorthy.app` and the list shows the sandbox and no network key. On iPhone and iPad, turn on App Privacy Report under Settings, Privacy & Security, and NoteWorthy never shows up under network activity.",
  },
  {
    q: "Do my notes sync between devices?",
    a: "Not yet. iCloud Sync is coming, through your own iCloud account rather than a server of ours. Until then each device keeps its own notes, and you can move one across by exporting it as Markdown.",
  },
  {
    q: "Can I take my notes somewhere else?",
    a: "Yes. Notes are stored as Markdown, and any note exports as Markdown that opens in any other editor.",
  },
  {
    q: "How do I install it on a Mac?",
    a: MAC_APP_STORE_LIVE
      ? `From the Mac App Store, under the same listing as the iPhone app. The same app is also a [direct download](${LINKS.macDownload}), and on Homebrew: \`${BREW_INSTALL}\``
      : `The Mac version is in review for the Mac App Store. Until it clears, [download the DMG](${LINKS.macDownload}), open it and drag NoteWorthy to Applications. Or install the same notarized build with Homebrew: \`${BREW_INSTALL}\``,
  },
  {
    q: "Can I lock my notes?",
    a: "Yes. Turn on the app lock under Settings, Privacy, and NoteWorthy asks for Face ID or Touch ID before showing your notes. If that fails, your device passcode works too.",
  },
  {
    q: "Who makes NoteWorthy?",
    a: `Suman Hansada, an independent developer. Write to ${CONTACT_EMAIL}, or say hello on X or GitHub, linked at the bottom of the page.`,
  },
];
