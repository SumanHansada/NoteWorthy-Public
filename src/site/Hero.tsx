import { Player } from "@remotion/player";
import { useEffect, useRef, useState } from "react";
import { HeroComposition, heroDuration } from "../remotion/HeroComposition";
import { CountUp } from "./Bits";
import { PILLARS } from "./data";
import { AccentPicker, useTheme } from "./theme";

function AnimatedPlaneBadge() {
  const [landed, setLanded] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setLanded(true);
        }
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <span
      ref={ref}
      className="inline-flex items-center gap-2 overflow-hidden rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-accent-ink sm:text-sm dark:text-accent"
    >
      <span
        className="inline-block transition-all duration-[2000ms] cubic-bezier(0.16, 1, 0.3, 1)"
        style={{
          transform: landed ? "translateX(0)" : "translateX(-180px)",
          opacity: landed ? 1 : 0,
        }}
      >
        ✈
      </span>
      <span>Works in airplane mode. Always.</span>
    </span>
  );
}

export function Hero() {
  const { accent, scheme } = useTheme();

  const [motionOK, setMotionOK] = useState(true);
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const forcedStatic = new URLSearchParams(window.location.search).has("static");
    setMotionOK(!reduced && !forcedStatic);
  }, []);
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const [tint, setTint] = useState({
    cardTop: "#FCEFB4", cardBottom: "#F9E48F", cardFg: "#4A3B00",
    accent: "#C79400", accentInk: "#896600",
  });
  useEffect(() => {
    const css = getComputedStyle(document.documentElement);
    const v = (n: string) => css.getPropertyValue(n).trim();
    setTint({
      cardTop: v("--card-top"),
      cardBottom: v("--card-bottom"),
      cardFg: v("--card-fg"),
      accent: v("--accent"),
      accentInk: v("--accent-ink"),
    });
  }, [accent, scheme]);

  return (
    <header className="relative overflow-hidden px-5 pt-28 pb-16 sm:px-8 sm:pt-36 lg:pb-24">
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
          <AnimatedPlaneBadge />

          {/* 2rem at base: "without the internet." is 21 characters and overran
              a narrow phone once the side padding was taken off. */}
          <h1 className="mt-7 text-[2rem] leading-[1.1] font-bold tracking-tight text-balance sm:text-6xl lg:text-7xl">
            Notes that think,
            <br />
            <span className="text-accent-ink">without the internet.</span>
          </h1>

          <p className="mx-auto mt-7 max-w-2xl text-base leading-relaxed text-pretty text-fg-muted sm:text-xl">
            Titles, summaries and filing are written by Apple Intelligence,
            right on your iPhone. No account, no upload, nothing to trust us
            with.
          </p>

          <div className="mt-9 flex justify-center">
            <a
              href="#features"
              className="w-full cursor-pointer rounded-full bg-accent px-8 py-3.5 text-center font-semibold text-on-accent transition hover:opacity-90 sm:w-auto"
            >
              See How it Works
            </a>
          </div>

          {/* Six note colours. The page picks one at random on load — the same
              thing a new note does — and these change it for everything. */}
          <div className="mt-9">
            <p className="mb-3 text-xs tracking-wide text-fg-faint uppercase">
              Pick a paper color
            </p>
            <AccentPicker />
          </div>
        </div>

        {/* Responsive wrapper: 4:5 vertical portrait on mobile, 16:9 landscape on desktop */}
        <div className="mt-14 aspect-[4/5] overflow-hidden rounded-2xl border border-line shadow-[var(--shadow)] sm:mt-20 sm:aspect-video sm:rounded-3xl">
          <Player
            component={HeroComposition}
            // Re-keyed on the theme so the composition re-reads its colours;
            // Remotion memoises inputProps aggressively otherwise.
            key={`${accent}-${scheme}-${isMobile}`}
            inputProps={{ ...tint, scheme }}
            durationInFrames={heroDuration}
            compositionWidth={isMobile ? 540 : 1280}
            compositionHeight={isMobile ? 675 : 720}
            fps={30}
            loop
            autoPlay={motionOK}
            controls={!motionOK}
            // Frame 0 is an empty card — the text has not typed itself yet. If
            // the animation is not going to run, open on the finished state
            // instead, which is the frame that actually makes the point.
            // `?frame=300` opens on a chosen frame — the only way to inspect a
            // late phase of a looping animation in a still.
            initialFrame={
              motionOK
                ? 0
                : Number(new URLSearchParams(window.location.search).get("frame")) || 235
            }
            style={{ width: "100%", height: "100%", display: "block" }}
          />
        </div>

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
