import React, { useEffect, useState, useMemo } from 'react'
import { useLocation, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'
import { startProfileEvents } from '../services/redux-store/actions/eventsAction'

import EventCard from '../components/EventCard'
import { Grid, Box, Typography } from '@mui/material';
import Applications from './Applications';
import CircularLoader from '../components/CircularLoader';

//using this for displaying applications event wise
const MyEvents = ({profileRole, profileId}) => {
    const events = useSelector(state => state.events.singleProfileEvents)
    const defaultProfileRole = useSelector(state => state.user?.account?.role)
    const defaultProfileId = useSelector(state => state.user?.myProfile?._id)

  
    const location = useLocation()
    const dispatch = useDispatch()

    const memoizedRole  = useMemo(() => {
      return profileRole || defaultProfileRole;
    }, [profileRole, defaultProfileRole]);
  
    const memoizedId  = useMemo(() => {
      return profileId || defaultProfileId;
    }, [profileId, defaultProfileId]);

    useEffect(() => {
      if(memoizedRole  == 'arManager'){ 
        dispatch(startProfileEvents(memoizedId))
      }        
    },[memoizedId, memoizedRole])


    const [table, setTable] = useState(null); // one applicaiton

    const handleEventClick = (e) => {
      setTable({ id: e._id, name: e.eventTitle });
    };
  

  return (
    location.pathname != '/applications' ? ( events.length > 0 ?
     <Grid container spacing={1} sx={{mb:2}}>
      {events.map((e, i) => (
        <Grid item key={i} xs={8} sm={6} md={3}>
          <EventCard event={e} />
        </Grid>
      ))}
    </Grid> : <Typography>There are no events on this profile yet</Typography> ) : 
   <Grid container sx={{ p: '2%' }}>      
      <Grid item xs={8} sm={6} md={3}> 
        <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}> 
          {events.filter((ele) => ele.artistTitles)
                 .map((ele, i) => (
            <Typography 
              key={i}
              variant='h5'
              onClick={() => handleEventClick(ele)} 
              sx={{ cursor: 'pointer' }}
            >
              {ele.eventTitle}
            </Typography>
          ))}
        </Box>
      </Grid>
      
      <Grid item xs={8} sm={6} md={7}>
        {table ? <Applications eventId={table.id} eventName={table.name} />  : 
                <Typography variant='h6' align='center'> Click on an event to view its applications </Typography>
        }
      </Grid>
    </Grid>
  )
}

export default MyEvents
