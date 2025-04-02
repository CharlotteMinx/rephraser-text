import React from 'react';
import { TextField, Box } from '@mui/material';

function TextInput({ value, onChange, disabled }) {
  return (
    <Box sx={{ mb: 3 }}>
      <TextField
        fullWidth
        multiline
        minRows={6}
        maxRows={12}
        variant="outlined"
        placeholder="Enter or paste your text here..."
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="text-input"
        InputProps={{
          sx: {
            fontFamily: '"Open Sans", sans-serif',
            fontSize: '1rem',
          }
        }}
      />
    </Box>
  );
}

export default TextInput;
