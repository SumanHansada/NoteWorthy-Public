import { useEffect, useRef, useState } from "react";
import { LINKS } from "./data";
import { useTheme } from "./theme";

/**
 * A number that counts to its value when it scrolls into view.
 *
 * The two zeros count *down* from a hundred and the percentage counts *up*,
 * so the trio reads as "all of this went away, and all of that stayed here".
 */
export function CountUp({
  from,
  to,
  suffix = "",
  duration = 1400,
}: {
  from: number;
  to: number;
  suffix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(from);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setValue(to);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting || started.current) return;
        started.current = true;
        const t0 = performance.now();
        const tick = (now: number) => {
          const p = Math.min(1, (now - t0) / duration);
          // Ease out: the number should land softly rather than stop dead.
          const eased = 1 - Math.pow(1 - p, 3);
          setValue(Math.round(from + (to - from) * eased));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [from, to, duration]);

  // Tabular figures, or the width jitters as the digits change.
  return (
    <span ref={ref} className="tabular-nums">
      {value}
      {suffix}
    </span>
  );
}

/**
 * Card colours for the scattered decoration.
 *
 * A static map rather than the CSS variables, because these show all six tints
 * at once while the variables only ever hold the one the page is wearing.
 * Values are the same ones from NoteTint.swift.
 */
const TINTS: Record<string, { light: string; dark: string; fgLight: string; fgDark: string; dot: string }> = {
  butter:   { light: "#F9E48F", dark: "#3A3312", fgLight: "#4A3B00", fgDark: "#F6E9A8", dot: "#C79400" },
  sky:      { light: "#C7DBF8", dark: "#0F1F3D", fgLight: "#12335F", fgDark: "#B8D0F5", dot: "#2E6FD8" },
  blossom:  { light: "#F7C4D2", dark: "#3D0D1E", fgLight: "#5F1730", fgDark: "#F5B8CC", dot: "#D64570" },
  mint:     { light: "#BFE6CE", dark: "#0A2819", fgLight: "#0F3D24", fgDark: "#A8E0C0", dot: "#1F8A5B" },
  lavender: { light: "#DACFF6", dark: "#1C1040", fgLight: "#2E1D66", fgDark: "#C8B8F0", dot: "#7C5CD9" },
  graphite: { light: "#E2E2E7", dark: "#1C1C22", fgLight: "#1C1C1F", fgDark: "#EDEDF0", dot: "#6E6E76" },
};

export type ScatterNote = {
  tint: string;
  label: string;
  title: string;
  body?: string;
  todos?: { text: string; done: boolean }[];
  remind?: string;
};

/** One note, drawn the way the app draws it. */
export function NoteCard({ note, className = "" }: { note: ScatterNote; className?: string }) {
  const { scheme } = useTheme();
  const t = TINTS[note.tint] ?? TINTS.butter;
  const bg = scheme === "dark" ? t.dark : t.light;
  const fg = scheme === "dark" ? t.fgDark : t.fgLight;

  return (
    <div
      // A sticky is taller than it is wide. Content alone left them
      // squat and wide, which read as a table cell.
      className={`flex min-h-[9.5rem] flex-col rounded-2xl p-4 shadow-[var(--shadow)] ${className}`}
      style={{ background: bg, color: fg }}
      aria-hidden
    >
      <div className="flex items-center gap-2 border-b pb-2" style={{ borderColor: `${fg}22` }}>
        <span className="h-2 w-2 rounded-full" style={{ background: t.dot }} />
        <span className="text-[0.6rem] font-semibold tracking-[0.12em] uppercase" style={{ opacity: 0.7 }}>
          {note.label}
        </span>
      </div>

      <h4 className="mt-2.5 text-sm font-bold">{note.title}</h4>

      {note.body && (
        <p className="mt-1.5 text-xs leading-relaxed" style={{ opacity: 0.85 }}>
          {note.body}
        </p>
      )}

      {note.todos && (
        <ul className="mt-2 space-y-1.5">
          {note.todos.map((td) => (
            <li key={td.text} className="flex items-center gap-2 text-xs">
              <span
                className="grid h-3.5 w-3.5 shrink-0 place-items-center rounded-[4px] border text-[8px]"
                style={{
                  borderColor: `${fg}88`,
                  background: td.done ? t.dot : "transparent",
                  color: "#fff",
                }}
              >
                {td.done ? "✓" : ""}
              </span>
              <span style={{ textDecoration: td.done ? "line-through" : undefined, opacity: td.done ? 0.55 : 1 }}>
                {td.text}
              </span>
            </li>
          ))}
        </ul>
      )}

      {/* The reminder offer, as it appears on a real note. */}
      {note.remind && (
        <div
          className="mt-3 flex items-center justify-between rounded-lg px-2.5 py-1.5 text-[0.65rem]"
          style={{ background: `${fg}12` }}
        >
          <span className="flex items-center gap-1.5">
            <span style={{ color: t.dot }}>✦</span> {note.remind}
          </span>
          <span className="rounded-full px-2 py-0.5 font-semibold" style={{ background: t.dot, color: "#fff" }}>
            Yes
          </span>
        </div>
      )}
    </div>
  );
}

