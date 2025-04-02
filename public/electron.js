const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const url = require('url');
const fs = require('fs');
const notifier = require('node-notifier');
require('dotenv').config();

// Conditional logging based on environment
if (process.env.NODE_ENV === 'development') {
  console.log('Starting Text Rephraser application...');
  console.log('__dirname:', __dirname);
}

// Simple settings store implementation
class SettingsStore {
  constructor(defaults) {
    this.path = path.join(app.getPath('userData'), 'settings.json');
    this.defaults = defaults;
    this.data = this.load();
  }

  load() {
    try {
      return fs.existsSync(this.path) 
        ? JSON.parse(fs.readFileSync(this.path, 'utf8')) 
        : this.defaults;
    } catch (error) {
      console.error('Failed to load settings:', error);
      return this.defaults;
    }
  }

  save() {
    try {
      fs.writeFileSync(this.path, JSON.stringify(this.data, null, 2));
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  }

  get(key) {
    return this.data[key] !== undefined ? this.data[key] : this.defaults[key];
  }

  set(key, value) {
    this.data[key] = value;
    this.save();
  }
}

// Initialize store for settings
const store = new SettingsStore({
  apiKey: process.env.GEMINI_API_KEY || '', // Default API key from environment variable
  autostart: false
});

// Keep a global reference of the window object
let mainWindow;

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 900,
    height: 700,
    minWidth: 600,
    minHeight: 500,
    backgroundColor: '#121212', // Dark background color
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    show: false, // Don't show until ready
    title: 'Text Rephraser'
  });
  
  // Show window when ready to avoid flickering
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Load the index.html of the app
  const startUrl = process.env.ELECTRON_START_URL || url.format({
    pathname: path.join(__dirname, '../dist/index.html'),
    protocol: 'file:',
    slashes: true
  });
  mainWindow.loadURL(startUrl);
  
  // Open DevTools only in development mode
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
    
    // Log when the window is ready to show
    mainWindow.webContents.on('did-finish-load', () => {
      console.log('Window loaded successfully');
    });
    
    // Log any errors that occur during loading
    mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
      console.error('Failed to load window:', errorDescription);
    });
  }

  // Emitted when the window is closed
  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows
app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open
    if (mainWindow === null) createWindow();
  });
});

// Quit when all windows are closed, except on macOS
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

// IPC handlers
ipcMain.handle('get-settings', async () => {
  return {
    apiKey: store.get('apiKey'),
    autostart: store.get('autostart')
  };
});

ipcMain.handle('copy-to-clipboard', async (event, text) => {
  try {
    require('electron').clipboard.writeText(text);
    return { success: true };
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('save-settings', async (event, settings) => {
  store.set('apiKey', settings.apiKey);
  store.set('autostart', settings.autostart);
  
  // Handle autostart setting
  const appPath = app.getPath('exe');
  
  if (settings.autostart) {
    app.setLoginItemSettings({
      openAtLogin: true,
      path: appPath,
      args: []
    });
  } else {
    app.setLoginItemSettings({
      openAtLogin: false,
      path: appPath,
      args: []
    });
  }
  
  return { success: true };
});

ipcMain.handle('show-notification', async (event, message) => {
  const notificationOptions = {
    title: 'Text Rephraser',
    message: message,
    sound: true
  };
  
  // Only add icon if it exists
  const iconPath = path.join(__dirname, 'icon.png');
  if (fs.existsSync(iconPath)) {
    notificationOptions.icon = iconPath;
  }
  
  notifier.notify(notificationOptions);
  
  return { success: true };
});
