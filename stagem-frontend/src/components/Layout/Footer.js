import React from 'react'
import {Container, Box, Typography, Paper} from '@mui/material'

export default function Footer() {
    return (
      <Paper sx={{
      width: '100%',
      position: 'relative',
      left:0,
      bottom:0,
      right:0,
      backgroundColor:'black'
      }} component="footer" square variant="outlined">
          <Box
            sx={{
              justifyContent: "center",
              display: "flex",
              my: 1,
              p: 2
            }}
          >
            <Typography variant="caption" color="white">
              Copyright ©2024. bharggez 
            </Typography>
          </Box>

      </Paper>
    );
  }