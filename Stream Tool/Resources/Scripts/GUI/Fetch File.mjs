import { inside } from "./Globals.mjs";

/**
 * Downloads a given url and stores the file locally
 * @param {string} url - Site to download from
 * @param {string} dest - Final file destination path
 * @returns {Promise<void>}
 */
export function fetchFile(url, dest) {

    if (inside.electron) {

        const http = require("https");
        const fs = require("fs");

        return new Promise((res) => {
            http.get(url, (response) => {
                if (response.statusCode == 302) {
                    // if the response is a redirection, we call the method again with the new location
                    res(fetchFile("https://" + response.client._host
                         + response.headers.location, dest));
                } else {

                    // create folders if needed
                    fs.mkdirSync(dest.substring(0, dest.lastIndexOf("/")), { recursive: true }, (err) => {
                        if (err) throw err;
                    });

                    const file = fs.createWriteStream(dest);

                    response.pipe(file);
                    file.on("finish", function () {
                        file.close();
                        res();
                    });
                }
            });
        });

    }

}