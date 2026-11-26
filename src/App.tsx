import { lazy, Suspense } from "react";
import { LaunchBadges } from "./site/Bits";
import { Hero } from "./site/Hero";
import { Nav, PageNotes } from "./site/Top";
import { ThemeProvider } from "./site/theme";

// Everything below the hero loads as its own chunk, after the first screen
// has painted, so the hero is not waiting on code it cannot show yet.
const BelowFold = lazy(() => import("./site/BelowFold"));

export default function App() {
  return (
    <ThemeProvider>
      {/* `overflow-x-clip` rather than hunting the one offending element: the
          hero's decorative glow is 70rem wide by design, and any stray overflow
          on a narrow phone pushes every centred block off the right edge. */}
      <div id="top" className="relative isolate overflow-x-clip">
        <PageNotes />
        <Nav />
        <Hero />
        <Suspense fallback={<div style={{ minHeight: "100vh" }} />}>
          <BelowFold />
        </Suspense>
      </div>
      {/* Pinned to the corner on a wide screen, stacked with Product Hunt on
          top. Phones get them in the hero instead. Each at its embed code's
          own height: 54px for Product Hunt and EarlyHound, 72px for Peerlist, and LaunchBuff's 256 x 80 as its embed gives it. */}
      <LaunchBadges
        className="fixed bottom-5 left-5 z-40 hidden flex-col items-start gap-2.5 lg:flex [&>a]:h-[54px] [&>a:nth-child(2)]:h-[72px] [&>a:last-child]:h-auto"
      />
    </ThemeProvider>
  );
}
