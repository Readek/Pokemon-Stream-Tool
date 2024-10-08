const path = require('path')
const fs = require('fs')
const { app, BrowserWindow } = require('electron')

// define the Resources folder, where all GUI code actually is
let resourcesPath;

// look for a Resources folder next to the executable
if (process.platform == "win32") { // if on Windows
    resourcesPath = path.resolve(process.env.PORTABLE_EXECUTABLE_DIR, 'Resources');
} else { // if on Linux
    resourcesPath = path.resolve('.', 'Resources');
}

// take note if the executable file does not exist where it should be
if (!fs.existsSync(`${resourcesPath}/Scripts/Executable.js`)) {
    resourcesPath = null;
}

// if no Resources folder next to exe, check if we got a custom Resources folder path
const dataPath = app.getPath('userData');
if (!resourcesPath && fs.existsSync(dataPath + "/rPath.json")) {
    // read path previously stored by the user
    resourcesPath = JSON.parse(fs.readFileSync(dataPath + "/rPath.json")).rPath;
}


loadExecFile();
async function loadExecFile() {

    // if everything is alright
    if (fs.existsSync(`${resourcesPath}/Scripts/Executable.js`)) {
        
        const executable = require(resourcesPath + "/Scripts/Executable.js");
        executable(resourcesPath, __dirname);

    } else { // if executable code is not found

        app.whenReady().then(() => {
            loadFailedWindow()
        });

        // close electron when all windows close (for Windows and Linux)
        app.on('window-all-closed', () => {
            if (process.platform !== 'darwin') {

                // store the Resources folder path given by the user
                fs.writeFileSync(dataPath + "/rPath.json", JSON.stringify(
                    {rPath: resourcesPath}, null, 2))

                // and good bye
                app.quit()

            }
        });

    }
    
}

function loadFailedWindow() {

    const win = new BrowserWindow({

        width: 600,
        height: 300,
        resizable: false,

        backgroundColor: "#383838",

        title: "Oh no", // will get overwitten by gui html title
        icon: path.join(__dirname, 'icon.png'),

        webPreferences: {
            preload: path.join(__dirname, 'preload.js'), // code for IPC communication
        }

    })

    // we dont like menus
    win.removeMenu()

    // load the actual file
    win.loadFile("failed.html");

    // reset folder path
    resourcesPath = null;

    // this will listen to the file picker and report folder selected
    const { dialog, ipcMain } = require('electron')
    ipcMain.on('select-dirs', async (event, arg) => {

        const result = await dialog.showOpenDialog(win, {
          properties: ['openDirectory']
        })

        // this variable will be saved on app close
        resourcesPath = result.filePaths[0];
        
      })

}