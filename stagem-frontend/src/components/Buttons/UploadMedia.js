import { Box, Button, Typography } from '@mui/material';
import React, { useState } from 'react';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useTheme } from '@mui/material/styles';

const UploadMedia = ({ isPremium, form, setForm }) => {
  const theme = useTheme();
  const [previews, setPreviews] = useState([]);
  const [error, setError] = useState('');

  const handleChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 8) {
      setError('Media cannot have more than 8 items');
      return;
    } else {
      setError('');
    }
    setForm({...form, media: files})
    
  };

  return (
    <>
    
    <Box sx={{ display: 'flex', alignItems: 'center', mt:2 }}>
      <Typography variant="body2"  sx={{ width:150}} >
        Media (upto 6 images and 2 videos)</Typography>
      <Button
        disabled={!isPremium}
        component="label"
        size="small"
        variant="contained"
        startIcon={<CloudUploadIcon />}
        sx={{
          bgcolor: theme.palette.primary.main,
          '&:hover': {
            bgcolor: theme.palette.secondary.main
          }
        }}
      >
        Upload files 
        <input
          type="file"
          hidden
          multiple
          disabled={!isPremium}
          onChange={handleChange}
        />
      </Button>
    </Box>

    
      {error && (
        <Typography variant="body2" color="error" gutterBottom>
          {error}
        </Typography>
      )}
      
      {isPremium && <p><b><i>Added media - {form.media.length} files </i></b></p>}
    </>
  );
};

export default UploadMedia;
