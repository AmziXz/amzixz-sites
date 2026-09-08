#!/usr/bin/env node

import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.argv[2]) || 8000;

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
};

async function isFile(p) {
  try {
    return (await stat(p)).isFile();
  } catch {
    return false;
  }
}

async function isDir(p) {
  try {
    return (await stat(p)).isDirectory();
  } catch {
    return false;
  }
}

async function resolve(urlPath) {
  const decoded = decodeURIComponent(urlPath.split("?")[0].split("#")[0]);
  // Traversal guard: /../../secrets must not escape ROOT.
  const local = path.resolve(ROOT, "." + path.posix.normalize(decoded));
  if (local !== ROOT && !local.startsWith(ROOT + path.sep)) return null;

  if (await isFile(local)) return local;
  if (await isDir(local)) {
    const index = path.join(local, "index.html");
    if (await isFile(index)) return index;
  }
  if (await isFile(local + ".html")) return local + ".html";
  return null;
}

const server = createServer(async (req, res) => {
  const head = req.method === "HEAD";
  if (req.method !== "GET" && !head) {
    res.writeHead(405, { Allow: "GET, HEAD" }).end();
    return;
  }

  const file = await resolve(req.url ?? "/");
  const target = file ?? path.join(ROOT, "404.html");
  const status = file ? 200 : 404;

  let body;
  try {
    body = await readFile(target);
  } catch {
    res.writeHead(404, { "Content-Type": TYPES[".txt"] }).end("404 Not Found");
    return;
  }

  res.writeHead(status, {
    "Content-Type": TYPES[path.extname(target).toLowerCase()] ?? "application/octet-stream",
    "Content-Length": body.length,
    "Cache-Control": "no-store",
  });
  res.end(head ? undefined : body);
});

server.listen(PORT, () => {
  console.log(`Serving http://localhost:${PORT}  (Ctrl+C to stop)`);
});
