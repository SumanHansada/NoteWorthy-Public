import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

/** The app's six note tints. The page borrows whichever one is active. */
export const ACCENTS = [
  // Swatches are the app's own light paper colours (NoteTint.lightBackground,
  // lower stop) so the picker shows the actual note, not an approximation.
  { id: "butter", name: "Butter", swatch: "#F9E48F" },
  { id: "sky", name: "Sky", swatch: "#C7DBF8" },
  { id: "blossom", name: "Blossom", swatch: "#F7C4D2" },
  { id: "mint", name: "Mint", swatch: "#BFE6CE" },
  { id: "lavender", name: "Lavender", swatch: "#DACFF6" },
  { id: "graphite", name: "Graphite", swatch: "#E2E2E7" },
] as const;

export type AccentId = (typeof ACCENTS)[number]["id"];
export type SchemePref = "light" | "dark" | "system";
export type Scheme = "light" | "dark";

type ThemeValue = {
  accent: AccentId;
  setAccent: (a: AccentId) => void;
  pref: SchemePref;
  setPref: (p: SchemePref) => void;
  /** "system" already resolved: what is actually on screen. */
  scheme: Scheme;
};

const ThemeContext = createContext<ThemeValue | null>(null);

const PREF_KEY = "noteworthy-scheme";

function systemScheme(): Scheme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  // A different note colour on every visit, the same delight the app gives
  // when a new note picks its own tint. Deliberately not persisted.
  const [accent, setAccent] = useState<AccentId>(() => {
    // `?accent=mint` pins a colour. It is handy for sharing a particular look and
    // the only way to screenshot a specific one when the default is random.
    const wanted = new URLSearchParams(window.location.search).get("accent");
    if (ACCENTS.some((a) => a.id === wanted)) return wanted as AccentId;
    return ACCENTS[Math.floor(Math.random() * ACCENTS.length)].id;
  });

  // The light/dark choice *is* persisted: a colour surprise is charming, a
  // display mode that forgets itself is not.
  const [pref, setPrefState] = useState<SchemePref>(() => {
    const forced = new URLSearchParams(window.location.search).get("scheme");
    if (forced === "light" || forced === "dark") return forced;
    const saved = localStorage.getItem(PREF_KEY);
    return saved === "light" || saved === "dark" || saved === "system"
      ? saved
      : "system";
  });

  const [resolved, setResolved] = useState<Scheme>(() =>
    pref === "system" ? systemScheme() : pref,
  );

  // Follow the OS live while on "system" so someone with an automatic day/night
  // switch should see the page turn with everything else.
  useEffect(() => {
    if (pref !== "system") {
      setResolved(pref);
      return;
    }
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const sync = () => setResolved(mq.matches ? "dark" : "light");
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, [pref]);

  // Written during render, not in an effect. React runs child effects *before*
  // parent ones, so a child reading `getComputedStyle` in its own effect saw
  // the previous theme's variables, so the hero animation stayed butter while
  // the rest of the page had already turned lavender. Setting the attributes
  // here means they are in place before any child effect runs. Idempotent, and
  // scoped to <html>, so it is safe to repeat on every render.
  if (typeof document !== "undefined") {
    document.documentElement.dataset.accent = accent;
    document.documentElement.dataset.scheme = resolved;
  }

  // The pointer wears the active theme accent color, maintaining crisp shape.
  useEffect(() => {
    const fill =
      getComputedStyle(document.documentElement)
        .getPropertyValue("--accent")
        .trim() || "#C79400";
    const edge = resolved === "dark" ? "#000000" : "#ffffff";

    const cursor = (w: number, h: number, path: string, hx: number, hy: number) =>
      `url("data:image/svg+xml,${encodeURIComponent(
        `<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}' viewBox='0 0 ${w} ${h}'>` +
          `<path d='${path}' fill='${fill}' stroke='${edge}' stroke-width='1.5' ` +
          `stroke-linejoin='round'/></svg>`,
      )}") ${hx} ${hy}`;

    // The familiar arrow with hotspot at tip, tinted with the active accent color
    const arrow = "M4 3 L4 21 L9 16.4 L12.2 22.5 L15 21 L11.9 15.2 L18.5 15.2 Z";

    const root = document.documentElement.style;
    root.setProperty("--cursor-arrow", cursor(24, 24, arrow, 4, 3));
  }, [accent, resolved]);

  useEffect(() => {
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", resolved === "dark" ? "#0d0b06" : "#fbf8f0");
  }, [resolved]);

  const setPref = useCallback((p: SchemePref) => {
    setPrefState(p);
    localStorage.setItem(PREF_KEY, p);
  }, []);

  const value = useMemo(
    () => ({ accent, setAccent, pref, setPref, scheme: resolved }),
    [accent, pref, setPref, resolved],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
}

/** Light / Dark / System, as a three-way segmented control. */
export function SchemeSwitcher() {
  const { pref, setPref } = useTheme();
  const options: { id: SchemePref; label: string; glyph: string }[] = [
    { id: "light", label: "Light", glyph: "☀" },
    { id: "dark", label: "Dark", glyph: "☾" },
    { id: "system", label: "System", glyph: "◐" },
  ];

  return (
    <div
      role="radiogroup"
      aria-label="Color scheme"
      className="flex items-center gap-0.5 rounded-full border border-line bg-bg-soft p-0.5"
    >
      {options.map((o) => (
        <button
          key={o.id}
          role="radio"
          aria-checked={pref === o.id}
          aria-label={o.label}
          title={o.label}
          onClick={() => setPref(o.id)}
          className={`cursor-pointer rounded-full px-2.5 py-1 text-xs transition sm:px-3 sm:py-1.5 ${
            pref === o.id
              ? "bg-accent text-on-accent font-semibold"
              : "text-fg-muted hover:text-fg"
          }`}
        >
          <span aria-hidden>{o.glyph}</span>
          <span className="ml-1 hidden lg:inline">{o.label}</span>
        </button>
      ))}
    </div>
  );
}

/** The six note colours, as pickable swatches. */
export function AccentPicker({ className = "" }: { className?: string }) {
  const { accent, setAccent } = useTheme();
  return (
    <div
      role="radiogroup"
      aria-label="Accent color"
      className={`flex flex-wrap items-center justify-center gap-2.5 ${className}`}
    >
      {ACCENTS.map((a) => (
        <button
          key={a.id}
          role="radio"
          aria-checked={accent === a.id}
          aria-label={a.name}
          title={a.name}
          onClick={() => setAccent(a.id)}
          style={{ background: a.swatch }}
          className={`h-8 w-8 cursor-pointer rounded-full transition sm:h-9 sm:w-9 ${
            accent === a.id
              ? "ring-2 ring-accent ring-offset-2 ring-offset-bg scale-110"
              : "opacity-60 hover:scale-105 hover:opacity-100"
          }`}
        />
      ))}
    </div>
  );
}
