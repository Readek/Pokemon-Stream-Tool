const { app, BrowserWindow, ipcMain } = require('electron')
const fs = require('fs')
const path = require('path')
const http = require('http')

// this script is where everything starts
// however, there is a part of the code that runs before this script
// since its inside the executable, you wont be able to
// modify it unless youre able to build a new exe on your own
// you can find this code in the git's folder "Interface Source Code"

let resourcesPath, nodePath,
    httpPort, wsPort, guiWidth, guiHeight,
    wsServer, sockets = [],
    storedSettings;
const storedGuiData = {
    settings : {},
    catches : {},
    team : {},
    player : {},
}

// called from script inside executable
module.exports = function initExec(rPath, nPath) {

    // set the resources path
    resourcesPath = rPath;
    nodePath = nPath; // this is the path from within the executable

    // get some settings from our local settings file (if it exists)
    const guiSettsJsonPath = `${resourcesPath}/Texts/GUI Settings.json`;
    if (fs.existsSync(guiSettsJsonPath)) {
        storedSettings = JSON.parse(fs.readFileSync(guiSettsJsonPath));
    } else {
        // if it doesnt, create default data
        storedSettings = {
            guiWidth: 647,
            guiHeight: 352,
            gameGen: 5,
            alwaysOnTop: false,
            resizable: false,
            zoom: 100,
            remoteUpdatePort: 1111,
            webSocketPort: 1112
        }
        // and write it down to a file
        fs.writeFileSync(guiSettsJsonPath, JSON.stringify(storedSettings, null, 2));
    }
    
    // apply that data to current state
    httpPort = storedSettings.remoteUpdatePort;
    wsPort = storedSettings.webSocketPort;
    guiWidth = storedSettings.guiWidth;
    guiHeight = storedSettings.guiHeight;

    // Windows seems to consider frame pixels in the window proportions :(
    if (process.platform == "win32") {
        guiWidth = guiWidth + 4;
        guiHeight = guiHeight + 36;
    }

    // initialize them servers
    initHttpServer();
    initWsServer();

}

/** Starts Http server used by remote GUIs */
function initHttpServer() {

    http.createServer((request, response) => {
        if (request.method === "GET" || request.method === "HEAD") {
            let fname;
            if (request.url == "/") { // main remote GUI page
                fname = resourcesPath + "/GUI.html";
            } else { // every other request will just send the file
                fname = resourcesPath + request.url;
            }
            try {
                fname = decodeURI(fname);
                if (request.method === "GET") {
                    fs.readFile(fname, (err, data) => {
                        if (err) {
                            response.writeHead(404);
                            console.log(fname);
                        } else {
                            if (fname.endsWith(".html")) {
                                response.writeHead(200, {'Content-Type': 'text/html'});
                            } else if (fname.endsWith(".js") || fname.endsWith(".mjs")) {
                                response.writeHead(200, {'Content-Type': 'text/javascript'});
                            } else if (fname.endsWith(".css")) {
                                response.writeHead(200, {'Content-Type': 'text/css'});
                            } else {
                                response.writeHead(200, {'Content-Type': 'text'});
                            }
                            response.write(data);
                        }
                        response.end();
                    });
                } else if (request.method === "HEAD") {
                    if (fs.existsSync(fname)) {
                        response.writeHead(200);
                    } else {
                        response.writeHead(404);
                    }
                    response.end();
                }
            } catch (e) {
                response.writeHead(404);
                response.end();
            }
        }
    }).listen(httpPort);
}

/** Starts the web socket server, connecting GUI with overlays and other remote GUIs */
function initWsServer() {
    const WebSocket = require(path.join(nodePath, 'node_modules', 'ws', 'index.js'));
    wsServer = new WebSocket.Server({ port: wsPort });
}

// create main window on startup
app.whenReady().then(() => {
    createWindow()
});

