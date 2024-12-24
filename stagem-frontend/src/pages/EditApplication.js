import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Grid, Typography, Checkbox, TextField, Button, FormControlLabel } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { startSingleEvent, setLoader } from '../services/redux-store/actions/eventsAction'
import { startSubmitApplication, startSingleApplication, resetLoader } from '../services/redux-store/actions/applicationsAction';
import CircularLoader from '../components/CircularLoader';
import LoadingButtonComp from '../components/Buttons/LoadingButtonComp';
import { useSiteData } from '../contextAPI/SiteContext';
import _ from 'lodash'


const EditApplication = () => {
  const { isLoading, singleEvent } = useSelector((state) => state.events);
  const { myProfile } = useSelector((state) => state.user);
  const { application } = useSelector(state => state.applications);
  const applicationLoader = useSelector(state => state.applications.isLoading)
  const { eventId, id } = useParams();
  const dispatch = useDispatch();
  const navigate= useNavigate()

  
  const {siteData, dispatchSiteData} = useSiteData()

  const [checkboxData, setCheckboxData] = useState([])
  const [promptResponses, setPromptResponses] = useState([])

  useEffect(() => {
    dispatch(setLoader());
    dispatch(startSingleEvent(eventId));
    if(id){
      dispatch(startSingleApplication(id, eventId))
    }
  }, [dispatch, id]);

  useEffect(() => {
    //checkbox
      const data = singleEvent?.artistTitles?.map((ele,i) => {
        if(application && application?.artistTitles?.includes(ele)){
          return {
            checked:true,
            title: ele
          }
        } else {
          return {
            checked:false,
            title: ele
          }
        }
      })
      setCheckboxData(data)

    //promptResponses
    if(application){
      setPromptResponses(application.promptResponses)
    } else {
      setPromptResponses(Array(singleEvent?.prompts?.length).fill(''))
    }
  },[application, singleEvent])


  const handleCheckbox = (index) => {
    const updated = checkboxData.map((ele,i) => {
      if(i == index){
        return {
          checked: !ele.checked,
          title: ele.title
        }
      }
      return ele
    })
    setCheckboxData(updated)
  }

  const handleChange = (value, index) => {
    const updatedResponses = [...promptResponses];
    updatedResponses[index] = value; 
    setPromptResponses(updatedResponses); 
  };

  const clientErrors = (artistTitles) => {
    const errors = {};

    if (artistTitles.length === 0) {
      errors.artistTitles = 'Artist Title / Position applying for is required';
    }
  
    singleEvent.prompts.forEach((prompt, index) => {
      if (prompt.isRequired && !promptResponses[index]) {
        errors[`prompt_${index}`] = 'This field is required';
      }
    });
  
    return errors;
  };
  

  const handleSubmit = () => {
    if(!myProfile){
      navigate('/profile/edit')
    }
    const artistTitles = checkboxData.filter(ele => ele.checked).map(ele => ele.title)

    const formData = {
      artistTitles,
      promptResponses
    }

    const prev = _.pick(application, ['artistTitles','promptResponses'])
    const isSame = _.isEqual(formData, prev)
    if(isSame){
      resetAndMove()
      return
    }

    const errors = clientErrors(artistTitles)
    if(Object.keys(errors).length != 0){
      dispatch(resetLoader())
      // console.log(errors)
      dispatchSiteData({type: 'SET_CLIENT_ERRORS', payload: errors})
      return
    }

    dispatchSiteData({type: 'RESET_CLIENT_ERRORS'})
    dispatch(startSubmitApplication(formData, eventId, id, resetAndMove))
  }

  const resetAndMove = () => {
    dispatch(resetLoader())
    dispatchSiteData({type: 'RESET_CLIENT_ERRORS'})
    setCheckboxData([])
    setPromptResponses([])
    navigate(`/applications`)
  }

  return (
    (isLoading || !singleEvent) ? <CircularLoader /> : <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
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
      <Typography variant="h4" gutterBottom >
        Apply for the event
      </Typography>
      <Grid container spacing={3} sx={{ maxWidth: 800 }}>
        <Grid item md={2}>
        <Typography variant="body1" sx={{ fontWeight: 'bold', mt:1 }}>Positions</Typography>
        </Grid>
        <Grid item md={10}>
          {checkboxData && checkboxData.map((ele, i) => (
            <FormControlLabel
              key={i}
              control={<Checkbox onChange={() => handleCheckbox(i)} 
                                checked={ele.checked}  />}
              label={ele.title}
              
            />
          ))}
          {siteData?.clientErrors && (
            <Typography variant="body2" color="error" gutterBottom>
              {siteData.clientErrors.artistTitles}
            </Typography>
          )}
        </Grid>

        {/* Prompts Section */}
        <Grid item md={2}>
        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Prompts</Typography>
        </Grid>
        <Grid item md={10}>
          {singleEvent.prompts.length > 0 ? singleEvent.prompts.map((ele, i) => (
            <Box key={i} sx={{ marginBottom: 2 }}>
              <Typography variant="body1" gutterBottom>{ele.prompt}{ele.isRequired && '*'}</Typography>
              <TextField
                fullWidth
                multiline
                rows={2}
                variant="outlined"
                placeholder="Enter your response"
                value={promptResponses[i]}
                onChange={(e) => handleChange(e.target.value, i)}
                error={siteData?.clientErrors && siteData.clientErrors[`prompt_${i}`]}
                helperText={siteData?.clientErrors && siteData.clientErrors[`prompt_${i}`]}
              />
            </Box>
          )): <p>No prompts for this application</p>}
        </Grid>

        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <LoadingButtonComp handleSubmit={handleSubmit} isLoading={applicationLoader} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default EditApplication;
