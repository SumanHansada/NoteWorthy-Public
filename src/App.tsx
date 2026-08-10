import { Hero } from "./site/Hero";
import {
  ComingSoon,
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
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}
