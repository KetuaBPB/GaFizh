{
    let _ = await import("./{}.js");
    _.perbaiki(import.meta.url);
    var { ambilFile, async } = _;
}

import express from "express";
const app = express();

app.get("/", (q, s) => {
    s.send("Hello Railway 🚂");
    s.end(ambilFile("./UI/beranda.html"));
});

app.listen(process.env.PORT || 3000);