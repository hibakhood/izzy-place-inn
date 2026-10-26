import { createServer } from "vite";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

// Reuse Vite's aliases, env and base so local subfolder and domain builds agree.
const server = await createServer({ cacheDir: "node_modules/.vite-prerender", server: { ws: false, middlewareMode: true, hmr: false, watch: null }, appType: "custom", ssr: { noExternal: ["react-helmet-async"] }, optimizeDeps: { noDiscovery: true, include: [] }, plugins: [] });
try {
  const { renderPage } = await server.ssrLoadModule("/src/prerender.tsx");
  const template = await readFile("dist/index.html", "utf8");
  const routes = ["/", "/rooms", "/rooms/classic-room", "/rooms/deluxe-room", "/rooms/executive-suite", "/rooms/family-room", "/gallery", "/about", "/contact", "/privacy", "/booking", "/404"];
  for (const route of routes) {
    const { html, head } = renderPage(route, server.config.base);
    const document = template.replace("</head>", `${head}\n</head>`).replace('<div id="root"></div>', `<div id="root">${html}</div>`);
    const destination = route === "/404" ? "dist/404.html" : path.join("dist", route, "index.html");
    await mkdir(path.dirname(destination), { recursive: true });
    await writeFile(destination, document);
  }
  console.log(`Prerendered ${routes.length} public pages with metadata and content.`);
} finally {
  await server.close();
}
