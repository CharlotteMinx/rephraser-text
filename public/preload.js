const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
  'electron', {
    getSettings: () => ipcRenderer.invoke('get-settings'),
    saveSettings: (settings) => ipcRenderer.invoke('save-settings', settings),
    showNotification: (message) => ipcRenderer.invoke('show-notification', message),
    copyToClipboard: (text) => ipcRenderer.invoke('copy-to-clipboard', text),
    openExternalLink: (url) => ipcRenderer.invoke('open-external-link', url)
  }
);
