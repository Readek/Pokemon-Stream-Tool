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

        const dest = __dirname + "/Temp/GitDownload.zip";

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

    const zip = new AdmZip(__dirname + "/Temp/GitDownload.zip");
    const zipEntries = zip.getEntries();

    const filesPath = zipEntries[0].entryName + "Stream Tool/";

    zip.extractEntryTo(
        filesPath, // entry name
        __dirname + "/Temp", // target path
        true, // maintainEntryPath
        true // overwrite
    );

    // copy the files over and replace any
    fs.cpSync(
        __dirname + "/Temp/" + filesPath + "Overlays",
        __dirname + "/../Overlays",
        {recursive: true}
    );
    fs.cpSync(
        __dirname + "/Temp/" + filesPath + "Resources",
        __dirname + "/../Resources",
        {recursive: true}
    );

    fs.rmSync(__dirname + "/Temp", { recursive: true});

    return true;

}