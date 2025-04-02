import React from 'react';
import { Box, Button } from '@mui/material';
import CodeIcon from '@mui/icons-material/Code';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import WhatshotIcon from '@mui/icons-material/Whatshot';

function RephrasingButtons({ onRephrase, disabled }) {
  const styles = [
    { name: 'developer', label: 'Developer', icon: <CodeIcon /> },
    { name: 'friendly', label: 'Friendly', icon: <EmojiEmotionsIcon /> },
    { name: 'business', label: 'Business', icon: <BusinessCenterIcon /> },
    { name: 'gen-z', label: 'Gen-Z', icon: <WhatshotIcon /> }
  ];

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', mt: 2 }}>
      {styles.map((style) => (
        <Button
          key={style.name}
          variant="contained"
          color="primary"
          startIcon={style.icon}
          disabled={disabled}
          onClick={() => onRephrase(style.name)}
          className="style-button"
          sx={{ m: 1, minWidth: '120px' }}
        >
          {style.label}
        </Button>
      ))}
    </Box>
  );
}

export default RephrasingButtons;
