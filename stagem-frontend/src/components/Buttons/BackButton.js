import React from 'react'
import { Button } from '@mui/material'
import { useNavigate, useLocation } from 'react-router-dom'

const BackButton = ({size, style, variant}) => {
    const navigate = useNavigate()
    const location = useLocation()

    const handleClick = () => {
      if(location.pathname == '/unauthorized'){
        navigate(-2)
      } else {
        navigate(-1)
      }      
    }

  return (
    <Button
    size={size}
    sx={style}
    variant={variant}
      onClick={handleClick}
    >
      Back
    </Button>
  )
}

export default BackButton