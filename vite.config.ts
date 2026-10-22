import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  // GitHub Pages serves from /izzy-place-inn/, Vercel serves from /
  // (Vercel sets VERCEL=1 automatically during builds)
  base: process.env.VERCEL ? "/" : "/izzy-place-inn/",
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
