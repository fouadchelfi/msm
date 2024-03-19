const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let mainWindow;
let nestProcess;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 600,
        height: 600,
        maximizable: false,        
        webPreferences: {
          nodeIntegration: true,
          contextIsolation: false,
        }
    });

    mainWindow.loadFile(path.join(__dirname, 'index.html'));

    mainWindow.on('closed', function () {
        mainWindow = null;
    });
}

app.on('ready', () => {
    createWindow();
    // Launch Nest.js server when the Electron app is ready
    nestProcess = spawn('node', ['./dist/main.js']);
    // Server process stdout and stderr handling...
});

app.on('window-all-closed', function () {
    // Window close code...
});

app.on('activate', function () {
    // Activate code...
});

ipcMain.on('stopServer', () => {
      console.log('Received stopServer event');
    if (nestProcess) {
        nestProcess.kill('SIGINT'); // Send SIGINT signal to gracefully stop the server
        nestProcess = null;
      setTimeout(() => {
        //mainWindow.close(); // Close the window after stopping the server
      }, 1000);
    }
});

ipcMain.on('restartServer', () => {
      console.log('Received restartServer event');
    if (!nestProcess) {
      // Launch Nest.js server when the Electron app is ready
      nestProcess = spawn('node', ['./dist/main.js']);
      // Server process stdout and stderr handling...
    }
});

// Define stopServer function to be called from renderer process
// exports.stopServer = () => {
//     if (nestProcess) {
//         nestProcess.kill('SIGINT');
//         nestProcess = null;
//     }
// };
