import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Secure PDF proxy to bypass X-Frame-Options of third-party hosts
  app.get("/api/proxy-pdf", async (req, res) => {
    try {
      const url = String(req.query.url || "");
      if (!url || !/^https:\/\//i.test(url)) {
        res.status(400).json({ error: "Invalid url" });
        return;
      }
      // Restrict to trusted hosts
      const { hostname } = new URL(url);
      const allowedHosts = new Set([
        "raw.githubusercontent.com",
        "github.com",
        "cdn.jsdelivr.net",
      ]);
      if (!allowedHosts.has(hostname)) {
        res.status(403).json({ error: "Host not allowed" });
        return;
      }

      const upstream = await fetch(url, { headers: { Accept: "application/pdf" } });
      if (!upstream.ok) {
        res.status(502).json({ error: "Upstream fetch failed" });
        return;
      }

      const arrayBuf = await upstream.arrayBuffer();
      const buf = Buffer.from(arrayBuf);

      res.setHeader("Content-Type", upstream.headers.get("content-type") || "application/pdf");
      res.setHeader("Cache-Control", "public, max-age=86400");
      res.setHeader("Content-Disposition", "inline");
      res.setHeader("X-Content-Type-Options", "nosniff");
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");

      res.end(buf);
    } catch (err) {
      res.status(500).json({ error: "Proxy error" });
    }
  });

  return app;
}
