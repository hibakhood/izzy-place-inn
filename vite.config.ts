import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  // GitHub Pages serves from /kakanfo-inn/, Vercel serves from /
  // (Vercel sets VERCEL=1 automatically during builds)
  base: process.env.VERCEL ? "/" : "/kakanfo-inn/",
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
