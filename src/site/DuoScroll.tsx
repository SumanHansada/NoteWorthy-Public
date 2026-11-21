import { lazy, Suspense } from "react";

/**
 * iPhone Duo unfolding as you scroll: closed to open, with NoteWorthy on both
 * screens. The 3D code and the 6 MB model package load only when this section
 * mounts, and the component handles its own loading and failure states.
 */
const IphoneDuoScroll = lazy(() => import("./framer-duo/IphoneDuoScroll.js"));

export function DuoScroll() {
  return (
    <div aria-label="iPhone Duo unfolding" className="relative">
      <Suspense fallback={<div style={{ height: "100vh" }} />}>
        <IphoneDuoScroll
          interactionMode="scroll"
          scrollLength={180}
          screen="custom"
          outerImage={{ src: "/shots/3d/duo-outer.webp" }}
          innerImage={{ src: "/shots/3d/duo-classic-tabs.webp" }}
          imageFit="cover"
          lockScreenUI={{ showClock: false, showWifi: false, showQuickActions: false }}
          background="transparent"
          phoneSize={1}
        />
      </Suspense>
    </div>
  );
}
