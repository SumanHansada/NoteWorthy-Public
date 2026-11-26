import { useEffect, useState } from "react";
import { ClassicNoteCard, NoteCard } from "./Bits";
import { SCATTER } from "./data";
import { SchemeSwitcher, useTheme } from "./theme";

/** The app mark, in the icon variant that matches the page's scheme. */
export function Mark({ className = "" }: { className?: string }) {
  const { scheme } = useTheme();
  return <img src={`icons/mark-${scheme}.svg`} alt="" className={className} />;
}

const SECTIONS = [
  { id: "features", label: "Features" },
  { id: "models", label: "On-Device AI" },
  { id: "screens", label: "Screens" },
  { id: "privacy", label: "Privacy" },
  { id: "soon", label: "Coming Soon" },
  { id: "faq", label: "FAQ" },
];

/**
 * The section the reader is in: the last one whose top has passed a line a
 * third of the way down the screen. Recomputed on scroll rather than with an
 * IntersectionObserver because `#screens` sits inside `#features`, and "the
 * last one past the line" handles the nesting without special cases.
 */
function useActiveSection() {
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const line = window.innerHeight / 3;
      let current: string | null = null;
      for (const { id } of SECTIONS) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) current = id;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);
  return active;
}

export function Nav() {
  const active = useActiveSection();
  const [open, setOpen] = useState(false);

  // Escape closes the menu, and so does growing the window past the point
  // where the inline links take over.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const wide = window.matchMedia("(min-width: 1024px)");
    const onWide = () => wide.matches && setOpen(false);
    window.addEventListener("keydown", onKey);
    wide.addEventListener("change", onWide);
    return () => {
      window.removeEventListener("keydown", onKey);
      wide.removeEventListener("change", onWide);
    };
  }, [open]);

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-line bg-bg/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-8">
        <a href="#top" onClick={() => setOpen(false)} className="flex shrink-0 items-center gap-2.5">
          <Mark className="h-8 w-8 rounded-lg sm:h-9 sm:w-9" />
          <span className="font-semibold tracking-tight sm:text-lg">NoteWorthy</span>
        </a>

        <div className="hidden items-center gap-7 text-sm text-fg-muted lg:flex">
          {SECTIONS.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              aria-current={active === s.id ? "location" : undefined}
              className={`transition hover:text-fg ${active === s.id ? "font-semibold text-fg" : ""}`}
            >
              {s.label}
            </a>
          ))}
        </div>

        {/* No download button up here: the hero's badge, DMG and Homebrew
            command are the ways in, and a fourth one in the bar was noise. */}
        <div className="flex items-center gap-2">
          <SchemeSwitcher />
          {/* Below `lg` the six links do not fit, so they fold into a menu
              rather than leaving a phone with nothing but the scroll. */}
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="section-menu"
            onClick={() => setOpen((o) => !o)}
            className={`relative h-9 w-9 cursor-pointer rounded-full border transition duration-300 active:scale-90 lg:hidden ${
              open
                ? "border-accent bg-accent text-on-accent"
                : "border-line bg-bg-soft text-fg hover:border-accent"
            }`}
          >
            {/* Three bars that fold into a cross: the outer two meet in the
                middle and turn, the middle one shrinks away. The easing
                overshoots a touch so the cross settles like a spring. */}
            {[
              open ? "translate(-50%, -50%) rotate(45deg)" : "translate(-50%, calc(-50% - 5px))",
              open ? "translate(-50%, -50%) scaleX(0)" : "translate(-50%, -50%)",
              open ? "translate(-50%, -50%) rotate(-45deg)" : "translate(-50%, calc(-50% + 5px))",
            ].map((transform, i) => (
              <span
                key={i}
                aria-hidden
                style={{ transform, opacity: open && i === 1 ? 0 : 1 }}
                className="absolute top-1/2 left-1/2 h-[1.75px] w-4 rounded-full bg-current transition-[transform,opacity] duration-400 ease-[cubic-bezier(0.3,1.35,0.5,1)]"
              />
            ))}
          </button>
        </div>
      </div>

      {/* Always mounted so it can animate both ways. Tapping anywhere below
          the menu dismisses it. Absolute rather than fixed: the bar's
          backdrop-filter makes it the containing block for fixed children
          anyway. */}
      <div
        aria-hidden
        onClick={() => setOpen(false)}
        className={`absolute inset-x-0 top-full h-screen bg-black/20 transition-opacity duration-300 lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      {/* Height animates through the grid-rows trick: 0fr to 1fr is the one
          way to transition to an unknown height without measuring it. */}
      <div
        id="section-menu"
        inert={!open}
        className={`grid transition-[grid-template-rows] duration-400 ease-[cubic-bezier(0.2,0.9,0.3,1)] lg:hidden ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div
            className={`border-t border-line bg-bg px-4 pt-2 pb-4 transition-shadow duration-300 sm:px-8 ${
              open ? "shadow-[var(--shadow)]" : ""
            }`}
          >
            <ul className="mx-auto grid max-w-6xl grid-cols-2 gap-2">
              {SECTIONS.map((s, i) => (
                <li
                  key={s.id}
                  // Each link drops in a beat after the one before it on the
                  // way open, and they all leave together on the way closed.
                  style={{ transitionDelay: open ? `${80 + i * 35}ms` : "0ms" }}
                  className={`transition duration-300 ease-out ${
                    open ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
                  }`}
                >
                  <a
                    href={`#${s.id}`}
                    onClick={() => setOpen(false)}
                    aria-current={active === s.id ? "location" : undefined}
                    className={`block rounded-xl border px-4 py-3 text-sm font-medium transition active:scale-[0.97] ${
                      active === s.id
                        ? "border-accent bg-accent text-on-accent"
                        : "border-line bg-bg-raised text-fg hover:border-accent"
                    }`}
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}


/**
 * Classic and modern notes down both sides of the whole page, behind
 * everything.
 *
 * One layer for the page (see App) rather than one per section, so the notes
 * run unbroken from the hero to the footer. It is `z-index: -1` inside an
 * isolated wrapper: above the page's background, below every section's
 * content. A section with a solid band (Models, Privacy) simply covers them.
 *
 * They are laid out in pixels, not percentages, so the density is the same on
 * a short page and a long one, and the layer clips whatever runs past the end.
 * Width follows the gutter beside the 72rem column, the window edge crops
 * them, and the set is hidden below 1400px where there is no gutter.
 *
 * Cheap on purpose: no blur, no shadow, and it animates `transform` alone
 * (see `.note-drift`).
 */
const NOTE_PITCH = 540; // px between notes down one side
const NOTE_ROWS = 26; // enough for a very long page; the layer clips the rest
const TILTS = [-4, 3, 2.5, -3, -2, 3.5, 3, -2.5, 4, -3.5];
const INSETS = ["-1rem", "-1.75rem", "-0.5rem", "-1.25rem"];

export function PageNotes({ notes = SCATTER }: { notes?: typeof SCATTER }) {
  const items = Array.from({ length: NOTE_ROWS * 2 }, (_, k) => {
    const side = k % 2 === 0 ? "left" : "right";
    const row = Math.floor(k / 2);
    return {
      side,
      // The right-hand column sits half a pitch down from the left, so the
      // two sides never line up.
      top: 40 + row * NOTE_PITCH + (side === "right" ? NOTE_PITCH / 2 : 0),
      tilt: TILTS[(k * 3) % TILTS.length],
      inset: INSETS[(k * 5) % INSETS.length],
      far: k % 3 === 1,
      // Down each side the two looks alternate, so the margins carry both.
      modern: Math.floor(k / 2) % 2 === 1,
      dur: 10 + ((k * 7) % 5),
      delay: -((k * 3) % 11),
      note: notes[(k * 3 + (side === "right" ? 1 : 0)) % notes.length],
    } as const;
  });

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 hidden overflow-hidden min-[1400px]:block"
      style={{ zIndex: -1 }}
    >
      {items.map((n) => (
        <div
          key={`${n.side}-${n.top}`}
          className="absolute"
          style={{
            top: n.top,
            [n.side]: n.inset,
            width: "min(16rem, calc((100vw - 72rem) / 2 + 1.25rem))",
            // Depth without blur: the far ones are fainter and a little
            // smaller, and sit under the near ones.
            opacity: n.far ? 0.78 : 1,
            zIndex: n.far ? 0 : 1,
            scale: n.far ? "0.93" : undefined,
          }}
        >
          <div
            className="note-drift"
            style={
              {
                "--r": `${n.tilt}deg`,
                "--d": `${n.dur}s`,
                "--dl": `${n.delay}s`,
              } as React.CSSProperties
            }
          >
            {n.modern ? (
              <NoteCard note={n.note} className="!shadow-none" />
            ) : (
              <ClassicNoteCard note={n.note} />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
