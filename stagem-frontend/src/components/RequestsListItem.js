import React, {useState} from 'react'
import { Box, ListItem, ListItemText, Button, Typography } from '@mui/material';
import ArrowRightRoundedIcon from '@mui/icons-material/ArrowRightRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';

import { startRequest } from '../services/redux-store/actions/eventsAction'; 
import {Link} from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import ConfirmationDialog from './ConfirmationDialog';

const RequestsListItem = ({request, pending}) => {
    const { role } = useSelector(state => state.user.account);
    const dispatch = useDispatch()

    const [open, setOpen] = useState(false)
    const [status, setStatus] = useState('')
    const dialogMsg = 'Once approved/rejected, status cannot be changed'

    const artistDeets = (artist) => {
        return <><p style={{marginLeft: 1}}> by {artist?.artistName} 
        <span>
            <Link to={`/profile/${artist?._id}`} style={{ color:'grey' }}> (@{artist?.username})</Link>
        </span></p> </>
    }

    const handleClick = (data) => {
        setStatus(data)
        setOpen(true)
    }

    const handleStatusChange = () => {
        dispatch(startRequest(request.event._id, request._id, status))
        setOpen(false)
    }

  return (
    <ListItem key={request._id} sx={{ justifyContent: 'space-between' }}>
        {pending ? <AccessTimeRoundedIcon sx={{mx: 1}} /> : <ArrowRightRoundedIcon size='small' />}
            <ListItemText
              primary={ <span style={{ display: 'flex', alignItems: 'center'}}>
                <Link to={`/events/${request.event._id}`} 
                      style={{ fontWeight: 'bold', color:'white',  textDecoration: 'none', marginRight: 4  }}>
                        {request.event.eventTitle}
                </Link> {role == 'arManager' && artistDeets(request.artist)} </span>}
            />
            {!pending || role == 'artist' ? <Typography variant='subtitle2' > {request.status} </Typography> : 
            <Box>
              <Button variant="contained" color="primary" 
                      size='small' sx={{ mr: 1 }}
                      onClick = {() => handleClick('Approved')}>
                Approve
              </Button>
              <Button variant="contained" color="secondary" size='small'
                     onClick = {() => handleClick('Rejected')}>
                Reject
              </Button>
              {open && <ConfirmationDialog open={open} setOpen={setOpen}
                                        message={dialogMsg} handleConfirm={handleStatusChange} /> }
            </Box>}
    </ListItem>
  )
}

export default RequestsListItem