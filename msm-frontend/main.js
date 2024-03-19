// main.ts

const app = require('electron').app;
const BrowserWindow = require('electron').BrowserWindow;
const ipcMain = require('electron').ipcMain;

// Create your main window or other Electron main process code
function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false, // Set to false to use @electron/remote
    }
  });

  // Load the Angular app
  mainWindow.loadURL('http://localhost:4200');

  // Open the DevTools if needed
  mainWindow.webContents.openDevTools();
}

// Enable @electron/remote with the webContents argument
app.whenReady().then(() => {
  const mainWindow = createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});