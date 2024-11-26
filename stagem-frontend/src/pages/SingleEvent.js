import React, { useEffect, useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { startSingleEvent, deleteEvent, setLoader, startRequest } from '../services/redux-store/actions/eventsAction'
import { Box, Typography, Divider, Grid, Button, Tooltip  } from '@mui/material';
import { tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import { useTheme } from '@emotion/react';
import { format, parseISO } from 'date-fns';

import MapComponent from '../components/MapComponent';
import 'leaflet/dist/leaflet.css';
import CarouselComp from '../components/MediaCarousel/CarouselComp';
import ApplyCTA from '../components/ApplyCTA';
import CircularLoader from '../components/CircularLoader';
import ConfirmationDialog from '../components/ConfirmationDialog';

const SingleEvent = () => {

    const { isLoading, singleEvent } = useSelector((state) => state.events);
    const role = useSelector(state => state.user.account?.role)
    const {myProfile} = useSelector(state => state.user)
    const { id } = useParams();
    const dispatch = useDispatch();

    const [formattedDate, setFormattedDate] = useState(null)
    const currentDate = new Date()
    const eventDate = new Date(singleEvent?.date);

    //for request confirmation
    const [open, setOpen] = useState(false)
    const dialogMsg_req = 'Once request is made it cannot be reversed or edited. Only this event manager can change the status of your request.'
    
    //for delete event confirmation
    const [openDialog, setOpenDialog] = useState(false)
    const dialogMsg_del = 'All applications, requests and artist details under this event will be lost'

    const theme = useTheme()
    const navigate = useNavigate()

    useEffect(() => {
        dispatch(startSingleEvent(id));
        dispatch(setLoader())
    }, [dispatch, id]);

    useEffect(() => {
       singleEvent?.date && setFormattedDate(format(parseISO(singleEvent.date), 'EEEE, MMMM do, yyyy h:mm aaa'))
    },[singleEvent])

    const lastUpdated = useMemo(() => 
        singleEvent?.updatedAt ? format(parseISO(singleEvent.updatedAt), 'do MMMM, yyyy h:mm aaa') : ''
    , [singleEvent?.updatedAt]);

    const HtmlTooltip = styled(({ className, ...props }) => (
        <Tooltip {...props} classes={{ popper: className }} />
      ))(({ theme }) => ({
        [`& .${tooltipClasses.tooltip}`]: {
          backgroundColor: '#f5f5f9',
          color: 'rgba(0, 0, 0, 0.87)',
          maxWidth: '40%',
          height: 'fit-content',
          fontSize: theme.typography.pxToRem(18),
          border: '1px solid #dadde9',
        },
      }));

      const handleRequest = () => {
        dispatch(setLoader())
        dispatch(startRequest(id))
        setOpen(false)
    }

    const handleNavigateProfile = (id) => {
        if(id == myProfile?._id){
            return '/profile'
        } else {
            return `/profile/${id}`
        }
    }

    const handleDeleteEvent = () => {
        dispatch(setLoader())
        dispatch(deleteEvent(id))
        setOpenDialog(false)
        navigate('/profile')
    }


    return (
    (isLoading || !singleEvent) ? <CircularLoader />  : 
    <Box p={3}>
  <Typography variant="h3" gutterBottom>
    {singleEvent.eventTitle}
  </Typography>

  <Box p={3} display="flex" justifyContent="space-between">
    <Box flex={1} mr={2}>
        <Grid container spacing={2} alignItems="center" padding={2}>
            <Grid item xs={12} sm={2} md={2} >
                <Typography variant="body1" fontWeight="bold">Published by</Typography>
            </Grid>
            <Grid item xs={12} sm={9} md={5}>
                <Typography variant="body1">{singleEvent.arManager.identityName}  <br />
                <Link to={handleNavigateProfile(singleEvent.arManager._id)}
                     style={{ textDecoration: 'none', color: 'grey' }} > 
                     @{singleEvent.arManager.username}
                </Link>
                </Typography>
            </Grid>
          {role=='artist' && <Grid xs={12} sm={2} md={4}>
            <HtmlTooltip placement="right"
                title={<>
                    <Typography color="inherit">Show this event on your profile</Typography>
                    <Typography variant='caption'>Make a request for this event if you were a part of this as an artist. The artist manager will review it and approve/reject the request.</Typography>
                </> }
            >
                <Button variant='outlined' size='large' onClick={()=>setOpen(true)}> Make request </Button> 
              </HtmlTooltip>
            </Grid>}
           {myProfile?._id == singleEvent.arManager._id && <>
                <Grid item xs={12} sm={2} md={4}>
                <Button variant='outlined' size='large' onClick={()=>navigate(`/events/edit/${singleEvent._id}`)}>
                    Edit 
                </Button>            
                <Button variant='outlined' color='secondary' size='large' sx={{ml:1}} onClick={() => setOpenDialog(true)}>
                    Delete
                </Button> 
            </Grid></>}
        </Grid>

        <Divider sx={{ my: 1 }} />

        { openDialog && <ConfirmationDialog open={openDialog} setOpen={setOpenDialog}
                                        message={dialogMsg_del} handleConfirm={handleDeleteEvent}/> }
        
        {open && <ConfirmationDialog open={open} setOpen={setOpen}
                                    message={dialogMsg_req} handleConfirm={handleRequest} /> }

        <Grid container spacing={2} alignItems="center" padding={2}>
            <Grid item xs={12} sm={2} md={2}>
                <Typography variant="body1" fontWeight="bold">Date & Time</Typography>
            </Grid>
            <Grid item xs={12} sm={9} md={6}>
                <Typography variant="body1">{formattedDate}</Typography>
            </Grid>
        </Grid>

        <Divider sx={{ my: 1 }} />

        <Grid container spacing={2}  padding={2}>
            <Grid item xs={12} sm={2} md={2}>
                <Typography variant="body1" fontWeight="bold">About</Typography>
            </Grid>
            <Grid item xs={12} sm={9} md={8}>
                <Typography variant="body1">{singleEvent.description}</Typography>
            </Grid>
        </Grid>

        <Divider sx={{ my: 1 }} />

        <Grid container spacing={2} padding={2} alignItems="center">
            <Grid item xs={12} sm={2} md={2}>
                <Typography variant="body1" fontWeight="bold">Location</Typography>
            </Grid>
            <Grid item xs={12} sm={9} md={8}>
                {singleEvent.location === 'online' ? <p>This is an online event. Please check description for more details.</p> : 
                            <>{singleEvent.location.address} <br /> 
                            <MapComponent lat={singleEvent.location.lat} lng={singleEvent.location.lng} /> </> }
            </Grid>
        </Grid>

        <Divider sx={{ my: 1 }} />

        {singleEvent.media.length > 0 && <><Grid container spacing={2} padding={2}>
            <Grid item xs={12} sm={2} md={2}>
                <Typography variant="body1" fontWeight="bold">Media</Typography>
            </Grid>
            <Grid item xs={12} sm={9} md={8}>
            <Box sx={{ mb: 4, maxWidth:'720px', maxHeight:'520px' }}>
                <CarouselComp media={singleEvent.media}/>
            </Box>
            </Grid>
        </Grid>
        <Divider sx={{ my: 1 }} /> </>}
        
        <Box display='flex' justifyContent='space-between'>
            < Button  color='primary' 
                    onClick={() => navigate(-1)}
                    sx={{ '&:hover': { backgroundColor: theme.palette.secondary.dark } }}>Back</Button>
            <Typography variant="caption">Last updated - {lastUpdated} </Typography>
        </Box>
    </Box>

    {role && role == 'artist' && eventDate > currentDate && <ApplyCTA singleEvent={singleEvent} color={theme.palette.secondary} />}
</Box>

</Box>

    );
};

export default SingleEvent;
