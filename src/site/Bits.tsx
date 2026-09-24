import { useEffect, useRef, useState } from "react";
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
 */
export function AppStoreBadge({ className = "" }: { className?: string }) {
  const { scheme } = useTheme();
  const dark = scheme === "dark";
  const bg = dark ? "#FFFFFF" : "#000000";
  const ink = dark ? "#000000" : "#FFFFFF";
  const edge = dark ? "#00000022" : "#FFFFFF33";

  return (
    <svg
      viewBox="0 0 120 40"
      role="img"
      aria-label="Download on the App Store"
      className={className}
    >
      <rect x="0.5" y="0.5" width="119" height="39" rx="8.5" fill={bg} stroke={edge} />
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
        App Store
      </text>
    </svg>
  );
}
