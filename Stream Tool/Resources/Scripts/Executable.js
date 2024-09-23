const { app, BrowserWindow, ipcMain } = require('electron')
const fs = require('fs')
const path = require('path')
const http = require('http')

// this script is where everything starts
// however, there is a part of the code that runs before this script
// since its inside the executable, you wont be able to
// modify it unless youre able to build a new exe on your own
// you can find this code in the git's folder "Interface Source Code"

let resourcesPath, nodePath;
let httpPort, wsPort, guiWidth, guiHeight, failed;
let wsServer, sockets = [];
let storedSettings;
const storedGuiData = {
    settings : {},
    catches : {},
    team : {},
    player : {},
}

module.exports = function initExec(rPath, gPath, wSocket) {
    
    // set the resources path
    resourcesPath = rPath;
    nodePath = gPath; // this is the path from within the executable

    if (fs.existsSync(resourcesPath)) {

        if (fs.existsSync(`${resourcesPath}/Texts/GUI Settings.json`)) {
            // get some settings from our local settings file (if it exists)
            storedSettings = JSON.parse(fs.readFileSync(`${resourcesPath}/Texts/GUI Settings.json`));
        } else {
            // create default data
            storedSettings = {
                guiWidth: 647,
                guiHeight: 352,
                gameGen: 5,
                alwaysOnTop: false,
                resizable: false,
                zoom: 100,
                remoteUpdatePort: 1111,
                webSocketPort: 8080
            }
            // write down to a file
            fs.writeFileSync(`${resourcesPath}/Texts/GUI Settings.json`, JSON.stringify(storedSettings, null, 2));
        }
        
        // appoly that data to current state
        httpPort = storedSettings.remoteUpdatePort;
        wsPort = storedSettings.webSocketPort;
        guiWidth = storedSettings.guiWidth;
        guiHeight = storedSettings.guiHeight;
        if (process.platform == "win32") {
            guiWidth = guiWidth + 4; // windows why cant you be normal
            guiHeight = guiHeight + 36;
        }

        // initialize them servers
        initHttpServer();
        initWsServer(wSocket);

    } else {
        console.log("The resources folder could not be found!!");
        console.log(e);
        failed = true;
        httpPort = 7070;
        wsPort = 8080;
        guiWidth = 600;
        guiHeight = 300;
    }

}


function initHttpServer() {
    // start an http server on boot for remote update
    http.createServer((request, response) => {
        if (request.method === "GET" || request.method === "HEAD") {
            let fname;
            if (request.url == "/") { // main remote update page
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

/**
 * Starts the web socket server
 * @param {WebSocket} wSocket - Im sorry this is wrong
 */
function initWsServer(wSocket) {
    wsServer = new wSocket.Server({ port: wsPort });
}


function createWindow() {

    const win = new BrowserWindow({

        width: guiWidth,
        height: guiHeight,
        resizable: false,

        backgroundColor: "#383838",

        title: "Pokemon Stream Tool", // will get overwitten by gui html title
        icon: path.join(nodePath, 'icon.png'),

        webPreferences: {
            backgroundThrottling: false,
            // this is almost deprecated functionallity as of electron 15, however
            // i have not found a better way to make files external to the insides
            // of the exe work with electron, todo find a more updated way to do so
            nodeIntegration: true,
            contextIsolation: false
        },

    })

    // we dont like menus
    win.removeMenu()

    // load the main page
    if (failed) { // in case something failed earlier
        win.loadFile(path.join(nodePath, 'failed.html'));
    } else {
        win.loadFile(resourcesPath + "/GUI.html");
    }
    
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

    // window settings
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

    // when the GUI is ready to send data to browsers
    ipcMain.on('sendData', (event, data) => {

        const jsonData = JSON.parse(data);
        sockets.forEach(socket => {
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

    win.on("close", () => {
        // save current window dimensions
        guiWidth = win.getBounds().width;
        guiHeight = win.getBounds().height;
    })
    
}

// create window on startup
app.whenReady().then(() => {
    createWindow()
});

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
        fs.writeFileSync(`${resourcesPath}/Texts/GUI State.json`, JSON.stringify(storedGuiData, null, 2));
        
        // and good bye
        app.quit()
    }
});

// todo close electron for mac, if there ever is support for it that is