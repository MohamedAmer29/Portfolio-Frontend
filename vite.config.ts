import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";
import tailwindcss from '@tailwindcss/vite'

function preloadGsapPlugin(): Plugin {
  return {
    name: "preload-gsap",
    apply: "build",
    transformIndexHtml(html) {
      return html.replace(
        "<!-- preload-gsap -->",
        '<link rel="modulepreload" href="/assets/gsap-wzadwL2c.js" />\n    <link rel="modulepreload" href="/assets/ScrollTrigger-BXR6Gh-7.js" />',
      );
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), preloadGsapPlugin()],
});
