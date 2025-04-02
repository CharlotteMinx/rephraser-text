import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../App';
import { processWithGemini } from '../services/geminiService';

// Mock the geminiService
jest.mock('../services/geminiService', () => ({
  processWithGemini: jest.fn()
}));

// Mock the MUI components
jest.mock('@mui/material', () => {
  const actual = jest.requireActual('@mui/material');
  return {
    ...actual,
    CircularProgress: () => <div data-testid="loading-spinner">Loading...</div>
  };
});

// Mock the child components
jest.mock('../components/TextInput', () => ({ value, onChange, disabled }) => (
  <div data-testid="text-input">
    <textarea 
      value={value} 
      onChange={onChange} 
      disabled={disabled} 
      placeholder="Enter or paste your text here..."
    />
  </div>
));

jest.mock('../components/RephrasingButtons', () => ({ onRephrase, disabled }) => (
  <div data-testid="rephrasing-buttons">
    <button 
      onClick={() => onRephrase('developer')} 
      disabled={disabled}
      data-style="developer"
    >
      Developer
    </button>
    <button 
      onClick={() => onRephrase('friendly')} 
      disabled={disabled}
      data-style="friendly"
    >
      Friendly
    </button>
    <button 
      onClick={() => onRephrase('business')} 
      disabled={disabled}
      data-style="business"
    >
      Business
    </button>
    <button 
      onClick={() => onRephrase('gen-z')} 
      disabled={disabled}
      data-style="gen-z"
    >
      Gen-Z
    </button>
  </div>
));

jest.mock('../components/Settings', () => ({ open, onClose, settings, onSave, onOpen }) => (
  <div data-testid="settings-component">
    <button onClick={onOpen} aria-label="open-settings">Open Settings</button>
    {open && (
      <div data-testid="settings-drawer">
        <button onClick={onClose}>Close</button>
        <button onClick={() => onSave({ ...settings, apiKey: 'new-key' })}>Save</button>
      </div>
    )}
  </div>
));

describe('App Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock successful API response
    processWithGemini.mockResolvedValue('Rephrased text result');
  });
  
  test('renders the app title', () => {
    render(<App />);
    expect(screen.getByText('Text Rephraser')).toBeInTheDocument();
  });
  
  test('renders TextInput component', () => {
    render(<App />);
    expect(screen.getByTestId('text-input')).toBeInTheDocument();
  });
  
  test('renders RephrasingButtons component', () => {
    render(<App />);
    expect(screen.getByTestId('rephrasing-buttons')).toBeInTheDocument();
  });
  
  test('renders Settings component', () => {
    render(<App />);
    expect(screen.getByTestId('settings-component')).toBeInTheDocument();
  });
  
  test('updates text state when input changes', () => {
    render(<App />);
    
    const input = screen.getByPlaceholderText('Enter or paste your text here...');
    fireEvent.change(input, { target: { value: 'New text input' } });
    
    // Check that the buttons are enabled when text is entered
    const buttons = screen.getAllByRole('button');
    const styleButtons = buttons.filter(button => button.hasAttribute('data-style'));
    
    styleButtons.forEach(button => {
      expect(button).not.toBeDisabled();
    });
  });
  
  test('disables buttons when text is empty', () => {
    render(<App />);
    
    const input = screen.getByPlaceholderText('Enter or paste your text here...');
    fireEvent.change(input, { target: { value: '' } });
    
    const buttons = screen.getAllByRole('button');
    const styleButtons = buttons.filter(button => button.hasAttribute('data-style'));
    
    styleButtons.forEach(button => {
      expect(button).toBeDisabled();
    });
  });
  
  test('processes text when a style button is clicked', async () => {
    render(<App />);
    
    // Enter text
    const input = screen.getByPlaceholderText('Enter or paste your text here...');
    fireEvent.change(input, { target: { value: 'Text to rephrase' } });
    
    // Click a style button
    const developerButton = screen.getByText('Developer');
    fireEvent.click(developerButton);
    
    // Check loading state
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    
    // Wait for processing to complete
    await waitFor(() => {
      expect(processWithGemini).toHaveBeenCalledWith(
        'Text to rephrase', 
        'developer',
        expect.any(String)
      );
    });
    
    // Check that clipboard was called
    expect(window.electron.copyToClipboard).toHaveBeenCalledWith('Rephrased text result');
    
    // Check notification was shown
    expect(window.electron.showNotification).toHaveBeenCalledWith(
      'Rephrased text copied to clipboard!'
    );
  });
  
  test('handles API errors gracefully', async () => {
    // Mock API error
    processWithGemini.mockRejectedValueOnce(new Error('API error'));
    
    render(<App />);
    
    // Enter text
    const input = screen.getByPlaceholderText('Enter or paste your text here...');
    fireEvent.change(input, { target: { value: 'Text to rephrase' } });
    
    // Click a style button
    const friendlyButton = screen.getByText('Friendly');
    fireEvent.click(friendlyButton);
    
    // Wait for error handling
    await waitFor(() => {
      expect(window.electron.showNotification).toHaveBeenCalledWith(
        'Error processing text. Please try again.'
      );
    });
  });
  
  test('opens settings when settings button is clicked', () => {
    render(<App />);
    
    const openSettingsButton = screen.getByLabelText('open-settings');
    fireEvent.click(openSettingsButton);
    
    expect(screen.getByTestId('settings-drawer')).toBeInTheDocument();
  });
  
  test('saves settings when save button is clicked', async () => {
    render(<App />);
    
    // Open settings
    const openSettingsButton = screen.getByLabelText('open-settings');
    fireEvent.click(openSettingsButton);
    
    // Save settings
    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);
    
    // Check that settings were saved
    expect(window.electron.saveSettings).toHaveBeenCalled();
    
    // Settings drawer should be closed
    await waitFor(() => {
      expect(screen.queryByTestId('settings-drawer')).not.toBeInTheDocument();
    });
  });
});
