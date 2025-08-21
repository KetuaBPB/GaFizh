{
    let _ = await import("./{}.js");
    _.perbaiki(import.meta.url);
    var { ambilFile, async } = _;
}
import https from "https";
https.createServer((q, s) => {
    s.writeHead(200, { "Content-Type": "text/html" });
    s.end(ambilFile("./frontEnd/beranda.html"));
}).listen(process.env.PORT || 3000);