import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper } from '@mui/material';
import TextInput from './components/TextInput.js';
import RephrasingButtons from './components/RephrasingButtons.js';
import Settings from './components/Settings.js';
import { processWithGemini } from './services/geminiService.js';

function App() {
  const [text, setText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settings, setSettings] = useState({
    apiKey: '',
    autostart: false
  });

  // Load settings on component mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        if (window.electron && window.electron.getSettings) {
          const savedSettings = await window.electron.getSettings();
          setSettings(savedSettings);
        } else {
          console.warn('Settings API not available, using defaults');
        }
      } catch (error) {
        console.error('Failed to load settings:', error);
      }
    };
    
    loadSettings();
  }, []);

  const handleTextChange = (event) => {
    setText(event.target.value);
  };

  const handleRephrase = async (style) => {
    if (!text.trim()) return;
    
    setIsProcessing(true);
    
    try {
      const result = await processWithGemini(text, style, settings.apiKey);
      
      try {
        // Copy to clipboard
        if (window.electron && window.electron.copyToClipboard) {
          window.electron.copyToClipboard(result);
          
          // Show notification
          window.electron.showNotification('Rephrased text copied to clipboard!');
        } else {
          console.error('Clipboard functionality not available');
          // Fallback: show the result in a dialog or alert
          alert('Rephrased text: ' + result);
        }
      } catch (clipboardError) {
        console.error('Clipboard error:', clipboardError);
        alert('Rephrased text: ' + result);
      }
      
    } catch (error) {
      console.error('Error processing text:', error);
      if (window.electron && window.electron.showNotification) {
        window.electron.showNotification('Error processing text. Please try again.');
      } else {
        alert('Error processing text. Please try again.');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSaveSettings = async (newSettings) => {
    try {
      if (window.electron && window.electron.saveSettings) {
        await window.electron.saveSettings(newSettings);
      } else {
        console.warn('Settings API not available, using in-memory settings only');
      }
      setSettings(newSettings);
      setSettingsOpen(false);
    } catch (error) {
      console.error('Failed to save settings:', error);
      alert('Failed to save settings. Your changes will only be temporary.');
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3, position: 'relative' }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Text Rephraser
        </Typography>
        
        <TextInput 
          value={text} 
          onChange={handleTextChange} 
          disabled={isProcessing} 
        />
        
        <RephrasingButtons 
          onRephrase={handleRephrase} 
          disabled={isProcessing || !text.trim()} 
        />
        
        <Settings 
          open={settingsOpen} 
          onClose={() => setSettingsOpen(false)} 
          settings={settings} 
          onSave={handleSaveSettings} 
          onOpen={() => setSettingsOpen(true)} 
        />
      </Paper>
    </Container>
  );
}

export default App;
