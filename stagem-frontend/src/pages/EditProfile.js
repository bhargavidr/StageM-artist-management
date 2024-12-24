import { TextField, Typography, Box, Grid, Divider, Stack, Alert } from '@mui/material';
import React, { useState, useEffect } from 'react';
import _ from 'lodash'
import { toast } from "react-toastify";

import { useSiteData } from '../contextAPI/SiteContext';
import validator from 'validator';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom'

import TitleSelector from '../components/TitleSelector/TitleSelector';
import EditProfilePicture from '../components/EditProfilePicture';
import LoadingButton from '../components/Buttons/LoadingButtonComp';
import ProfilePremium from '../components/ProfilePremium';
import UploadMedia from '../components/Buttons/UploadMedia';
import { startProfile, setLoader, resetLoader } from '../services/redux-store/actions/userAction';

export default function EditProfile() {

  const {siteData, dispatchSiteData} = useSiteData()

  const navigate = useNavigate()
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch()

  const isPremium = user.account?.isPremium 
  const role = user.account?.role
  const {serverErrors, isLoading} = user

  const propLabel = role == 'artist' ? 'Artist' : 'Manager'
  const propName = role == 'artist' ? 'artistName' : 'identityName'

  const initialFormState = {
    username: user.myProfile ? user.myProfile.username : '',
    [propName]:user.myProfile ? user.myProfile[propName] :'',
    pfp:user.myProfile ? user.myProfile.pfp :'',
    bio:user.myProfile ? user.myProfile.bio :'',
    links:user.myProfile && user.myProfile?.links[0] ? user.myProfile.links :['']
  }
  
  if(role == 'artist'){
    initialFormState.media = user.myProfile ? user.myProfile.media :[]
    initialFormState.titles = user.myProfile ? user.myProfile.titles :[]
  }else if (role =='arManager'){
    initialFormState.address = user.myProfile ? user.myProfile.address : ''
  }

  const [form, setForm] = useState(initialFormState)

  useEffect(()=>{
    setForm(initialFormState)
},[user.myProfile])

  const clientValidationErrors = () => {
    const errors = {};

    if (validator.isEmpty(form.username)) {
      errors.username = 'Username is required';
    } 
 
    if (validator.isEmpty(form[propName])) {
      errors[propName] = `${propLabel} Name is required`;
    }

    if(role == 'artist'){
      if (!Array.isArray(form.titles)) {
        errors.titles = 'Error adding a title';
      } else if (form.titles.length > 6 ){
        errors.titles = "Titles cannot be more than 6"
      }
    } else if (role == 'arManager'){
      if (form.address && !validator.isLength(form.address, { max: 254 })) {
        errors.address = 'Address cannot exceed 254 characters';
      } 
    }
   
    if (isPremium) {
    if(role == 'artist'){
      if (!Array.isArray(form.media)) {
        errors.media = 'Media must be an array';
      } else if (form.media.length > 8) {
        errors.media = 'Media cannot have more than 8 items';
      }
    }
  
      if (form.bio && !validator.isLength(form.bio, { max: 1000 })) {
        errors.bio = 'Bio cannot exceed 1000 characters';
      }      

      if (!Array.isArray(form.links)) {
        errors.links = 'Error adding link';
      } else {
        errors.links = {};
        for (let i = 0; i < form.links.length; i++) {
          if (i == 0 && form.links[i] && !validator.isURL(form.links[i])) { //first input box can be empty
            errors.links[i] = 'Each link must be a valid URL';
          }else if (i > 0 && !validator.isURL(form.links[i])) {
            errors.links[i] = 'Each link must be a valid URL';
          }
        }
        if (Object.keys(errors.links).length === 0) {
          delete errors.links;
        }
      }
      
    }
    
    return errors;
  };
  

  useEffect(() => {
    setForm(initialFormState)
    dispatchSiteData({type: 'RESET_CLIENT_ERRORS'})
  },[user.myProfile])

  const resetAndMove = () => {
    dispatch(resetLoader())
    navigate("/profile")
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(setLoader());

    const prev = _.pick(user.myProfile, [`${propName}`,'username','pfp','titles','address','bio','media','links'])
    const isSame = _.isEqual(form, prev)
    if(isSame){
      resetAndMove()
      return
    }
   
    const errors = clientValidationErrors()
    // console.log(errors)
    if(Object.keys(errors).length != 0){
      dispatch(resetLoader())
      // console.log(errors)
      dispatchSiteData({type: 'SET_CLIENT_ERRORS', payload: errors})
      return
    }

    dispatchSiteData({type: 'RESET_CLIENT_ERRORS'})
    const formData = new FormData();
    formData.append('username',form.username)
    formData.append(`${propName}`,form[propName])
    formData.append('pfp', form.pfp)

    if(form.titles?.length > 0){
      form.titles.forEach((title, index) => {
        formData.append(`titles[${index}]`, title);
      });
    } else if(form.titles?.length === 0) {
      formData.append(`titles`, form.titles);
    } else {
      formData.append('address', form.address)
    }

    if (isPremium) {
      if(form.media){
        form.media.forEach((file) => {
          formData.append('media', file);
        });  
      }
      
      formData.append('bio', form.bio);
      
      form.links.forEach((link, index) => {
        formData.append(`links[${index}]`, link);
      });   
    } 
    dispatch(startProfile(formData, resetAndMove))
  }
  
  // console.log(form, 'form')


  const displayErrors = () => {
    let result;
    // console.log(serverErrors)
    if (typeof(serverErrors) === 'string'){
      result = <Alert severity="error" variant="filled" sx={{ width: 'fit-content', mb: 2 }}>
        Can upload only image/video files for media and profile picture. 
    </Alert>
    } else if (serverErrors.length > 1){
      result = (
        <ul><Alert severity="error"  variant="filled" sx={{ width: 'fit-content'}} >
          {serverErrors?.map((error, i) => {
            return <li> {error.message} </li>
          }) }
        </Alert></ul>       
      );
    } else {
      result = <Alert severity="error" variant="filled" sx={{ width: 'fit-content', mb: 2 }}>
                {serverErrors.error?.details[0]?.message}
              </Alert>
    }
    return result;
  };


  return (
  
    <Box component="form" onSubmit={handleSubmit} sx={{ padding: 1}}>
      <Typography variant="h3"  gutterBottom >
        Edit {propLabel} profile
      </Typography>
      {serverErrors && displayErrors()}
      <Grid container >
        <Grid item xs={12} md={4}>
          <Stack alignItems="center">
            <EditProfilePicture form={form} setForm={setForm} />
            <TextField
              required            
              id="username"
              name="username"
              label="Username"
              value={form.username}
              onChange={(e) => setForm({...form, username: e.target.value.trim().toLowerCase()})}
              variant="outlined"
              error={siteData.clientErrors?.username }
              helperText={siteData.clientErrors?.username }
              sx={{ marginBottom: 2 }}
            />
            <TextField
              required              
              id="name"
              name="name"
              value={form[propName]}
              label={`${propLabel} Name`}
              onChange={(e) => setForm({...form, [propName]: e.target.value})}
              variant="outlined"
              error={siteData.clientErrors?.[propName] }
              helperText={siteData.clientErrors?.[propName] }
              sx={{ marginBottom: 2 }}
            />

          {role == 'artist' ? <TitleSelector form={form} setForm={setForm} />   : 
          <TextField     
            fullWidth    
            label="Address"
            name="address"
            value={form.address}
            onChange={(e) => setForm({...form, address: e.target.value})}
            variant="outlined"
            error={siteData.clientErrors?.address }
            helperText={siteData.clientErrors?.address }
          /> }

          </Stack>
        </Grid>

        
    <Grid item xs={12} md={1}>
    <Stack alignItems="center" spacing={2}>
    <Divider orientation="vertical"  sx={{ height: 480 }} />
      <LoadingButton handleSubmit={handleSubmit} isLoading={isLoading} />
    </Stack>
    </Grid>

        <Grid item xs={12} md={5} sx={{mt: '50px' }} >
          <ProfilePremium isPremium = {isPremium} form={form} setForm={setForm} key={user.account?._id}/>
          {role == 'artist' && <UploadMedia isPremium = {isPremium} form={form} setForm={setForm}/>}
          <br />
        </Grid>
      </Grid>
     <br />
      
  
      </Box>

  );

}
