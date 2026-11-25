import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";

const app = express();
const root = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3001;
app.disable("x-powered-by");
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("Cache-Control", req.path.startsWith("/assets/") ? "public, max-age=31536000, immutable" : "no-store");
  next();
});
app.get("/api/health", (_req, res) => res.json({ ok: true, mode: "browser-only-free", version: "kabu-free-browser-v1" }));
app.use(express.static(path.join(root, "dist"), { index: "index.html" }));
app.get("/{*splat}", (_req, res) => res.sendFile(path.join(root, "dist", "index.html")));
app.listen(PORT, "0.0.0.0", () => console.log(`KABU AI free browser mode listening on ${PORT}`));
