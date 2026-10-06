import { LaunchBadges } from "./site/Bits";
import { Hero } from "./site/Hero";
import {
  ComingSoon,
  Faq,
  Features,
  Footer,
  Models,
  Nav,
  Privacy,
} from "./site/Sections";
import { ThemeProvider } from "./site/theme";

export default function App() {
  return (
    <ThemeProvider>
      {/* `overflow-x-clip` rather than hunting the one offending element: the
          hero's decorative glow is 70rem wide by design, and any stray overflow
          on a narrow phone pushes every centred block off the right edge. */}
      <div id="top" className="overflow-x-clip">
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
          own height: 54px for Product Hunt, 72px for Peerlist. */}
      <LaunchBadges
        className="fixed bottom-5 left-5 z-40 hidden flex-col items-start gap-2.5 lg:flex [&>a:first-child]:h-[54px] [&>a:last-child]:h-[72px]"
      />
    </ThemeProvider>
  );
}
