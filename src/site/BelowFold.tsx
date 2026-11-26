import { ComingSoon, Faq, Features, Footer, Models, Privacy } from "./Sections";

/** Everything under the hero, as one lazily loaded chunk. */
export default function BelowFold() {
  return (
    <>
      <main>
        <Features />
        <Models />
        <Privacy />
        <ComingSoon />
        <Faq />
      </main>
      <Footer />
    </>
  );
}
