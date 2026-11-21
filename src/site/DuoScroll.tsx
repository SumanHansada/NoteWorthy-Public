import { lazy, Suspense, useEffect, useRef, useState } from "react";

/**
 * iPhone Duo unfolding as you scroll: closed to open, with NoteWorthy on both
 * screens. The 3D code and the 6 MB model package load only when this section
 * mounts, and the component handles its own loading and failure states.
 */
const IphoneDuoScroll = lazy(() => import("./framer-duo/IphoneDuoScroll.js"));

const SCROLL_LENGTH = 180; // vh of page scroll that unfolds the phone

/** Phones get a bigger Duo that pans sideways as it opens. */
function useIsPhone() {
  const [phone, setPhone] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(max-width: 639px)").matches,
  );
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const on = () => setPhone(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return phone;
}

const WIDE = 1.9; // canvas width in screen widths, so the open phone has room

export function DuoScroll() {
  const phone = useIsPhone();
  const outer = useRef<HTMLDivElement>(null);
  const pan = useRef<HTMLDivElement>(null);

  // As the phone unfolds, slide the wide canvas: left half first, then right.
  useEffect(() => {
    if (!phone) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const o = outer.current;
      const p = pan.current;
      if (!o || !p) return;
      const r = o.getBoundingClientRect();
      const vh = window.innerHeight;
      const t = Math.max(0, Math.min(1, -r.top / Math.max(1, r.height - vh)));
      const d = window.innerWidth * 0.3;
      // Closed: centred. As it opens, the phone slides right so the left
      // page is fully in view once it is open.
      const tx = d * t * t * (3 - 2 * t);
      p.style.transform = `translate3d(${tx}px,0,0)`;
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [phone]);

  const duo = (
    <Suspense fallback={<div style={{ height: "100vh" }} />}>
      <IphoneDuoScroll
        interactionMode="scroll"
        scrollLength={SCROLL_LENGTH}
        screen="custom"
        outerImage={{ src: "/shots/3d/duo-outer.webp" }}
        innerImage={{ src: "/shots/3d/duo-classic-tabs.webp" }}
        imageFit="cover"
        lockScreenUI={{ showClock: false, showWifi: false, showQuickActions: false }}
        background="transparent"
        phoneSize={phone ? 0.8 : 1}
      />
    </Suspense>
  );

  if (!phone) {
    return (
      <div aria-label="iPhone Duo unfolding" className="relative">
        {duo}
      </div>
    );
  }

  return (
    <div
      ref={outer}
      aria-label="iPhone Duo unfolding"
      className="relative"
      style={{ width: "100vw", marginLeft: "calc(50% - 50vw)", overflowX: "clip" }}
    >
      <div
        ref={pan}
        style={{ width: `${WIDE * 100}vw`, marginLeft: `${((1 - WIDE) / 2) * 100}vw`, willChange: "transform" }}
      >
        {duo}
      </div>
    </div>
  );
}
