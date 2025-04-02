import React, { useState } from 'react';
import {
  Drawer,
  IconButton,
  Typography,
  Box,
  TextField,
  Button,
  FormControlLabel,
  Switch,
  Divider
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import CloseIcon from '@mui/icons-material/Close';

function Settings({ open, onClose, settings, onSave, onOpen }) {
  const [apiKey, setApiKey] = useState(settings.apiKey);
  const [autostart, setAutostart] = useState(settings.autostart);

  // Update local state when settings prop changes
  React.useEffect(() => {
    setApiKey(settings.apiKey);
    setAutostart(settings.autostart);
  }, [settings]);

  const handleSave = () => {
    onSave({
      apiKey,
      autostart
    });
  };

  return (
    <>
      {/* Settings Icon */}
      <IconButton
        className="settings-icon"
        onClick={onOpen}
        color="primary"
        aria-label="settings"
        sx={{ position: 'absolute', top: 16, right: 16 }}
      >
        <SettingsIcon />
      </IconButton>

      {/* Settings Drawer */}
      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
      >
        <Box className="settings-drawer" sx={{ width: 300, p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Settings</Typography>
            <IconButton onClick={onClose} edge="end">
              <CloseIcon />
            </IconButton>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Box className="settings-field" sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Gemini API Key
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your API key"
            />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              Your API key is stored locally and never shared.
              <Box component="span" sx={{ display: 'block', mt: 1 }}>
                Get your API key from{' '}
                <Box 
                  component="a" 
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (window.electron && window.electron.openExternalLink) {
                      window.electron.openExternalLink('https://makersuite.google.com/app/apikey');
                    } else {
                      window.open('https://makersuite.google.com/app/apikey', '_blank');
                    }
                  }}
                  sx={{ 
                    color: 'primary.main',
                    textDecoration: 'underline',
                    cursor: 'pointer'
                  }}
                >
                  Google AI Studio
                </Box>
              </Box>
            </Typography>
          </Box>

          <Box className="settings-field" sx={{ mb: 3 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={autostart}
                  onChange={(e) => setAutostart(e.target.checked)}
                  color="primary"
                />
              }
              label="Start with Windows"
            />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              Launch Text Rephraser when you log in to Windows.
            </Typography>
          </Box>

          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleSave}
            sx={{ mt: 2 }}
          >
            Save Settings
          </Button>
        </Box>
      </Drawer>
    </>
  );
}

export default Settings;
