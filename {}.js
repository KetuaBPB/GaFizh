import fs from "fs"
import net from "net"
import { fileURLToPath, pathToFileURL } from "url"
import module from "module"
import inspector from "inspector"

/**
 * @template hasil
 * @template error
 * @param {(Return:(value:hasil)=>void,Throw:(value:error)=>void)=>void} then
 * @returns {hasil}
 */
export async function async(then) { return await { then } }

export function perbaiki(path) {
    var cwd = /(.*\/).*$/.exec(path)[1];
    {
        let { url, open, console: K } = inspector;
        if (!url()) open();
        [global.console, global.require] = [K, module.createRequire(cwd)];
        console.log(`devtools://devtools/bundled/js_app.html?ws=${/^.{5}(.*)/.exec(url())[1]}`);
    }
    process.chdir(fileURLToPath(cwd));
    return cwd;
}

/**
@type {{
    [properti:string]:NonSharedBuffer[]
}}*/
let PenyimpananFile = {};
export function ambilFile(path) {
    var id = fs.realpathSync(path),
        penyimpanan = PenyimpananFile[id],
        waktuSekarang = fs.statSync(path).mtimeMs;
    if (penyimpanan) {
        let [waktu, data] = penyimpanan;
        if (waktu == waktuSekarang) return data;
    } else PenyimpananFile[id] = penyimpanan = [];
    var data = penyimpanan[1] = fs.readFileSync(path);
    penyimpanan[0] = waktuSekarang;
    return data;
}

export function pantauBerkas(path, apaYgKauLakukan) {
    fs.watch(path, (event, filename) => { })
}

export class hubungkan {
    constructor(ip, port = 80) {
        net.createConnection(port, ip, console.log);
    }
}

/**
 * @template {string} path
 * @param {path} file 
 * @param {(v:typeof import(path))=>void}listener
 */
export function watchMyEkspor(file, listener) {
    var urlFile = pathToFileURL(file).href;
    return fs.watchFile(file, () => {
        console.log("[INFO] Mencoba mengekspor ulang script terupdate:", file);
        import(`${urlFile}?update=${Date.now()}`).then(listener).catch(e => console.error('[ERROR] Gagal mengekspor ulang script terupdate:', file, e))
    })
}