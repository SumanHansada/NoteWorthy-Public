import { NoteCard } from "./Bits";
import { DeviceMock } from "./DeviceMock";
import {
  COMING_SOON,
  FEATURES,
  LINKS,
  MODELS,
  SCATTER,
  TAGS,
} from "./data";
import { SchemeSwitcher, useTheme } from "./theme";

/** The app mark, in the icon variant that matches the page's scheme. */
function Mark({ className = "" }: { className?: string }) {
  const { scheme } = useTheme();
  return <img src={`icons/mark-${scheme}.svg`} alt="" className={className} />;
}

export function Nav() {
  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-line bg-bg/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-8">
        <a href="#top" className="flex shrink-0 items-center gap-2.5">
          <Mark className="h-8 w-8 rounded-lg sm:h-9 sm:w-9" />
          <span className="font-semibold tracking-tight sm:text-lg">NoteWorthy</span>
        </a>

        <div className="hidden items-center gap-7 text-sm text-fg-muted lg:flex">
          <a href="#features" className="transition hover:text-fg">Features</a>
          <a href="#models" className="transition hover:text-fg">On-device AI</a>
          <a href="#screens" className="transition hover:text-fg">Screens</a>
          <a href="#soon" className="transition hover:text-fg">Coming soon</a>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <SchemeSwitcher />
          {/* Hidden below `sm`: it does not fit beside the mark and the
              scheme switcher, and the hero badge is right there. */}
          <a
            href={LINKS.appStore}
            target="_blank"
            rel="noreferrer noopener"
            className="hidden cursor-pointer rounded-full bg-accent px-4 py-2 text-sm font-semibold text-on-accent transition hover:opacity-90 sm:inline-block"
          >
            Download
          </a>
        </div>
      </div>
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
        your iPhone.
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

      {/* Universal, shown once with the tablet rather than as its own gallery
          of the same phone screens over again. */}
      <div id="screens" className="mt-20 scroll-mt-24 sm:mt-32">
        <h3 className="text-2xl font-bold tracking-tight text-balance sm:text-4xl">
          Universal for iPhone and iPad
        </h3>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-pretty text-fg-muted sm:text-lg">
          A sidebar and a note board on iPad, sticky notes on your iPhone,
          and the same library everywhere. These follow whichever appearance you
          picked above.
        </p>
        <div className="mt-8 grid gap-6 sm:mt-10 sm:grid-cols-2 sm:gap-8">
          {[
            { name: "02-home", caption: "iPad — sidebar and board" },
            { name: "04-new-note", caption: "iPad — capture" },
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
          Two models. Both on your phone.
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

export function Privacy() {
  return (
    <section className="border-y border-line bg-bg-soft px-5 py-16 sm:px-8 sm:py-28">
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
    </section>
  );
}

export function ComingSoon() {
  return (
    <section id="soon" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-16 sm:px-8 sm:py-24">
      <div className="rounded-3xl border border-line bg-bg-soft p-7 sm:p-14">
        <span className="text-xs font-semibold tracking-[0.18em] text-accent-ink uppercase">
          Coming soon
        </span>
        <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-4xl">
          Two more, on the same terms
        </h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 sm:gap-10">
          {COMING_SOON.map((c) => (
            <div key={c.title} className="rounded-2xl border border-line bg-bg-raised p-6">
              <h3 className="text-lg font-semibold sm:text-xl">{c.title}</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-pretty text-fg-muted sm:text-base">
                {c.body}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-7 text-xs text-fg-faint sm:text-sm">
          Announced, not shipped, and not purchasable until they work.
        </p>
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

          <div className="flex flex-wrap gap-x-6 gap-y-3">
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
      </div>
    </footer>
  );
}
