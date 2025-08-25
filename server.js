{
    let _ = await import("./{}.js");
    _.perbaiki(import.meta.url);
    var { ambilFile, async } = _;
}

import http from "http";
import mime from "mime-types";
const server = http.createServer((q, s) => {
    var { url } = q;
    if (url == "/") url = "/beranda.html";
    const ext = "." + url.split('.').pop();

    s.setHeader("Content-Type", mime.lookup(ext) || "application/octet-stream");

    try {
        s.end(ambilFile("./UI" + url));
    } catch (err) {
        if (err.code === "ENOENT") {
            s.statusCode = 404;
            const accept = q.headers["accept"] || "";
            if (accept.includes("text/html")) {
                s.setHeader("Content-Type", "text/html");
                s.end(ambilFile("./404.html"));
            } else {
                s.setHeader("Content-Type", "text/plain");
                s.end("404 Tidak Ditemukan");
            }
        } else {
            s.statusCode = 500;
            s.setHeader("Content-Type", "text/plain");
            s.end("Internal Server Error");
        }
    }
});

server.listen(process.env.PORT || 80);