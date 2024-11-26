import React from 'react'
import { CircularProgress, Box } from '@mui/material'

const CircularLoader = () => {
  return (
    <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        height="60vh" 
    >
        <CircularProgress color='secondary' size={64}/>
    </Box>
  )
}

export default CircularLoader