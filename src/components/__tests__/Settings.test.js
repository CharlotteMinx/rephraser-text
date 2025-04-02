import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Settings from '../Settings';

// Mock the MUI icons
jest.mock('@mui/icons-material/Settings', () => () => <span data-testid="settings-icon" />);
jest.mock('@mui/icons-material/Close', () => () => <span data-testid="close-icon" />);

describe('Settings Component', () => {
  const mockSettings = {
    apiKey: 'test-api-key',
    autostart: false
  };
  
  const mockOnClose = jest.fn();
  const mockOnSave = jest.fn();
  const mockOnOpen = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('renders settings icon when closed', () => {
    render(
      <Settings 
        open={false} 
        onClose={mockOnClose} 
        settings={mockSettings} 
        onSave={mockOnSave} 
        onOpen={mockOnOpen} 
      />
    );
    
    const settingsIcon = screen.getByTestId('settings-icon');
    expect(settingsIcon).toBeInTheDocument();
    
    // Drawer should not be present when closed
    expect(screen.queryByText('Settings')).toBeNull();
  });
  
  test('opens settings drawer when settings icon is clicked', () => {
    render(
      <Settings 
        open={false} 
        onClose={mockOnClose} 
        settings={mockSettings} 
        onSave={mockOnSave} 
        onOpen={mockOnOpen} 
      />
    );
    
    const settingsButton = screen.getByLabelText('settings');
    fireEvent.click(settingsButton);
    
    expect(mockOnOpen).toHaveBeenCalled();
  });
  
  test('renders drawer content when open', () => {
    render(
      <Settings 
        open={true} 
        onClose={mockOnClose} 
        settings={mockSettings} 
        onSave={mockOnSave} 
        onOpen={mockOnOpen} 
      />
    );
    
    // Check for drawer content
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Gemini API Key')).toBeInTheDocument();
    expect(screen.getByText('Start with Windows')).toBeInTheDocument();
    expect(screen.getByText('Save Settings')).toBeInTheDocument();
  });
  
  test('closes drawer when close button is clicked', () => {
    render(
      <Settings 
        open={true} 
        onClose={mockOnClose} 
        settings={mockSettings} 
        onSave={mockOnSave} 
        onOpen={mockOnOpen} 
      />
    );
    
    const closeButton = screen.getByTestId('close-icon').closest('button');
    fireEvent.click(closeButton);
    
    expect(mockOnClose).toHaveBeenCalled();
  });
  
  test('updates API key when input changes', () => {
    render(
      <Settings 
        open={true} 
        onClose={mockOnClose} 
        settings={mockSettings} 
        onSave={mockOnSave} 
        onOpen={mockOnOpen} 
      />
    );
    
    const apiKeyInput = screen.getByPlaceholderText('Enter your API key');
    fireEvent.change(apiKeyInput, { target: { value: 'new-api-key' } });
    
    const saveButton = screen.getByText('Save Settings');
    fireEvent.click(saveButton);
    
    expect(mockOnSave).toHaveBeenCalledWith({
      apiKey: 'new-api-key',
      autostart: false
    });
  });
  
  test('updates autostart when switch is toggled', () => {
    render(
      <Settings 
        open={true} 
        onClose={mockOnClose} 
        settings={mockSettings} 
        onSave={mockOnSave} 
        onOpen={mockOnOpen} 
      />
    );
    
    const autostartSwitch = screen.getByRole('checkbox');
    fireEvent.click(autostartSwitch);
    
    const saveButton = screen.getByText('Save Settings');
    fireEvent.click(saveButton);
    
    expect(mockOnSave).toHaveBeenCalledWith({
      apiKey: 'test-api-key',
      autostart: true
    });
  });
  
  test('opens external link when Google AI Studio link is clicked', () => {
    render(
      <Settings 
        open={true} 
        onClose={mockOnClose} 
        settings={mockSettings} 
        onSave={mockOnSave} 
        onOpen={mockOnOpen} 
      />
    );
    
    const link = screen.getByText('Google AI Studio');
    fireEvent.click(link);
    
    expect(window.electron.openExternalLink).toHaveBeenCalledWith('https://makersuite.google.com/app/apikey');
  });
});
