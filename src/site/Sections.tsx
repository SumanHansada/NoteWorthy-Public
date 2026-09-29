import { useEffect, useState, type ReactNode } from "react";
import { NoteCard } from "./Bits";
import { DeviceMock } from "./DeviceMock";
import {
  CONTACT_EMAIL,
  COMING_SOON,
  FAQ,
  FEATURES,
  LINKS,
  MODELS,
  PRIVACY_CHANGES,
  PRIVACY_POLICY,
  PRIVACY_UPDATED,
  SCATTER,
  TAGS,
} from "./data";
import { SchemeSwitcher, useTheme } from "./theme";

/** The app mark, in the icon variant that matches the page's scheme. */
function Mark({ className = "" }: { className?: string }) {
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
            className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-line bg-bg-soft text-fg transition hover:border-accent lg:hidden"
          >
            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden>
              {open ? (
                <path d="M5 5l10 10M15 5L5 15" />
              ) : (
                <path d="M3.5 6h13M3.5 10h13M3.5 14h13" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <>
          {/* Tapping anywhere below the menu dismisses it. Absolute rather
              than fixed: the bar's backdrop-filter makes it the containing
              block for fixed children anyway. */}
          <div
            aria-hidden
            onClick={() => setOpen(false)}
            className="absolute inset-x-0 top-full h-screen bg-black/20 lg:hidden"
          />
          <div
            id="section-menu"
            className="relative border-t border-line bg-bg px-4 pt-2 pb-4 shadow-[var(--shadow)] sm:px-8 lg:hidden"
          >
            <ul className="mx-auto grid max-w-6xl grid-cols-2 gap-2">
              {SECTIONS.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    onClick={() => setOpen(false)}
                    aria-current={active === s.id ? "location" : undefined}
                    className={`block rounded-xl border px-4 py-3 text-sm font-medium transition ${
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
        </>
      )}
    </nav>
  );
}

export function Features() {
  return (
    <section
      id="features"
      className="relative mx-auto max-w-6xl scroll-mt-24 px-5 py-16 sm:px-8 sm:py-24"
    >
      <Scatter />
      <h2 className="max-w-2xl text-3xl font-bold tracking-tight text-balance sm:text-5xl">
        You write the note. It does the rest.
      </h2>
      <p className="mt-5 max-w-2xl text-base leading-relaxed text-pretty text-fg-muted sm:text-lg">
        NoteWorthy writes your titles, summarizes your notes, cleans up your
        formatting and files everything into the right place. All of it runs on
        your own iPhone, iPad or Mac.
      </p>

      <div className="mt-14 space-y-20 sm:mt-20 sm:space-y-32">
        {FEATURES.map((f, i) => (
          <div key={f.id} className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div className={i % 2 === 1 ? "lg:order-2" : ""}>
              <span className="text-xs font-semibold tracking-[0.18em] text-accent-ink uppercase">
                {f.eyebrow}
              </span>
              <h3 className="mt-3 text-2xl font-bold tracking-tight text-balance sm:text-4xl">
                {f.title}
              </h3>
              <p className="mt-4 text-base leading-relaxed text-pretty text-fg-muted sm:text-lg">
                {f.body}
              </p>
              <ul className="mt-6 space-y-3">
                {f.points.map((p) => (
                  <li key={p} className="flex gap-3 text-sm text-fg sm:text-base">
                    <span className="mt-0.5 shrink-0 text-accent-ink">✦</span>
                    <span className="text-pretty">{p}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className={`relative ${i % 2 === 1 ? "lg:order-1" : ""}`}>
              <div
                aria-hidden
                className="pointer-events-none absolute -inset-6 rounded-[3rem] blur-2xl"
                style={{ background: "radial-gradient(closest-side, rgb(var(--glow) / .28), transparent)" }}
              />
              <DeviceMock
                name={f.shotName}
                alt={`NoteWorthy: ${f.title}`}
                kind="front"
                className="relative mx-auto w-[15rem] sm:w-[17.5rem]"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Universal, shown once with the Mac and the tablet rather than as its
          own gallery of the same phone screens over again. */}
      <div id="screens" className="mt-20 scroll-mt-24 sm:mt-32">
        <h3 className="text-2xl font-bold tracking-tight text-balance sm:text-4xl">
          Universal for iPhone, iPad and Mac
        </h3>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-pretty text-fg-muted sm:text-lg">
          Sticky notes on your iPhone, a sidebar and a note board on iPad, and
          on the Mac a notebook that waits on the edge of your screen. The same
          library everywhere. These follow whichever appearance you picked
          above.
        </p>

        <figure className="mt-8 sm:mt-10">
          <DeviceMock
            name="01-tasks"
            kind="mac"
            alt="Mac: the Tasks board, open from the rail of labels on the edge of the screen"
            className="mx-auto w-full max-w-4xl"
          />
          <figcaption className="mt-3 text-center text-xs text-fg-faint sm:text-sm">
            Mac: your labels on the edge of the screen, one click away
          </figcaption>
        </figure>

        <div className="mt-10 grid gap-6 sm:mt-14 sm:grid-cols-2 sm:gap-8">
          {[
            { name: "02-home", caption: "iPad: sidebar and board" },
            { name: "04-new-note", caption: "iPad: capture" },
          ].map((g) => (
            <figure key={g.name}>
              <DeviceMock name={g.name} kind="ipad" alt={g.caption} className="mx-auto w-full" />
              <figcaption className="mt-3 text-center text-xs text-fg-faint sm:text-sm">
                {g.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Notes pinned in the page's side margins.
 *
 * A row across the middle was the first attempt and it read as content, which
 * these are not. They belong in the gutters either side of the 72rem column,
 * behind everything, drifting past as you scroll. Hidden below 1280px, where
 * there are no gutters to put them in.
 */
export function Scatter() {
  // left/right and a vertical offset down the features column.
  const spots = [
    { side: "left", top: "6%", rotate: "-3.5deg" },
    { side: "right", top: "21%", rotate: "2.8deg" },
    { side: "left", top: "42%", rotate: "2.2deg" },
    { side: "right", top: "58%", rotate: "-2.6deg" },
    { side: "left", top: "76%", rotate: "-1.8deg" },
  ] as const;

  return (
    <div className="pointer-events-none absolute inset-0 hidden 2xl:block" aria-hidden>
      {SCATTER.map((n, i) => {
        const spot = spots[i % spots.length];
        return (
          <div
            key={n.title}
            className="absolute flex w-[16.5rem] flex-col opacity-60 transition-opacity hover:opacity-100"
            style={{
              top: spot.top,
              // Negative, because this sits inside the 72rem content column:
              // `left: 0` is the column's edge, not the window's. The first
              // version used a positive offset and the notes landed on top of
              // the text instead of beside it.
              [spot.side]: "-18rem",
              transform: `rotate(${spot.rotate})`,
            }}
          >
            <NoteCard note={n} />
          </div>
        );
      })}
    </div>
  );
}

/** The two models, side by side. Both local, for different reasons. */
export function Models() {
  return (
    <section id="models" className="scroll-mt-24 border-y border-line bg-bg-soft py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <span className="text-xs font-semibold tracking-[0.18em] text-accent-ink uppercase">
          On-device intelligence
        </span>
        <h2 className="mt-3 max-w-3xl text-3xl font-bold tracking-tight text-balance sm:text-5xl">
          Two models. Both on your device.
        </h2>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-pretty text-fg-muted sm:text-lg">
          One writes, the other decides where things go. Neither can reach the
          internet, because the app cannot.
        </p>

        <div className="mt-10 grid gap-6 sm:mt-14 lg:grid-cols-2 lg:gap-8">
          {MODELS.map((m) => (
            <div
              key={m.name}
              className="rounded-3xl border border-line bg-bg-raised p-6 sm:p-9"
            >
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-semibold text-fg-faint">{m.vendor}</span>
                <span className="rounded-full bg-accent/15 px-2.5 py-0.5 text-xs font-semibold text-accent-ink">
                  {m.role}
                </span>
              </div>
              <h3 className="mt-2.5 text-xl font-bold tracking-tight sm:text-2xl">
                {m.name}
              </h3>
              <p className="mt-3.5 text-sm leading-relaxed text-pretty text-fg-muted sm:text-base">
                {m.body}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {m.points.map((p) => (
                  <span
                    key={p}
                    className="rounded-full border border-line px-3 py-1 text-xs text-fg-muted"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p className="mt-7 text-xs leading-relaxed text-fg-faint sm:text-sm">
          Gemma is provided under the Gemma Terms of Use. The weights ship
          inside the app and are never downloaded.
        </p>
      </div>
    </section>
  );
}

function SchemeSeal() {
  const { scheme } = useTheme();
  return (
    <img src={`icons/seal-${scheme}.svg`} alt="" className="mx-auto h-14 w-14 sm:h-16 sm:w-16" />
  );
}

/**
 * The promise, then the policy that backs it. The policy is the whole thing,
 * not a summary of a longer one elsewhere, so `#privacy` is the address to
 * give the App Store as the privacy policy URL.
 */
export function Privacy() {
  return (
    <section
      id="privacy"
      className="scroll-mt-16 border-y border-line bg-bg-soft px-5 py-16 sm:px-8 sm:py-28"
    >
      <div className="mx-auto max-w-4xl text-center">
        <SchemeSeal />
        <h2 className="mt-7 text-3xl font-bold tracking-tight text-balance sm:text-5xl">
          There is no server to trust.
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-pretty text-fg-muted sm:text-lg">
          Not "we don't look at your notes". The app makes no network requests
          at all. No account to create, no connection required. Privacy here is
          a property of the build rather than a promise in a policy.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-2.5">
          {["No accounts", "No tracking", "No analytics", "No uploads", "File protection", "Face ID lock"].map(
            (t) => (
              <span
                key={t}
                className="rounded-full border border-line px-3.5 py-1.5 text-xs text-fg-muted sm:text-sm"
              >
                {t}
              </span>
            ),
          )}
        </div>
      </div>

      <div className="mx-auto mt-16 max-w-5xl sm:mt-24">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
          <h3 className="text-2xl font-bold tracking-tight sm:text-3xl">Privacy policy</h3>
          <p className="text-xs text-fg-faint sm:text-sm">Last updated {PRIVACY_UPDATED}</p>
        </div>
        <div className="mt-6 grid gap-4 sm:mt-8 md:grid-cols-2 md:gap-5">
          {PRIVACY_POLICY.map((item) => (
            <div
              key={item.title}
              // The permissions list is the long one; it gets the full width
              // rather than stretching its neighbour into a tall empty card.
              // The cards either side of it come in pairs, so keep the count
              // of the others even or one is left alone in its row.
              className={
                "rounded-2xl border border-line bg-bg-raised p-6 sm:p-7" +
                (item.points ? " md:col-span-2" : "")
              }
            >
              <h4 className="font-semibold sm:text-lg">{item.title}</h4>
              <p className="mt-2 text-sm leading-relaxed text-pretty text-fg-muted sm:text-base">
                {item.body}
              </p>
              {item.points && (
                <dl className="mt-4 grid gap-x-8 gap-y-3 sm:grid-cols-2">
                  {item.points.map((pt) => (
                    <div key={pt.name} className="flex gap-3 text-sm sm:text-base">
                      <span className="mt-0.5 shrink-0 text-accent-ink" aria-hidden>✦</span>
                      <div>
                        <dt className="inline font-semibold">{pt.name}: </dt>
                        <dd className="inline text-pretty text-fg-muted">{pt.why}</dd>
                      </div>
                    </div>
                  ))}
                </dl>
              )}
            </div>
          ))}
        </div>
        <p className="mt-6 text-xs leading-relaxed text-fg-faint sm:text-sm">
          <WithLinks text={PRIVACY_CHANGES} />
        </p>
      </div>
    </section>
  );
}

/** Line glyphs in the accent ink, so they follow the paper colour. */
function SoonIcon({ name }: { name: "cloud" | "people" }) {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {name === "cloud" ? (
        <>
          <path d="M7 18.5h10.5a4 4 0 0 0 .6-7.96A6 6 0 0 0 6.6 9.5 4.5 4.5 0 0 0 7 18.5z" />
          <path d="M9.25 13.75l2 2 3.75-4" />
        </>
      ) : (
        <>
          <circle cx="9" cy="8.5" r="3.25" />
          <path d="M3.25 19a5.75 5.75 0 0 1 11.5 0" />
          <circle cx="16.5" cy="9.5" r="2.5" />
          <path d="M16 14.3a4.75 4.75 0 0 1 5 4.7" />
        </>
      )}
    </svg>
  );
}

export function ComingSoon() {
  return (
    // Laid out like `Models`: heading on the page's own left edge and the
    // cards on the same grid, rather than boxed inside a panel of its own.
    <section id="soon" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-16 sm:px-8 sm:py-24">
      <span className="text-xs font-semibold tracking-[0.18em] text-accent-ink uppercase">
        Coming Soon
      </span>
      <h2 className="mt-3 max-w-3xl text-3xl font-bold tracking-tight text-balance sm:text-5xl">
        Two more, on the same terms.
      </h2>

      <div className="mt-10 grid gap-6 sm:mt-14 md:grid-cols-2 lg:gap-8">
        {COMING_SOON.map((c) => (
          <div key={c.title} className="rounded-3xl border border-line bg-bg-raised p-6 sm:p-9">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/15 text-accent-ink">
              <SoonIcon name={c.icon} />
            </span>
            <h3 className="mt-4 text-xl font-bold tracking-tight sm:text-2xl">{c.title}</h3>
            <p className="mt-3.5 text-sm leading-relaxed text-pretty text-fg-muted sm:text-base">
              {c.body}
            </p>
          </div>
        ))}
      </div>

      <p className="mt-7 text-xs leading-relaxed text-fg-faint sm:text-sm">
        Announced, not shipped, and not purchasable until they work.
      </p>
    </section>
  );
}

const linkClass = "text-accent-ink underline underline-offset-4 transition hover:opacity-80";

/**
 * Text with links in it: `[label](url)`, and the contact address wherever it
 * appears, which becomes a mailto link.
 */
function WithLinks({ text }: { text: string }) {
  // A split on a pattern with two groups interleaves: text, label, url, text…
  const parts = text.split(/\[([^\]]+)\]\(([^)]+)\)/);
  const out: ReactNode[] = [];
  for (let i = 0; i < parts.length; i += 3) {
    parts[i].split(CONTACT_EMAIL).forEach((chunk, j) => {
      if (j > 0)
        out.push(
          <a key={`${i}-${j}`} href={`mailto:${CONTACT_EMAIL}`} className={linkClass}>
            {CONTACT_EMAIL}
          </a>,
        );
      out.push(chunk);
    });
    if (i + 2 < parts.length)
      out.push(
        <a key={`${i}-link`} href={parts[i + 2]} className={linkClass}>
          {parts[i + 1]}
        </a>,
      );
  }
  return out;
}

/**
 * Text with `backticks` around a command. The command gets its own line and
 * scrolls sideways rather than wrapping: a command broken mid-word on a phone
 * reads wrong and copies wrong.
 */
function WithCode({ text }: { text: string }) {
  return text.split("`").map((part, i) =>
    i % 2 === 1 ? (
      <code
        key={i}
        className="my-3 block w-fit max-w-full overflow-x-auto rounded-lg border border-line bg-bg-soft px-3 py-2 font-mono text-[0.85em] whitespace-nowrap text-fg"
      >
        {part}
      </code>
    ) : (
      <WithLinks key={i} text={part} />
    ),
  );
}

/**
 * Native `<details>`, so every answer opens without JavaScript, is found by
 * the browser's find-in-page, and is read out correctly by VoiceOver.
 */
export function Faq() {
  return (
    <section id="faq" className="mx-auto max-w-6xl scroll-mt-24 px-5 pb-16 sm:px-8 sm:pb-24">
      <span className="text-xs font-semibold tracking-[0.18em] text-accent-ink uppercase">
        FAQ
      </span>
      <h2 className="mt-3 text-3xl font-bold tracking-tight text-balance sm:text-5xl">
        Questions, answered
      </h2>

      <div className="mt-8 divide-y divide-line border-y border-line sm:mt-12">
        {FAQ.map((f) => (
          <details key={f.q} className="group">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-base font-semibold transition hover:text-accent-ink sm:py-6 sm:text-lg [&::-webkit-details-marker]:hidden">
              {f.q}
              <span
                aria-hidden
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-line text-fg-muted transition group-open:rotate-45"
              >
                <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
                  <path d="M8 3v10M3 8h10" />
                </svg>
              </span>
            </summary>
            <p className="max-w-3xl pb-6 text-sm leading-relaxed text-pretty text-fg-muted sm:text-base">
              <WithCode text={f.a} />
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}

export function Footer() {
  const social = [
    { href: LINKS.github, label: "GitHub", icon: "logos/github.svg" },
    { href: LINKS.linkedin, label: "LinkedIn", icon: "logos/linkedin.svg" },
    { href: LINKS.x, label: "X", icon: "logos/x.svg" },
  ];

  return (
    <footer className="border-t border-line px-5 py-12 sm:px-8 sm:py-16">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-sm">
            <div className="flex items-center gap-2.5">
              <Mark className="h-9 w-9 rounded-lg" />
              <span className="text-lg font-semibold">NoteWorthy</span>
            </div>
            <p className="mt-3.5 text-sm leading-relaxed text-fg-muted">
              On-device AI notes for iPhone, iPad and Mac. Markdown in, Markdown
              out.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <a href="#privacy" className="text-sm text-fg-muted underline-offset-4 transition hover:text-accent-ink hover:underline">
              Privacy
            </a>
            <a href="#faq" className="text-sm text-fg-muted underline-offset-4 transition hover:text-accent-ink hover:underline">
              FAQ
            </a>
            {social.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer noopener"
                className="text-sm text-fg-muted underline-offset-4 transition hover:text-accent-ink hover:underline"
              ><img src={s.icon} className="h-5 w-5 mr-2"></img>
              </a>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-wrap gap-2">
          {TAGS.map((t) => (
            <span key={t} className="text-xs text-fg-faint/70">
              #{t}
            </span>
          ))}
        </div>

        <p className="mt-8 border-t border-line pt-7 text-xs leading-relaxed text-fg-faint">
          On-device intelligence needs an Apple Intelligence-capable device.
          Elsewhere NoteWorthy falls back to fast built-in heuristics and works
          exactly as well for writing, filing and search. Built by Suman
          Hansada.
        </p>
        {/* The year comes from the reader's clock, so it never goes stale. */}
        <p className="mt-3 text-xs text-fg-faint">
          © {new Date().getFullYear()} Suman Hansada. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