/**
 * "Download on the App Store", inline rather than an <img>.
 *
 * Apple ships the badge black-on-light and white-on-dark, and the page flips
 * between the two on a toggle that is not the OS setting, so one static file
 * would be wrong in one of the schemes. Proportions follow Apple's badge.
 * `mac` draws the Mac App Store variant, which is the same artwork made wider
 * for the longer name.
 */
export function AppStoreBadge({ className = "", mac = false }: { className?: string; mac?: boolean }) {
  const { scheme } = useTheme();
  const dark = scheme === "dark";

  // Apple's own artwork for the App Store badge, in both colourways: black on
  // the light page, white on the dark one. The Mac badge has no file of its
  // own yet, so it stays drawn below.
  if (!mac) {
    return (
      <img
        src={`badges/app-store-${dark ? "white" : "black"}.svg`}
        alt="Download on the App Store"
        className={className}
      />
    );
  }

  const bg = dark ? "#FFFFFF" : "#000000";
  const ink = dark ? "#000000" : "#FFFFFF";
  const edge = dark ? "#00000022" : "#FFFFFF33";

  return (
    <svg
      viewBox={`0 0 ${mac ? 156 : 120} 40`}
      role="img"
      aria-label={`Download on the ${mac ? "Mac App Store" : "App Store"}`}
      className={className}
    >
      <rect x="0.5" y="0.5" width={mac ? 155 : 119} height="39" rx="8.5" fill={bg} stroke={edge} />
      <g transform="translate(6 3) scale(1.2)" fill={ink}>
        <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
      </g>
      <text
        x="35"
        y="13.2"
        fill={ink}
        fontSize="9.2"
        fontFamily="-apple-system, BlinkMacSystemFont, 'Helvetica Neue', Helvetica, Arial, sans-serif"
      >
        Download on the
      </text>
      <text
        x="34.5"
        y="31.2"
        fill={ink}
        fontSize="17.5"
        fontWeight="400"
        fontFamily="-apple-system, BlinkMacSystemFont, 'Helvetica Neue', Helvetica, Arial, sans-serif"
      >
        {mac ? "Mac App Store" : "App Store"}
      </text>
    </svg>
  );
}

/**
 * The launch badges, Product Hunt and Peerlist Launchpad, with their live
 * vote counts.
 *
 * Both sites draw them in two colourways, so they follow the page's scheme the
 * same way the App Store badge does rather than the OS setting. Each badge
 * keeps its own artwork's proportions, so only the height is set here.
 */
export function LaunchBadges({ className = "", badgeClassName = "" }: { className?: string; badgeClassName?: string }) {
  const { scheme } = useTheme();
  const badges = [
    {
      href: LINKS.productHunt,
      src: `${LINKS.productHuntBadge}${scheme}`,
      label: "NoteWorthy on Product Hunt",
      alt: "NoteWorthy - Notes supercharged with AI, all on-device | Product Hunt",
    },
    {
      href: LINKS.peerlist,
      src: `${LINKS.peerlistBadge}${scheme}`,
      label: "NoteWorthy on Peerlist Launchpad",
      alt: "NoteWorthy — Smart notes, entirely on-device, on Peerlist Launchpad",
    },
  ];

  return (
    <div className={className}>
      {badges.map((b) => (
        <a
          key={b.href}
          href={b.href}
          target="_blank"
          rel="noreferrer noopener"
          aria-label={b.label}
          className={`block transition hover:opacity-85 ${badgeClassName}`}
        >
          <img src={b.src} alt={b.alt} className="block h-full w-auto" />
        </a>
      ))}
    </div>
  );
}

/**
 * A one-line shell command with a copy button.
 *
 * The button says "Copied" for a moment rather than toasting, so there is
 * nothing to dismiss. If the clipboard is refused (an insecure context, a
 * denied permission) the text is still selectable by hand.
 */
export function CopyCommand({ command, className = "" }: { command: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1600);
    return () => clearTimeout(t);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
    } catch {
      // Leave the command on screen for a manual copy.
    }
  };

  return (
    <div
      className={`flex max-w-full items-center gap-2 rounded-xl border border-line bg-bg-soft py-1.5 pr-1.5 pl-3.5 ${className}`}
    >
      <code className="min-w-0 overflow-x-auto font-mono text-xs whitespace-nowrap text-fg sm:text-sm">
        <span aria-hidden className="text-fg-faint select-none">$ </span>
        {command}
      </code>
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? "Copied" : "Copy command"}
        title={copied ? "Copied" : "Copy"}
        className="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-lg text-accent-ink transition hover:bg-bg"
      >
        {/* The usual two overlapping squares, turning to a tick once copied.
            The label above still says which, for VoiceOver. */}
        <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          {copied ? (
            <path d="M3.5 8.5 6.5 11.5 12.5 4.5" />
          ) : (
            <>
              <rect x="5.5" y="5.5" width="8" height="8" rx="1.75" />
              <path d="M10.5 5.5V3.75c0-.69-.56-1.25-1.25-1.25h-5.5c-.69 0-1.25.56-1.25 1.25v5.5c0 .69.56 1.25 1.25 1.25H5.5" />
            </>
          )}
        </svg>
        <span aria-live="polite" className="sr-only">{copied ? "Copied" : ""}</span>
      </button>
    </div>
  );
}
