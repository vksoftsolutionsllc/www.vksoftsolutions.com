import { defineConfig, loadEnv, type Plugin, type ViteDevServer } from "vite";
import react from "@vitejs/plugin-react";

// Serves /api/*.ts with the same Web Request/Response signature Vercel uses,
// so `npm run dev` exercises the real form endpoint without `vercel dev`.
function vercelApiDev(): Plugin {
  return {
    name: "vercel-api-dev",
    configureServer(server: ViteDevServer) {
      server.middlewares.use(async (req, res, next) => {
        const url = new URL(req.url ?? "/", `http://${req.headers.host}`);
        if (!url.pathname.startsWith("/api/")) return next();
        try {
          const mod = await server.ssrLoadModule(`/api/${url.pathname.slice(5)}.ts`);
          const handler = mod[req.method ?? "GET"];
          if (typeof handler !== "function") { res.statusCode = 405; return res.end(); }
          const chunks: Buffer[] = [];
          for await (const chunk of req) chunks.push(chunk as Buffer);
          const headers = new Headers();
          for (const [k, v] of Object.entries(req.headers)) if (typeof v === "string") headers.set(k, v);
          headers.set("x-real-ip", req.socket.remoteAddress ?? "127.0.0.1");
          const request = new Request(url, { method: req.method, headers, body: chunks.length ? Buffer.concat(chunks) : undefined });
          const response: Response = await handler(request);
          res.statusCode = response.status;
          response.headers.forEach((value, key) => res.setHeader(key, value));
          res.end(Buffer.from(await response.arrayBuffer()));
        } catch (err) {
          server.config.logger.error(String((err as Error).stack ?? err));
          res.statusCode = 500;
          res.end(JSON.stringify({ ok: false, error: "Dev API error" }));
        }
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  // Make server-only secrets from .env.local visible to the dev API handler.
  Object.assign(process.env, loadEnv(mode, process.cwd(), ""));
  return {
    // No manualChunks: the lazy /admin import already keeps supabase-js and
    // recharts out of the public bundle.
    plugins: [react(), vercelApiDev()],
    build: { chunkSizeWarningLimit: 700 },
  };
});
