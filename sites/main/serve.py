#!/usr/bin/env python3
"""Local preview server that behaves like GitHub Pages.

Pages serves /about from about.html, /dir/ from dir/index.html, and falls back
to 404.html for anything missing. Python's built-in http.server does none of
that, so navigation would 404 locally even though it works once deployed.

    python serve.py [port]        # default 8000

Use this rather than opening the files directly: the site uses root-absolute
paths (/assets/style.css), which resolve against your C: drive under file://
and so load nothing. Third-party embeds also refuse to load from a file://
origin, because those are treated as unique origins with no host.
"""

import os
import sys
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler


class PagesHandler(SimpleHTTPRequestHandler):
    def translate_path(self, path):
        local = super().translate_path(path)
        if os.path.isdir(local):
            index = os.path.join(local, "index.html")
            if os.path.exists(index):
                return index
        if not os.path.exists(local) and os.path.exists(local + ".html"):
            return local + ".html"
        return local

    def send_error(self, code, message=None, explain=None):
        if code == 404 and os.path.exists("404.html"):
            with open("404.html", "rb") as fh:
                body = fh.read()
            self.send_response(404)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            if self.command != "HEAD":
                self.wfile.write(body)
            return
        super().send_error(code, message, explain)


if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    print(f"Serving http://localhost:{port}  (Ctrl+C to stop)", flush=True)
    # Threaded, not plain HTTPServer: browsers open speculative keep-alive
    # connections, and a single-threaded server lets one of them occupy the
    # only handler thread — every later request is then refused and the
    # preview looks dead while the process is still running.
    ThreadingHTTPServer(("", port), PagesHandler).serve_forever()
