import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Relative base so the built site works from a file path, a subdirectory or a
// GitHub Pages project URL without being rebuilt for each.
export default defineConfig({
  base: "./",
  plugins: [react(), tailwindcss()],
});
