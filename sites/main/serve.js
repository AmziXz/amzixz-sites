#!/usr/bin/env node
/**
 * Local preview server that behaves like GitHub Pages.
 *
 * Pages serves /about from about.html, /dir/ from dir/index.html, and falls back
 * to 404.html for anything missing. Nothing built into Node does that, so
 * navigation would 404 locally even though it works once deployed.
 *
 *     node serve.js [port]        # default 8000
 *
 * This is the Node twin of serve.py, kept because Python is not installed on
 * every machine this repo is edited from. Both must behave identically; change
 * one and change the other.
 *
 * Use this rather than opening the files directly: the site uses root-absolute
 * paths (/assets/style.css), which resolve against your C: drive under file://
 * and so load nothing. Third-party embeds also refuse to load from a file://
 * origin, because those are treated as unique origins with no host.
 */

import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.argv[2]) || 8000;

/** @type {Record<string, string>} */
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

/** @param {string} p */
async function isFile(p) {
  try {
    return (await stat(p)).isFile();
  } catch {
    return false;
  }
}

/** @param {string} p */
async function isDir(p) {
  try {
    return (await stat(p)).isDirectory();
  } catch {
    return false;
  }
}

/**
 * Map a request path to a file on disk, mirroring Pages' resolution order:
 * exact file, then directory index, then the extensionless .html form.
 * Returns null when nothing matches, so the caller can serve 404.html.
 *
 * @param {string} urlPath
 * @returns {Promise<string | null>}
 */
async function resolve(urlPath) {
  const decoded = decodeURIComponent(urlPath.split("?")[0].split("#")[0]);
  // Resolve against ROOT and confirm the result stayed inside it: without this
  // a request for /../../secrets would escape the repo.
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
    // The deployed site is cached by Pages; locally that only ever hides edits.
    "Cache-Control": "no-store",
  });
  res.end(head ? undefined : body);
});

server.listen(PORT, () => {
  console.log(`Serving http://localhost:${PORT}  (Ctrl+C to stop)`);
});
