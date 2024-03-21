const { app, BrowserWindow } = require('electron');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    minWidth: 1200,
    minHeight: 800,
    center: true,
    show: false, // Don't show the window initially
    webPreferences: {
      nodeIntegration: true
    }
  });

  mainWindow.maximize(); // Maximize the window by default

  mainWindow.loadFile('./msm/browser/index.html'); // Load Angular app

  // Wait for the window to be ready to show
  mainWindow.once('ready-to-show', () => {
    mainWindow.show(); 
    // Add any other initialization logic here
  });

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});
