import React, { useState, useEffect, useMemo } from 'react';
import {  useDispatch, useSelector } from 'react-redux';
import {useParams, Link, useNavigate} from 'react-router-dom'

import { Button, Grid, Divider, Avatar, Select, MenuItem, FormControl, InputLabel, Typography, Box } from '@mui/material';
import CircularLoader from '../components/CircularLoader';
import TitleChip from '../components/TitleChip';

import { format, parseISO } from 'date-fns';

import { startSingleApplication, startSubmitApplication, startDeleteApplication, resetLoader } from '../services/redux-store/actions/applicationsAction';
import ConfirmationDialog from '../components/ConfirmationDialog';
import BackButton from '../components/Buttons/BackButton';


const SingleApplication = () => {
  const { eventId, id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const { application } = useSelector(state => state.applications);
  const user = useSelector(state => state.user);
  const {role} = user.account
  
  const [status, setStatus] = useState('');
  const [hasChanges, setHasChanges] = useState(false); //for update button 

  const [openDialog, setOpenDialog] = useState(false)
  const dialogMsg = 'Your application and the status will be permanently deleted. However, you can re-apply to this event.'

  useEffect(() => {
    if (id && eventId) {
      dispatch(startSingleApplication(id, eventId));
    }
  }, [id, eventId, dispatch]);

  useEffect(() => {
    if (application) {
      setStatus(application.status);
    }
  }, [application]);

  const CreatedAt = useMemo(() => 
    application?.createdAt ? format(parseISO(application.createdAt), 'do MMMM, yyyy h:mm aaa') : ''
, [application?.createdAt]);

const UpdatedAt = useMemo(() => 
    application?.updatedAt ? format(parseISO(application.updatedAt), 'do MMMM, yyyy h:mm aaa') : ''
, [application?.updatedAt]);


// manager only
  const handleStatusChange = (event) => {
    setStatus(event.target.value);
    setHasChanges(true);
  };

  // status update manager only 
  const handleUpdate = () => {
    const formData = {status}
    dispatch(startSubmitApplication(formData,eventId,id))
    setHasChanges(false);
  };

    //artist only
  const handleDelete = () => {
    dispatch(startDeleteApplication(id,eventId, resetAndMove))
  }

  const applicationTitle = () => {
    if(role == 'arManager'){
      return `${application.appliedBy.artistName}'s Application`
    } else {
      return `Application for ${application.event.eventTitle}`
    }
  }

  const resetAndMove = () => {
    navigate('/applications')
    dispatch(resetLoader());
  }

  return (
    application ? <Box 
    sx={{
      border: '1px solid #ccc',
      borderRadius: 2,
      padding: 3,
      width: '80%',
      maxWidth: 'md',
      position: 'relative',
      mx:'auto',
      my:6
    }}
  >
    <BackButton />
    
    <Typography variant="h5" sx={{ fontWeight: 'bold', textAlign: 'center', mb: 1 }}>
      {applicationTitle()}
    </Typography>
    {role === 'arManager' && <Link to={`/profile/${application.appliedBy._id}`} 
        style={{ textAlign: 'center', display: 'block',  color:'white'  }}>
                                    View Profile
                              </Link>}
    
    <Grid container spacing={2} sx={{ mt: '4%'}}>

      {role == 'artist' && <> <Box component={Link}
                              to={`/profile/${application.event?.arManager._id}`}
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                maxWidth: '400px', 
                                mx:'auto'
                              }}
                            >
                          <Avatar
                            src={application.event.arManager.pfp}
                            alt={application.event.arManager.username}
                            sx={{ width: 56, height: 56 }} // Adjust size as needed
                          />
                          <Box
                            sx={{
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'center', 
                              ml: 2                               
                            }}
                          >                            
                            <Typography variant="body2" color="primary" >
                              <i> @{application.event.arManager.username}</i>
                            </Typography>
                          
                            <Typography variant="body2" color="primary">
                              {application.event.arManager.identityName}
                            </Typography>
                          </Box>
                        </Box>
                            <Divider sx={{ width: '100%', my: 2 }} /></>}

      <Grid item xs={6} md={4}>
        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Status</Typography>
      </Grid>
      <Grid item xs={6}>
        {role === 'arManager' ? (<Box sx={{display:'flex'}}>
          <FormControl fullWidth>
            <InputLabel>Update status</InputLabel>
            <Select
              value={status}
              onChange={handleStatusChange}
              label="Status"
              size='small'
              fullWidth
            >
              <MenuItem value="Applied">Applied</MenuItem>
              <MenuItem value="Under Review">Under Review</MenuItem>
              <MenuItem value="Accepted">Accepted</MenuItem>
              <MenuItem value="Rejected">Rejected</MenuItem>
            </Select>            
          </FormControl>
          <Button sx={{ml:1, p:0}}
            onClick={handleUpdate} 
            disabled={!hasChanges} 
            variant="contained"
            fullWidth
            size='small'
          >Confirm Status Update</Button> </Box>
        ) : (
          <Typography variant="body1">{application.status}</Typography>
        )}
      </Grid>
      
      <Divider sx={{ width: '100%', my: 2 }} />
  
      <Grid item xs={6} md={4} >
        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Positions Applied For</Typography>
      </Grid>
      <Grid item xs={6} >
        { application.artistTitles.map((ele,i) => {
            return <TitleChip index={i} title={ele} key={i} />
        }) }
      </Grid>
  
      <Divider sx={{ width: '100%', my: 2 }} />

    
    <Grid item xs={12} md={12}>
    <Typography variant="body1" sx={{ fontWeight: 'bold' }} gutterBottom>Prompts Responses</Typography>
      {application.event.prompts?.map((ele, i) => (
        <Box key={i} sx={{mb:2}}>
          <i><Typography variant="body1" sx={{ fontWeight: 'bold' }}>
            {ele.prompt}{ele.isRequired && '*'}
          </Typography></i>
          <Typography variant='body2' 
          dangerouslySetInnerHTML={{
            __html: (application.promptResponses[i] || '(No response)').replace(/\n/g, '<br/>'),
          }}/>          
        </Box>  
      ))}
      
        </Grid>

        <Divider sx={{ width: '100%', my: 2 }} />

        <Grid item xs={6} md={4}>
        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Submitted On</Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography variant="body1">{CreatedAt}</Typography>
      </Grid>
  
      <Divider sx={{ width: '100%', my: 2 }} />
  
      <Grid item xs={6} md={4}>
        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Last Updated</Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography variant="body1">{UpdatedAt}</Typography>
      </Grid>
    </Grid>
  
    {role === 'artist' && <Box  sx={{ display: 'flex', justifyContent: 'flex-end', gap:1, mt: 3  }}>
    {status == 'Applied' && <Button 
        onClick={() => navigate(`/events/${eventId}/apply/${id}`)} 
        size='large'
      >Edit</Button>}
      <Button 
        onClick={() => setOpenDialog(true)} 
        size='large'
      >Delete Application</Button>          
    </Box>}

   { openDialog && <ConfirmationDialog open={openDialog} setOpen={setOpenDialog}
                                        message={dialogMsg} handleConfirm={handleDelete}/> }
  </Box>
   : <CircularLoader />
  );
};

export default SingleApplication;
