import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import RephrasingButtons from '../RephrasingButtons';

// Mock the MUI icons
jest.mock('@mui/icons-material/Code', () => () => <span data-testid="code-icon" />);
jest.mock('@mui/icons-material/EmojiEmotions', () => () => <span data-testid="emoji-icon" />);
jest.mock('@mui/icons-material/BusinessCenter', () => () => <span data-testid="business-icon" />);
jest.mock('@mui/icons-material/Whatshot', () => () => <span data-testid="whatshot-icon" />);

describe('RephrasingButtons Component', () => {
  test('renders all style buttons', () => {
    const mockOnRephrase = jest.fn();
    render(<RephrasingButtons onRephrase={mockOnRephrase} disabled={false} />);
    
    expect(screen.getByText('Developer')).toBeInTheDocument();
    expect(screen.getByText('Friendly')).toBeInTheDocument();
    expect(screen.getByText('Business')).toBeInTheDocument();
    expect(screen.getByText('Gen-Z')).toBeInTheDocument();
  });

  test('calls onRephrase with correct style when button is clicked', () => {
    const mockOnRephrase = jest.fn();
    render(<RephrasingButtons onRephrase={mockOnRephrase} disabled={false} />);
    
    fireEvent.click(screen.getByText('Developer'));
    expect(mockOnRephrase).toHaveBeenCalledWith('developer');
    
    fireEvent.click(screen.getByText('Friendly'));
    expect(mockOnRephrase).toHaveBeenCalledWith('friendly');
    
    fireEvent.click(screen.getByText('Business'));
    expect(mockOnRephrase).toHaveBeenCalledWith('business');
    
    fireEvent.click(screen.getByText('Gen-Z'));
    expect(mockOnRephrase).toHaveBeenCalledWith('gen-z');
  });

  test('disables all buttons when disabled prop is true', () => {
    const mockOnRephrase = jest.fn();
    render(<RephrasingButtons onRephrase={mockOnRephrase} disabled={true} />);
    
    const buttons = screen.getAllByRole('button');
    buttons.forEach(button => {
      expect(button).toBeDisabled();
    });
    
    // Try clicking a disabled button
    fireEvent.click(screen.getByText('Developer'));
    expect(mockOnRephrase).not.toHaveBeenCalled();
  });

  test('buttons are enabled when disabled prop is false', () => {
    const mockOnRephrase = jest.fn();
    render(<RephrasingButtons onRephrase={mockOnRephrase} disabled={false} />);
    
    const buttons = screen.getAllByRole('button');
    buttons.forEach(button => {
      expect(button).not.toBeDisabled();
    });
  });
});
