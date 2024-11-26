import React, { useEffect, useState } from 'react';
import { TextField, Alert, Typography, Stack, Grid, Box, Checkbox} from '@mui/material';
import { LocalizationProvider, DateTimePicker  } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3'
import { enIN } from 'date-fns/locale'
import _ from 'lodash';
import validator from 'validator';

import LoadingButtonComp from '../components/Buttons/LoadingButtonComp';
import UploadMedia from '../components/Buttons/UploadMedia';
import TitleSelector from '../components/TitleSelector/TitleSelector';
import PromptsForm from '../components/PromptsForm';
import StipendSlider from '../components/StipendSlider';
import BackButton from '../components/Buttons/BackButton';

import { startPublishEvent, setLoader, resetLoader, startSingleEvent, setEvent } from '../services/redux-store/actions/eventsAction';

import { useSiteData } from '../contextAPI/SiteContext';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';


export default function EditEvent () {

    const {siteData, dispatchSiteData} = useSiteData()
    const [isFutureDate, setFutureDate] = useState(false);
    const [isOnline, setIsOnline] = useState(false)
    
    
    const user = useSelector(state => state.user)
    const {isPremium} = user.account
    const { singleEvent, isLoading } = useSelector(state => state.events)
    const {id} = useParams()

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const initialState = {
      eventTitle: singleEvent ? singleEvent.eventTitle : '',
      date: singleEvent ? new Date(singleEvent.date) : new Date(), 
      location: singleEvent ? singleEvent.location : '',
      description: singleEvent ? singleEvent.description : '',
      media:singleEvent ? singleEvent.media : [],
      titles:singleEvent ? singleEvent.artistTitles : [], 
      stipend: singleEvent ? singleEvent.stipend : null,
      prompts:singleEvent ? singleEvent.prompts : []
    }

  const [form, setForm] = useState(initialState);

  useEffect(() => {
    if (!user.myProfile) {
        const timer = setTimeout(() => {
            if (!user.myProfile) {
                navigate('/profile/edit'); 
            }
        }, 5000); //5 seconds

        return () => clearTimeout(timer); // Cleanup timer if component unmounts
    }
}, [user.myProfile]);
  
  useEffect(() => {
    setForm(initialState)
    if(singleEvent?.location === 'online'){
      setIsOnline(true)
    } else if (singleEvent?.location?.address){
      setForm({...form, location: singleEvent?.location?.address})
    }
  },[singleEvent])

  useEffect(()=> {
    dispatchSiteData({type:'DASHBOARD_ON'})
    if(id){
      dispatch(startSingleEvent(id))
    } else {
      dispatch(setEvent(null))
    }
  },[id])

  useEffect(() => {
    if (form.date) {
         if (new Date(form.date) > new Date()){
            setFutureDate(true)
        }  else {
          setFutureDate(false); 
        }
    }
  }, [form.date]);

  useEffect(()=> {
    isOnline ? setForm({...form, location: 'online'}) : setForm({...form, location: ''})
  },[isOnline])


  const clientErrors = () => {
    const errors = {};
  
    if (validator.isEmpty(form.eventTitle)) {
      errors.eventTitle = 'Event title is required';
    }
  
    if (validator.isEmpty(form.date.toISOString())) {
      errors.date = 'Date is required';
    }
  
    if (validator.isEmpty(form.location)) {
      errors.location = 'Location is required';
    }
  
    if (validator.isEmpty(form.description)) {
      errors.description = 'Description is required';
    }

    if(isFutureDate){
      if (form.titles.length === 0 ){
        errors.titles = "Artist Title is required"
      }
    } 

    if (form.media.length > 8) {
      errors.media = 'Media cannot have more than 8 items';
    }    
    
    return errors;
  }

  const handleChange = (e) => {
    const {name, value} = e.target
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(setLoader())

    if(id && singleEvent){
        const prev = _.pick(singleEvent, ['eventTitle','date','location','description','media'])
        const isSame = _.isEqual(form, prev)
        if(isSame){
          resetAndMove()
          return
        }
    }
    
    const errors = clientErrors()
    // console.log(errors)
    if(Object.keys(errors).length != 0){
        dispatch(resetLoader())
      console.log(errors)
      dispatchSiteData({type: 'SET_CLIENT_ERRORS', payload: errors})
      return
    }
    dispatchSiteData({type: 'RESET_CLIENT_ERRORS', payload: errors})

    const formData = new FormData();

    formData.append('eventTitle', form.eventTitle);
    formData.append('date', form.date); 
    isOnline ? formData.append('location', 'online') : formData.append('location', form.location);
    formData.append('description', form.description);

   
    if (isPremium && form.media.length > 0) {
        form.media.forEach(file => {
          formData.append('media', file);
        });
    }

    if (isFutureDate){    
          formData.append('artistTitles', JSON.stringify(form.titles));     
          formData.append('stipend',JSON.stringify(form.stipend))  
        if(form.prompts.length > 0){
          formData.append('prompts', JSON.stringify(form.prompts));
        }
    }
  
    
    dispatch(startPublishEvent(formData, resetAndMove, id))

  };

  const resetAndMove = () => {
    dispatch(resetLoader())
    navigate("/profile")
    setForm(initialState)
  }

  return (
    <>
     <Typography variant="h3" gutterBottom align='center'>
            {id ? 'Edit' : 'Add'} event
        </Typography>
    <Grid container >
    <Grid item xs={12} md={3}>
    <Stack alignItems="center">
      <TextField
        label="Event Title"
        name="eventTitle"
        required
        value={form.eventTitle}
        onChange={handleChange}
        margin="normal"
        sx={{width: '260px'}}
        error={!!siteData.clientErrors?.eventTitle }
        helperText={siteData.clientErrors?.eventTitle }
      />
      

        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enIN}> 
            <DateTimePicker 
                required
                orientation="landscape"
                value={form.date}
                onAccept={(newValue) => setForm({...form, date:newValue}) }
                disableFuture = {new Date(singleEvent?.date) < new Date()}
                disablePast = {new Date(singleEvent?.date) > new Date()}
                sx={{my:1, maxHeight:'300px'}}
                error={!!siteData.clientErrors?.date }
            helperText={siteData.clientErrors?.date }
            />
        </LocalizationProvider>   

        <TextField
        label="Location"
        name="location"
        required
        disabled={isOnline}
        value={form.location}
        onChange={handleChange}
        margin="normal"
        sx={{width: '260px'}}
        error={siteData.clientErrors?.location }
        helperText={siteData.clientErrors?.location }
         /> 
        <Box sx={{ display: 'flex', alignItems: 'center', mb:3}}>
            <Checkbox color="secondary" checked={isOnline} 
                onClick={()=>setIsOnline(!isOnline)} />
            <label required  style={{ marginLeft: '4px' }}>Check this if it's an online event</label>
        </Box>  

        {isFutureDate &&  <TitleSelector form={form} setForm={setForm}/> }

      </Stack>
      </Grid>
      
      <Grid item xs={12} md={3} >      
        
        <TextField
        label="Description"
        name="description"
        fullWidth
        margin="normal"
        value={form.description}
        onChange={handleChange}
        multiline
        rows={8}
        required
        error={siteData.clientErrors?.description }
        helperText={siteData.clientErrors?.description }
      />
      {!isPremium && <Typography variant="h5" sx={{my:1}} >
              Unlock media with premium!
          </Typography>}
      <UploadMedia form={form} setForm={setForm} isPremium={isPremium} /> 
        </Grid>

       <Grid item xs={12} md={4} sx={{mx:4}}>  
       {isFutureDate && <>
            {!id && <Alert variant="outlined" severity="warning">
              Prompts and Stipend can only be added, not edited once event is published. Make sure to cross-check the details.
            </Alert>}
            <PromptsForm form={form} setForm={setForm} prevPrompts={singleEvent?.prompts}/>  
            <StipendSlider form={form} setForm={setForm} prevStipend={singleEvent?.stipend}/>
       </>}
      </Grid>
      </Grid>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height:'160px', spacing: 4 }}>
        <BackButton variant='contained' style={{mr:2}} />
        <LoadingButtonComp handleSubmit={handleSubmit} isLoading={isLoading} />        
      </Box>
      
    </>
  );
};
