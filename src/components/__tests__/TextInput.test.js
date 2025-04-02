import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TextInput from '../TextInput';

describe('TextInput Component', () => {
  test('renders correctly', () => {
    const mockOnChange = jest.fn();
    render(<TextInput value="" onChange={mockOnChange} disabled={false} />);
    
    const textField = screen.getByPlaceholderText('Enter or paste your text here...');
    expect(textField).toBeInTheDocument();
  });

  test('handles text input correctly', () => {
    const mockOnChange = jest.fn();
    render(<TextInput value="" onChange={mockOnChange} disabled={false} />);
    
    const textField = screen.getByPlaceholderText('Enter or paste your text here...');
    fireEvent.change(textField, { target: { value: 'Test input text' } });
    
    expect(mockOnChange).toHaveBeenCalled();
  });

  test('disables input when disabled prop is true', () => {
    const mockOnChange = jest.fn();
    render(<TextInput value="" onChange={mockOnChange} disabled={true} />);
    
    const textField = screen.getByPlaceholderText('Enter or paste your text here...');
    expect(textField).toBeDisabled();
  });

  test('displays the provided value', () => {
    const mockOnChange = jest.fn();
    const testValue = 'Test value';
    render(<TextInput value={testValue} onChange={mockOnChange} disabled={false} />);
    
    const textField = screen.getByPlaceholderText('Enter or paste your text here...');
    expect(textField).toHaveValue(testValue);
  });
});
