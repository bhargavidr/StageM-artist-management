import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Box, List, ListItem, ListItemText, Button, Divider, Typography } from '@mui/material';
import { getRequests, setLoader } from '../services/redux-store/actions/eventsAction'; 
import CircularLoader from '../components/CircularLoader';
import RequestsListItem from '../components/RequestsListItem';

import { toast } from 'react-toastify';

const Requests = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const { isLoading, myRequests } = useSelector(state => state.events);
  const { role } = useSelector(state => state.user.account);

  useEffect(() => {
    dispatch(setLoader())
    dispatch(getRequests());
  }, [dispatch]);


  const pendingRequests = useMemo(() => 
    myRequests.filter(req => req.status === 'Pending'), 
    [myRequests]
  );

  const updatedRequests = useMemo(() => 
    myRequests.filter(req => req.status !== 'Pending'), 
    [myRequests]
  );

  const handleNewReq = () => {
    toast.info('Find your event from the searchbar and make request! ',{position: "bottom-center",})
    navigate('/events')
  }

 

  return (
    (isLoading) ? <CircularLoader />  : 
    <Box sx={{ width: '60%', mx: 'auto' }}>
        <Box sx={{ display: 'flex', justifyContent:'space-between' }}>
            <Typography variant="h4" sx={{ my: 2 }}>Pending Requests</Typography>
            {role =='artist' && <Button sx={{paddingX:2}} onClick={handleNewReq}>Request for new event</Button>}
        </Box>      
      <List>
        {pendingRequests.length > 0 ? pendingRequests.map((ele, i) => (
          <RequestsListItem key={i} request={ele} pending={true} />
        )) : <Typography>No requests</Typography>}
      </List>
      

      <Divider sx={{ my: 3 }} />

      <Typography variant="h4" sx={{ mb: 2 }}>Updated Requests</Typography>
      <List>
        {updatedRequests.length > 0 ? updatedRequests.map((ele, i) => (
            <RequestsListItem key={i} request={ele} pending={false} />         
        )) : <Typography>No requests</Typography>}
      </List>
    </Box>
  );
};

export default Requests;