function createWindow() {

    const win = new BrowserWindow({

        resizable: false,

        // will be overwitten by css
        // however this prevents a brief flashbang when first loading
        backgroundColor: "#383838",

        title: "Pokemon Stream Tool", // will get overwitten by GUI html title
        icon: path.join(nodePath, 'icon.png'),

        webPreferences: {

            // prevents GUI not updating when minimized
            backgroundThrottling: false,

            // this could mean a potential? security risk, however there are many
            // scripts using node functions within the GUI window in this project
            // TODO research how to do this properly, maybe someday
            nodeIntegration: true,
            contextIsolation: false

        },

        // hide it until it finishes loading
        show: false,

    })

    // we dont like menus
    win.removeMenu()

    // once the page has fully loaded
    win.once('ready-to-show', () => {
        // since newer electron versions, height was incorrectly set before this step
        win.setBounds({width: guiWidth, height: guiHeight});
        // and finally show it!
        win.show();
    })

    // load the main page
    win.loadFile(resourcesPath + "/GUI.html");

    // keyboard shortcuts!
    win.webContents.on('before-input-event', (event, input) => {
        if (input.key === 'F5') { // refresh the page
            win.reload()
            event.preventDefault()
        } else if (input.key === 'F12') { // web console
            win.webContents.openDevTools()
            win.setResizable(true)
            event.preventDefault()
        }
    })

    // always on top toggle from the GUI
    ipcMain.on('alwaysOnTop', (event, arg) => {
        win.setAlwaysOnTop(arg)
    })

    // window resize GUI toggle
    ipcMain.on('resizable', (event, arg) => {
        win.setResizable(arg)
    })

    // restore default window dimensions
    ipcMain.on('defaultWindow', (event) => {
        // windows includes frame borders on the window dimensions and i hate it
        if (process.platform == "win32") {
            win.setBounds({width: 651, height: 390});
        } else {
            win.setBounds({width: 647, height: 352});
        }
    })

    wsServer.on('connection', (socket, req) => {

        // add this new connection to the array to keep track of them
        sockets.push({ws: socket, id: req.url.substring(5)})

        // when a new client connects, send current data
        win.webContents.send('requestData')
    
        // when a socket closes, or disconnects, remove it from the array.
        socket.on('close', function() {
            sockets = sockets.filter(s => s.ws !== socket)
        });

        // in case we get data externally, pass it to the GUI
        socket.on("message", data => {
            win.webContents.send('remoteGuiData', `${data}`)
        })
    
    });

    // when a request to update data is sent
    ipcMain.on('sendData', (event, data) => {

        const jsonData = JSON.parse(data);
        sockets.forEach(socket => {
            // only send this data to matching ids
            if (jsonData.id == socket.id) {
                socket.ws.send(data)
            }
        })

        // we will store this for later
        if (jsonData.id == "gameData") {
            if (jsonData.type == "Catches") {
                storedGuiData.catches = jsonData;
            } else if (jsonData.type == "Team") {
                storedGuiData.team = jsonData;
            } else if (jsonData.type == "Player") {
                storedGuiData.player = jsonData;
            }
        } else if (jsonData.id == "guiData") {
            storedGuiData.settings = jsonData;
        }

    })

    // we will store current settings, then save them on window close
    ipcMain.on('storeSettings', (event, data) => {
        storedSettings = data;
    })

    // this sends the temporal node path, used to find modules
    ipcMain.on('getNodePath', (event, data) => {
        win.webContents.send('giveNodePath', nodePath);
    })

    win.on("close", () => {
        // save current window dimensions
        guiWidth = win.getBounds().width;
        guiHeight = win.getBounds().height;
    })
    
}

// close electron when all windows close (for Windows and Linux)
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {

        // save current settings
        const data = storedSettings;
        // this is to determine proper window size because Windows sucks
        if (process.platform == "win32") {
            data.guiWidth = guiWidth - 4;
            data.guiHeight = guiHeight - 36;
        } else {
            data.guiWidth = guiWidth;
            data.guiHeight = guiHeight;
        }
        // write down that file
        fs.writeFileSync(`${resourcesPath}/Texts/GUI Settings.json`, JSON.stringify(data, null, 2));

        // save current GUI data state
        // we will also remove some unneded values so final file is lighter
        if (storedGuiData.catches.pokemons) {
            storedGuiData.catches.pokemons.forEach(poke => {
                delete poke.types;
                delete poke.img;
            });
        }
        if (storedGuiData.team.pokemons) {
            storedGuiData.team.pokemons.forEach(poke => {
                delete poke.types;
                delete poke.img;
                delete poke.itemCoords;
                delete poke.boosts;
                delete poke.iconCoords;
            });
        }
        fs.writeFileSync(`${resourcesPath}/Texts/GUI State.json`, JSON.stringify(storedGuiData, null, 2));

        // and good bye
        app.quit()
    }
});

// todo close electron for mac
// in theory, everything works on mac, however even if code to close
// windows was added, I would still need a mac myself to create the exec
// if you're interested in adding support for mac, please submit a pull request
// or hit me up on any of my social media (links on GitHub)