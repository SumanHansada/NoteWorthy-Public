import { useEffect, useRef, useState } from "react";
import { AppStoreBadge, CopyCommand, CountUp, LaunchBadges } from "./Bits";
import { BREW_INSTALL, FILM, LINKS, MAC_APP_STORE_LIVE, PILLARS } from "./data";
import { AccentPicker } from "./theme";

export function Hero() {
  const [motionOK, setMotionOK] = useState(true);
  const [isIOS, setIsIOS] = useState(false);
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const forcedStatic = new URLSearchParams(window.location.search).has("static");
    setMotionOK(!reduced && !forcedStatic);
    // An iPad on iPadOS 13+ reports itself as a Mac, and gives itself away
    // only by having a touch screen.
    setIsIOS(
      /iPhone|iPad|iPod/.test(navigator.userAgent) ||
        (navigator.userAgent.includes("Macintosh") && navigator.maxTouchPoints > 1),
    );
  }, []);
  return (
    <header className="relative overflow-hidden px-5 pt-32 pb-16 sm:px-8 sm:pt-44 lg:pb-24">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[36rem] w-[70rem] -translate-x-1/2 rounded-full opacity-45 blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, rgb(var(--glow) / .38), transparent)",
        }}
      />

      <div className="relative mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center">
          {/* The sizes step up in four stages so the promise stays comfortably
              readable without overpowering the product name. */}
          <h1 className="text-[2rem] leading-[1.1] font-bold tracking-tight text-balance sm:text-5xl md:text-6xl lg:text-[4rem]">
            NoteWorthy
          </h1>

          {/* The App Store title and subtitle, "NoteWorthy: Smart Notes" and
              "Private on-device AI", so the page and the listing say the
              same thing. */}
          <p className="mx-auto mt-5 max-w-3xl text-2xl leading-tight font-semibold tracking-tight text-balance text-accent-ink sm:text-4xl">
            Smart notes. Private on-device AI.
          </p>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-pretty text-fg-muted sm:text-xl">
            Available for iPhone, iPad and Mac.
          </p>

          {/* Apple's badge is fixed artwork, 135 x 40, so the button beside it
              takes the same size: 48px tall is 162px wide, 52px is 175.5px.
              Both take the corners of "Download for Mac" below them rather
              than the badge's own, so the hero's buttons share one radius.
              `flex-wrap` rather than a breakpoint, so the pair drops to
              stacked on its own when there stops being room. */}
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <a
              href={LINKS.appStore}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="Download NoteWorthy on the App Store"
              className="relative inline-flex h-12 w-[10.125rem] items-center justify-center overflow-hidden rounded-xl transition hover:opacity-85 sm:h-[3.25rem] sm:w-[10.97rem]"
            >
              <AppStoreBadge className="block h-full w-full" />
              {/* Rounding the link clips off the artwork's own grey edge at
                  the corners, so the edge is drawn again along the new curve. */}
              <span aria-hidden className="pointer-events-none absolute inset-0 rounded-[inherit] border border-[#A6A6A6]" />
            </a>
            {/* 156/40 wide, so the width is the height times 3.9. */}
            {MAC_APP_STORE_LIVE && (
              <a
                href={LINKS.macAppStore}
                target="_blank"
                rel="noreferrer noopener"
                aria-label="Download NoteWorthy on the Mac App Store"
                className="inline-flex h-12 w-[11.7rem] items-center justify-center rounded-[0.64rem] transition hover:opacity-85 sm:h-[3.25rem] sm:w-[12.675rem] sm:rounded-[0.7rem]"
              >
                <AppStoreBadge mac className="block h-full w-full" />
              </a>
            )}
            <a
              href="#features"
              className="inline-flex h-12 w-[10.125rem] cursor-pointer items-center justify-center rounded-xl border border-accent bg-accent text-center text-sm font-semibold text-on-accent transition hover:opacity-90 sm:h-[3.25rem] sm:w-[10.97rem] sm:text-base"
            >
              See How it Works
            </a>
          </div>

          {/* On a phone there is no spare edge for the floating badges, so
              they sit here under the buttons instead, side by side while they
              fit and stacked once they do not. */}
          <LaunchBadges
            className="mt-6 flex flex-wrap items-center justify-center gap-3 lg:hidden"
            badgeClassName="h-12"
          />

          {/* The App Clip only opens on an iPhone or iPad, so everyone else
              never sees the offer. */}
          {isIOS && (
            <div className="mt-5">
              <a
                href={LINKS.appClip}
                className="group inline-flex items-center gap-2.5 rounded-full border border-accent/40 bg-accent/10 py-2 pr-3 pl-2 text-sm font-semibold text-accent-ink shadow-[0_0_0_4px_rgb(var(--glow)/0.25)] transition active:scale-[0.97]"
              >
                {/* Apple's App Clip mark, roughly: a dot inside a dotted ring. */}
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent text-on-accent">
                  <svg viewBox="0 0 20 20" className="h-4.5 w-4.5" fill="none" stroke="currentColor" aria-hidden>
                    <circle cx="10" cy="10" r="7" strokeWidth="1.6" strokeDasharray="2.2 1.8" strokeLinecap="round" />
                    <circle cx="10" cy="10" r="3" fill="currentColor" stroke="none" />
                  </svg>
                </span>
                <span>
                  Try it without installing
                  <span className="ml-1.5 rounded-full bg-accent/15 px-1.5 py-0.5 text-[0.7rem] font-semibold tracking-wide uppercase">
                    App Clip
                  </span>
                </span>
                <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 transition-transform group-active:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M6 3.5 10.5 8 6 12.5" />
                </svg>
              </a>
            </div>
          )}

          {/* The App Store stays the primary way in. The DMG and Homebrew are
              the same notarized Mac app from outside the store, so they sit
              under the buttons rather than beside them: the download for most
              people, the command for those who live in a terminal.
              Only where someone could run it: a large screen with a mouse or
              trackpad. That leaves out phones and tablets, including an iPad
              wide enough to pass for a laptop, whose pointer is a finger, and
              nobody on a phone starts a 200 MB download by accident. */}
          <div className="mt-7 hidden flex-col items-center gap-2.5 lg:pointer-fine:flex">
            <a
              href={LINKS.macDownload}
              className="inline-flex items-center gap-2 rounded-xl border border-line bg-bg-raised px-4 py-2 text-sm font-semibold transition hover:border-accent hover:text-accent-ink"
            >
              <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M8 2.5v8M4.5 7 8 10.5 11.5 7M3 13.5h10" />
              </svg>
              Download for Mac
              <span className="font-normal text-fg-faint">.dmg</span>
            </a>
            <p className="text-sm text-fg-muted">or install it with Homebrew</p>
            <CopyCommand command={BREW_INSTALL} />
            <p className="text-xs text-fg-faint">
              Apple silicon, macOS 26 or later.
            </p>
          </div>

          {/* Six note colours. The page picks one at random on load, just as a
              new note does, and these change it for everything. */}
          <div className="mt-9">
            <p className="mb-3 text-xs tracking-wide text-fg-faint uppercase">
              Pick a paper color
            </p>
            <AccentPicker />
          </div>
        </div>

        <HeroFilm motionOK={motionOK} />

        <dl className="mx-auto mt-12 grid max-w-3xl grid-cols-3 gap-4 sm:mt-16 sm:gap-8">
          {PILLARS.map((p) => (
            <div key={p.label} className="text-center">
              <dt className="text-2xl font-bold text-accent-ink sm:text-5xl">
                <CountUp from={p.from} to={p.to} suffix={p.suffix} />
              </dt>
              <dd className="mt-1.5 text-xs leading-snug text-fg-faint sm:text-sm">
                {p.label}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </header>
  );
}

// Tailwind's `sm`. Below it the page is a phone, and a phone gets the
// vertical cut.
const PHONE = "(max-width: 639px)";

/**
 * The "Everywhere" film, muted and looping, from this site rather than YouTube.
 *
 * A hero has to play on its own, and a YouTube embed that autoplays would have
 * the page call Google before the reader did anything, on a site whose pitch
 * is an app that makes no network requests. So the loop is a small cut of the
 * master served from here, and YouTube only appears when someone asks for
 * sound, picking up where the loop was.
 *
 * Phones get the 9:16 cut and the matching Short. The choice is made before
 * the first render, so a phone never starts downloading the wide file.
 *
 * With reduced motion (or `?static=1`) it holds on the poster, the frame where
 * all three devices are on screen, and shows the native controls instead.
 */
function HeroFilm({ motionOK }: { motionOK: boolean }) {
  const video = useRef<HTMLVideoElement>(null);
  const [youtubeAt, setYoutubeAt] = useState<number | null>(null);
  const [tall, setTall] = useState(() => window.matchMedia(PHONE).matches);

  useEffect(() => {
    const mq = window.matchMedia(PHONE);
    const onChange = () => setTall(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const cut = tall ? FILM.tall : FILM.wide;

  const watchWithSound = () => {
    const t = Math.floor(video.current?.currentTime ?? 0);
    video.current?.pause();
    setYoutubeAt(t);
  };

  return (
    <div
      className={
        "relative mx-auto mt-14 overflow-hidden rounded-2xl border border-line bg-bg-soft shadow-[var(--shadow)] sm:mt-20 sm:rounded-3xl " +
        // 9:16 at full phone width is nearly the whole screen, which pushes
        // everything else off it. Capped at 75% of the screen's height, with
        // the width following, so the next section still peeks in.
        (tall ? "aspect-[9/16] w-full max-w-[calc(75svh*9/16)]" : "aspect-video")
      }
    >
      {youtubeAt === null ? (
        <>
          <video
            ref={video}
            // Keyed so a change of cut or of reduced motion re-mounts with the
            // right attributes; React does not re-apply `autoPlay` to a live
            // element.
            key={`${cut.src}-${motionOK}`}
            src={cut.src}
            poster={cut.poster}
            aria-label={FILM.title}
            muted
            loop
            playsInline
            autoPlay={motionOK}
            controls={!motionOK}
            preload={motionOK ? "auto" : "none"}
            className="block h-full w-full object-cover"
          />
          <button
            type="button"
            onClick={watchWithSound}
            className="absolute top-3 right-3 inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur transition hover:bg-black/75 sm:top-5 sm:right-5 sm:px-4 sm:py-2 sm:text-sm"
          >
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 sm:h-4 sm:w-4" fill="currentColor" aria-hidden>
              <path d="M8 5.5v13a1 1 0 0 0 1.52.85l10.4-6.5a1 1 0 0 0 0-1.7L9.52 4.65A1 1 0 0 0 8 5.5z" />
            </svg>
            Watch with sound
          </button>
        </>
      ) : (
        <iframe
          src={
            `https://www.youtube-nocookie.com/embed/${cut.youtube}` +
            `?autoplay=1&rel=0&playsinline=1${youtubeAt ? `&start=${youtubeAt}` : ""}`
          }
          title={FILM.title}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      )}
    </div>
  );
}
