// Mock the electron modules
const mockIpcRenderer = {
  invoke: jest.fn()
};

const mockContextBridge = {
  exposeInMainWorld: jest.fn()
};

jest.mock('electron', () => ({
  contextBridge: mockContextBridge,
  ipcRenderer: mockIpcRenderer
}));

describe('Preload Script', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Reset module cache to reload preload.js
    jest.resetModules();
    
    // Import preload.js
    require('../preload');
  });
  
  test('exposes electron API to renderer process', () => {
    // Check that contextBridge.exposeInMainWorld was called with the correct arguments
    expect(mockContextBridge.exposeInMainWorld).toHaveBeenCalledWith(
      'electron',
      expect.objectContaining({
        getSettings: expect.any(Function),
        saveSettings: expect.any(Function),
        showNotification: expect.any(Function),
        copyToClipboard: expect.any(Function),
        openExternalLink: expect.any(Function)
      })
    );
  });
  
  test('getSettings invokes the correct IPC channel', () => {
    // Get the exposed API
    const exposedApi = mockContextBridge.exposeInMainWorld.mock.calls[0][1];
    
    // Call getSettings
    exposedApi.getSettings();
    
    // Check that ipcRenderer.invoke was called with the correct channel
    expect(mockIpcRenderer.invoke).toHaveBeenCalledWith('get-settings');
  });
  
  test('saveSettings invokes the correct IPC channel with settings', () => {
    // Get the exposed API
    const exposedApi = mockContextBridge.exposeInMainWorld.mock.calls[0][1];
    
    // Mock settings
    const mockSettings = { apiKey: 'test-key', autostart: true };
    
    // Call saveSettings
    exposedApi.saveSettings(mockSettings);
    
    // Check that ipcRenderer.invoke was called with the correct channel and settings
    expect(mockIpcRenderer.invoke).toHaveBeenCalledWith('save-settings', mockSettings);
  });
  
  test('showNotification invokes the correct IPC channel with message', () => {
    // Get the exposed API
    const exposedApi = mockContextBridge.exposeInMainWorld.mock.calls[0][1];
    
    // Mock message
    const mockMessage = 'Test notification message';
    
    // Call showNotification
    exposedApi.showNotification(mockMessage);
    
    // Check that ipcRenderer.invoke was called with the correct channel and message
    expect(mockIpcRenderer.invoke).toHaveBeenCalledWith('show-notification', mockMessage);
  });
  
  test('copyToClipboard invokes the correct IPC channel with text', () => {
    // Get the exposed API
    const exposedApi = mockContextBridge.exposeInMainWorld.mock.calls[0][1];
    
    // Mock text
    const mockText = 'Test clipboard text';
    
    // Call copyToClipboard
    exposedApi.copyToClipboard(mockText);
    
    // Check that ipcRenderer.invoke was called with the correct channel and text
    expect(mockIpcRenderer.invoke).toHaveBeenCalledWith('copy-to-clipboard', mockText);
  });
  
  test('openExternalLink invokes the correct IPC channel with URL', () => {
    // Get the exposed API
    const exposedApi = mockContextBridge.exposeInMainWorld.mock.calls[0][1];
    
    // Mock URL
    const mockUrl = 'https://example.com';
    
    // Call openExternalLink
    exposedApi.openExternalLink(mockUrl);
    
    // Check that ipcRenderer.invoke was called with the correct channel and URL
    expect(mockIpcRenderer.invoke).toHaveBeenCalledWith('open-external-link', mockUrl);
  });
});
