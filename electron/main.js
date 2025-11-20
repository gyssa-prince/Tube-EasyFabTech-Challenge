const { app, BrowserWindow } = require('electron');
const path = require('path');

// Determine if we are in development or production
const isDev = !app.isPackaged;

function createWindow() {
  // Create the browser window
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    title: "TubeJoint Pro",
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false, // Simplified security for local tool
      devTools: isDev // Enable devTools only in dev mode by default
    },
    autoHideMenuBar: true // Hide default menu bar for a cleaner desktop app look
  });

  if (isDev) {
    // In development, load from the Vite dev server
    // We use a timeout or wait-on in the script to ensure Vite is ready
    mainWindow.loadURL('http://localhost:5173');
    
    // Open DevTools automatically in dev mode
    mainWindow.webContents.openDevTools();
  } else {
    // In production, load the built index.html file
    // Assuming main.js is in /electron/ and build is in /dist/
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

// App lifecycle methods
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});