import express from "express";
import cors from "cors";
import { Readable } from "node:stream";
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

      const headers: Record<string, string> = { Accept: "application/pdf" };
      const rangeHeader = req.headers["range"] as string | undefined;
      if (rangeHeader) headers["Range"] = rangeHeader;

      const upstream = await fetch(url, { headers });
      if (!upstream.ok && upstream.status !== 206) {
        res.status(upstream.status || 502).json({ error: "Upstream fetch failed" });
        return;
      }

      const contentType = upstream.headers.get("content-type") || "application/pdf";
      const acceptRanges = upstream.headers.get("accept-ranges") || "bytes";
      const contentLength = upstream.headers.get("content-length") || undefined;
      const contentRange = upstream.headers.get("content-range") || undefined;

      res.setHeader("Content-Type", contentType);
      res.setHeader("Accept-Ranges", acceptRanges);
      res.setHeader("Cache-Control", "public, max-age=86400");
      res.setHeader("Content-Disposition", "inline");
      res.setHeader("X-Content-Type-Options", "nosniff");
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
      if (contentLength) res.setHeader("Content-Length", contentLength);
      if (contentRange) res.setHeader("Content-Range", contentRange);

      if (upstream.status === 206) {
        res.status(206);
      }

      if (upstream.body) {
        const nodeStream = Readable.fromWeb(upstream.body as unknown as ReadableStream);
        nodeStream.on("error", () => res.end());
        nodeStream.pipe(res);
      } else {
        const arrayBuf = await upstream.arrayBuffer();
        res.end(Buffer.from(arrayBuf));
      }
    } catch (err) {
      res.status(500).json({ error: "Proxy error" });
    }
  });

  return app;
}
