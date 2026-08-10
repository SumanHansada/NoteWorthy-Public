import type { Scheme } from "./theme";

/**
 * Everything the page says, in one place.
 *
 * House style: short sentences, and almost no em dashes. An earlier draft used
 * one in nearly every paragraph, which reads as a tic rather than as emphasis.
 * Where a dash was doing real work it has become a full stop or a comma.
 */

export const LINKS = {
  github: "https://github.com/sumanhansada",
  linkedin: "https://www.linkedin.com/in/sumanhansada/",
  x: "https://x.com/SumanHansada",
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
export const shot = (scheme: Scheme, name: string, device: "iphone" | "ipad" = "iphone") =>
  `shots/${device}/${scheme}-${name}.png`;

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
