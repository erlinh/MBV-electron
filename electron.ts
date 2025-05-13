import { app, BrowserWindow } from 'electron';
import path from 'path';
import isDev from 'electron-is-dev';
// Use the TypeScript implementation
import { setupIpcHandlers } from './src/main/ipc/setup';

// Set the NODE_ENV for the renderer process
if (isDev) {
  process.env.NODE_ENV = 'development';
  console.log('[Main] Running in development mode');
} else {
  process.env.NODE_ENV = 'production';
  console.log('[Main] Running in production mode');
}

let mainWindow: BrowserWindow | null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'src/main/preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      // Add dev tools in development mode
      devTools: isDev,
      // Set the environment variable for the renderer process
      additionalArguments: [`--node-env=${process.env.NODE_ENV}`]
    },
  });

  const startUrl = isDev
    ? 'http://localhost:3000'
    : `file://${path.join(__dirname, 'dist/index.html')}`;

  console.log(`[Main] Loading URL: ${startUrl}`);
  mainWindow.loadURL(startUrl);

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();
  setupIpcHandlers();

  if (isDev) {
    // In development mode, start the HTTP API server
    console.log('[Main] Starting development API server');
    require('./src/main/api/server');
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
}); 