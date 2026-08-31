import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (!id.includes("node_modules")) return undefined;
          if (id.includes("react-router")) return "router";
          if (id.includes("framer-motion")) return "motion";
          if (id.includes("@tanstack")) return "query";
          if (id.includes("axios")) return "http";
          if (id.includes("react-toastify")) return "http";
          if (id.includes("@react-three")) return "three";
          if (id.includes("three")) return "three";
          if (
            id.includes("react-dom") ||
            id.includes("/react/") ||
            id.includes("scheduler") ||
            id.includes("react-is") ||
            id.includes("use-sync-external-store") ||
            id.includes("regenerator-runtime")
          ) {
            return "react";
          }
          return undefined;
        },
      },
    },
  },
});
