import React, { useEffect, useState } from 'react'
import Grid from '@mui/material/Grid';

import { useSelector, useDispatch } from 'react-redux'
import { startAllEvents } from '../services/redux-store/actions/eventsAction'

import EventCard from '../components/EventCard'
import CircularLoader from '../components/CircularLoader';
import { Card, CardActionArea, CardContent, Typography } from '@mui/material';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';

const AllEvents = () => {
    const events = useSelector(state => state.events)
    
    const dispatch = useDispatch()
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(startAllEvents())
    },[])

  return (
    events ? <>
        <SearchBar action={startAllEvents} type='events' />
        <Grid container spacing={1} sx={{padding:'2%'}}>
         <Grid item xs={12} sm={6} md={3}>
         <CardActionArea onClick={() => navigate('/artistManagers')} sx={{ width: '94%', my: 1 }}>
            <Card
                sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',                
                padding: 2,
                aspectRatio: '3 / 4',
                }}
            >
                <PersonSearchIcon sx={{ fontSize: 50, mb: 2 }} />
                <CardContent>
                <Typography variant="h6" align="center" sx={{ fontWeight: 'bold' }}>
                    Click here to search for artist managers profiles
                </Typography>
                </CardContent>
            </Card>
            </CardActionArea>
        </Grid>
        {events.allEvents.map((event, index) => (            
            <Grid item key={index} xs={12} sm={6} md={3}>
            <EventCard event={event} />
            </Grid>
        ))}
        </Grid></> : <CircularLoader />
  )
}

export default AllEvents