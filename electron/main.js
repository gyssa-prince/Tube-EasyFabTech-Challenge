import { app, BrowserWindow } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';

// 1. Reconstruct __dirname for ES Modules (Critical for relative paths in build)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 2. Determine if we are in development or production
const isDev = !app.isPackaged;

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    title: "TubeJoint Pro",
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      devTools: true, // Keep true to debug if needed
      webSecurity: false // Optional: helps with some local resource loading issues
    },
    autoHideMenuBar: true
  });

  if (isDev) {
    // Development
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    // Production
    // Use path.join with __dirname to reliably find the sibling 'dist' folder
    // This works better inside ASAR archives than app.getAppPath()
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
    
    // Keep this open to verify it works, remove later
    // mainWindow.webContents.openDevTools(); 
  }
}

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