import React from 'react';
import { Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import BackButton from '../components/Buttons/BackButton';

const Unauthorized = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height="90vh"
    >
      <Typography variant="h4" gutterBottom>
        Unauthorized
      </Typography>
     <BackButton />
    </Box>
  );
};

export default Unauthorized;
