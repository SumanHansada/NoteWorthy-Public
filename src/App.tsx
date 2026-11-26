import { LaunchBadges } from "./site/Bits";
import { Hero } from "./site/Hero";
import {
  ComingSoon,
  Faq,
  Features,
  Footer,
  Models,
  Nav,
  PageNotes,
  Privacy,
} from "./site/Sections";
import { ThemeProvider } from "./site/theme";

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
        <main>
          <Features />
          <Models />
          <Privacy />
          <ComingSoon />
          <Faq />
        </main>
        <Footer />
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
