import React from 'react'
import { useNavigate, Link } from 'react-router-dom';
import {Chip} from '@mui/material'
import { useTheme } from '@emotion/react';

const TitleChip = ({index, title}) => {
  const theme = useTheme()
  return (
    <Chip 
        key={index} 
        label={title} 
        component={Link}
        to={`/artists/${title}`}
        sx={{
            backgroundColor: theme.palette.primary.main,
            '&:hover': {
            backgroundColor: theme.palette.secondary.main,
            color: '#FFF'
            },
            color: "#000"
        }} 
     />          
  )
}

export default TitleChip