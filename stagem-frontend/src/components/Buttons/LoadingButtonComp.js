import React from 'react'
import { useLocation } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { useParams } from 'react-router-dom';
import {LoadingButton} from '@mui/lab'
import { useSelector } from 'react-redux';

function LoadingButtonComp({handleSubmit, disabled, isLoading}) {

    const theme = useTheme()
    const {eventId, id} = useParams()


    const path = useLocation()
    const buttonDisplayName = () => {
        switch(path.pathname){
            case '/profile/edit': return "Save"
            case `/events/edit`: return 'Publish'
            case `/events/edit/${id}`: return 'Save changes'
            case '/account': return 'Update'
            case `/events/${eventId}/apply`: return 'Submit'
            case `/events/${eventId}/apply/${id}`: return 'Save Changes'
            case '/premium': return 'Subscribe'
            case '/forgotpassword': return 'Save changes and login'
        }
    }
//remove password from user

  return (
    <LoadingButton
        size="large"
        type="submit"
        loading={isLoading}
        onClick={handleSubmit}
        disabled={disabled}
        variant="contained"
        sx={{
          display: 'block',
          color:'#fff',
          bgcolor: "secondary.main",
          '&:hover': {
            bgcolor: theme.palette.secondary.light,
          },
        }}
      >
        <span> {buttonDisplayName()}  </span>
      </LoadingButton>
  )
}

export default LoadingButtonComp
