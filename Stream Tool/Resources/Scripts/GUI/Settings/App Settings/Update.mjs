import { stPath } from "../../Globals.mjs";

const url = 'https://api.github.com';
const user = 'Readek';
const repo = 'Pokemon-Stream-Tool';

/** Downloads latest project git and stores it on a temp folder */
export async function updateAppDownload() {

    const fs = require("fs");

    // get the url from Github's API
    const res = await fetch(`${url}/repos/${user}/${repo}/zipball/`, {
        headers: {'Accept' : 'application/vnd.github+json'}
    })

    if (res.ok) {

        const http = require("https");

        const dest = stPath.base + "/Temp/GitDownload.zip";

        // create folders if needed
        fs.mkdirSync(dest.substring(0, dest.lastIndexOf("/")), { recursive: true }, (err) => {
            if (err) throw err;
        });

        const file = fs.createWriteStream(dest);

        http.get(res.url, (response) => {
            response.pipe(file);
        });

        // we want to wait for the file to be downloaded
        let result;
        await new Promise((resolve, reject) => {
            file.on('finish', () => {
                file.close();
                result = true;
                resolve();
            }).on('error', err => {
                reject(err);
            });
        });

        return result;

    }

}

/** Decompresses the git's zip and moves the files to the Resources folder, replacing them */
export function updateAppReplace() {

    const fs = require("fs");
 
    const AdmZip = require(stPath.node + "/node_modules/adm-zip/adm-zip.js")

    const zip = new AdmZip(stPath.base + "/Temp/GitDownload.zip");
    const zipEntries = zip.getEntries();

    const filesPath = zipEntries[0].entryName + "Stream Tool/";

    zip.extractEntryTo(
        filesPath, // entry name
        stPath.base + "/Temp", // target path
        true, // maintainEntryPath
        true // overwrite
    );

    // copy the files over and replace any
    fs.cpSync(
        stPath.main + "/Temp/" + filesPath + "Overlays",
        stPath.main + "../Overlays",
        {recursive: true}
    );
    fs.cpSync(
        stPath.text + "/Temp/" + filesPath + "Resources",
        stPath.text + "../Resources",
        {recursive: true}
    );

    fs.rmSync(stPath.base + "/Temp", { recursive: true});

    return true;

}