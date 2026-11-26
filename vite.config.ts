import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import type { Plugin } from "vite";
import { FAQ, FEATURES } from "./src/site/data.ts";

const esc = (t: string) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/**
 * The page is a client-rendered app, so a crawler that does not run JavaScript
 * (most AI crawlers, link unfurlers) would see an empty div. This writes the
 * FAQ and feature list into the HTML twice from the same data the page uses:
 * as FAQPage structured data, and as plain text inside <noscript>.
 */
function crawlableContent(): Plugin {
  return {
    name: "crawlable-content",
    transformIndexHtml() {
      const faq = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: FAQ.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      };
      const html =
        `<main><h1>NoteWorthy: Smart Notes. Private on-device AI.</h1>` +
        `<p>NoteWorthy is a notes app for iPhone, iPad, Mac and iPhone Duo. You write the note; Apple Intelligence titles, summarizes and files it on your device. No account, and nothing leaves your device unless you turn on iCloud Sync.</p>` +
        `<p><a href="https://apps.apple.com/app/id6799721933">Download on the App Store</a></p>` +
        `<h2>Features</h2><ul>${FEATURES.map((f) => `<li><strong>${esc(f.title)}</strong>: ${esc(f.body)}</li>`).join("")}</ul>` +
        `<h2>FAQ</h2>${FAQ.map((f) => `<h3>${esc(f.q)}</h3><p>${esc(f.a)}</p>`).join("")}</main>`;
      return [
        { tag: "script", attrs: { type: "application/ld+json" }, children: JSON.stringify(faq), injectTo: "head" },
        { tag: "noscript", children: html, injectTo: "body-prepend" },
      ];
    },
  };
}

// Relative base so the built site works from a file path, a subdirectory or a
// GitHub Pages project URL without being rebuilt for each.
export default defineConfig({
  base: "./",
  plugins: [react(), tailwindcss(), crawlableContent()],
});
