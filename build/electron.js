"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path_1 = __importDefault(require("path"));
const electron_is_dev_1 = __importDefault(require("electron-is-dev"));
// Use the TypeScript implementation
const setup_1 = require("./src/main/ipc/setup");
// Set the NODE_ENV for the renderer process
if (electron_is_dev_1.default) {
    process.env.NODE_ENV = 'development';
    console.log('[Main] Running in development mode');
}
else {
    process.env.NODE_ENV = 'production';
    console.log('[Main] Running in production mode');
}
let mainWindow;
function createWindow() {
    mainWindow = new electron_1.BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            preload: path_1.default.join(__dirname, 'src/main/preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
            // Add dev tools in development mode
            devTools: electron_is_dev_1.default,
            // Set the environment variable for the renderer process
            additionalArguments: [`--node-env=${process.env.NODE_ENV}`]
        },
    });
    const startUrl = electron_is_dev_1.default
        ? 'http://localhost:3000'
        : `file://${path_1.default.join(__dirname, 'dist/index.html')}`;
    console.log(`[Main] Loading URL: ${startUrl}`);
    mainWindow.loadURL(startUrl);
    if (electron_is_dev_1.default) {
        mainWindow.webContents.openDevTools();
    }
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}
electron_1.app.whenReady().then(() => {
    createWindow();
    (0, setup_1.setupIpcHandlers)();
    if (electron_is_dev_1.default) {
        // In development mode, start the HTTP API server
        console.log('[Main] Starting development API server');
        require('./src/main/api/server');
    }
});
electron_1.app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
electron_1.app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});
