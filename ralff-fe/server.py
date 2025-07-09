#!/usr/bin/python3
# serve.py
import os
from functools import partial
from http.server import SimpleHTTPRequestHandler, HTTPServer


class SPARequestHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path != "/" and not os.path.isdir(self.translate_path(self.path)):
            # if the folder doesn't exist, server the root index.html
            print(f"Routing {self.path} to /")
            self.path = "/index.html"
        return super().do_GET()


if __name__ == "__main__":
    PORT = 8000

    # Compute absolute path to ./dist relative to this script
    script_dir = os.path.dirname(os.path.abspath(__file__))
    dist_dir = os.path.join(script_dir, 'dist')

    if not os.path.isdir(dist_dir):
        exit(f"Error: cannot find '{dist_dir}' folder of bundle. Run 'npm run build' first.")

    # Use handler serving from dist
    handler = partial(SPARequestHandler, directory=dist_dir)

    with HTTPServer(("", PORT), handler) as httpd:
        print(f"Serving SPA from '{dist_dir}' at http://localhost:{PORT}")
        httpd.serve_forever()
