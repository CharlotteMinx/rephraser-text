// Import Jest DOM extensions
import '@testing-library/jest-dom';

// Mock the electron object that's exposed via preload.js
global.window.electron = {
  getSettings: jest.fn().mockResolvedValue({ apiKey: 'test-api-key', autostart: false }),
  saveSettings: jest.fn().mockResolvedValue({ success: true }),
  showNotification: jest.fn().mockResolvedValue({ success: true }),
  copyToClipboard: jest.fn().mockResolvedValue({ success: true }),
  openExternalLink: jest.fn().mockResolvedValue({ success: true })
};

// Mock console methods to avoid cluttering test output
global.console = {
  ...console,
  // Keep error for debugging
  error: jest.fn(),
  // Silence less important logs during tests
  log: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
};
