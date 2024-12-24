import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from 'react-router-dom';

import { Avatar, Box, Typography, Grid, Button, Stack, useTheme } from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';

import Carousel from '../components/MediaCarousel/CarouselComp';
import {SocialIcon} from 'react-social-icons'
import Chip from '../components/TitleChip'
import MyEvents from './MyEvents';
import CircularLoader from '../components/CircularLoader';
import BackButton from '../components/Buttons/BackButton';

import { getProfile } from './../services/redux-store/actions/userAction';

export default function Profile() {
  const [profile, setProfile] = useState(null)
  const {myProfile, singleProfile, serverErrors} = useSelector((state) => state.user);
  const propName = profile?.userId?.role == 'artist' ? 'artistName' : 'identityName'

  const {id} = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const initialState = profile?.links || [];
  const [socialIcons, setSocialIcons] = useState(initialState);

  const theme = useTheme()

  useEffect(() => {
    if (id) {
      dispatch(getProfile(id)); 
    } else {
      setProfile(myProfile); 
    }
  }, [id, dispatch, myProfile]);
  
  useEffect(() => {
    if (singleProfile && id) {
      setProfile(singleProfile);
    }
  }, [singleProfile, id]);
  
  useEffect(() => {
    setSocialIcons(initialState); // Set initial social icons from profile
  }, [profile]);
  
  


  return (
      profile ? <Stack spacing={1} sx={{mt:'2%'}}>
        <Grid container >
          <Grid item xs={12} md={3} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Avatar sx={{width: 200, height: 200, mb: '1%', mr:3}} src={profile?.pfp} alt={profile?.name}/>
          </Grid>


          <Grid item xs={12} md={6}>
            <Stack>
              <Typography variant="h4">
                {profile[propName] || 'Profile Name'}
              </Typography>
              <Typography variant="subtitle1" >
                @{profile.username || 'username'}
              </Typography>
              {profile.userId.role == 'artist' && <Stack direction="row" spacing={1} sx={{ my: 1}}>
                {profile.titles?.map((title, index) => (
                    <Chip index={index} title={title} 
                     key={index}/> ))}              
              </Stack>}

              {profile.userId.role == 'arManager' && profile.address && <Box display="flex" alignItems="center" sx={{ mt:1 }}>
                <BusinessIcon fontSize="small" />
                <Typography variant="body1" sx={{ ml: 1 }}>{profile.address}</Typography>
              </Box>}
              
                <Stack direction="row" spacing='2px' sx={{ my: 2 }} >
                {profile.userId?.isPremium && socialIcons[0] && socialIcons.map((ele, i) => (
                    <SocialIcon url={ele} key={i} 
                                target="_blank" 
                                style={{ height: 40, width: 40}} bgColor='#FFF' fgColor={theme.palette.secondary.main}/>
                  ))}
                  {/*id && <Button variant="contained" color="secondary">
                       {profile.userId?.isPremium ? 'Message' : 'Get Premium to Message'}
                </Button>*/}
                </Stack>
              <BackButton />           
            </Stack>
          </Grid>       
            {!id && 
            <Button variant="contained" color="secondary" 
                    sx={{maxHeight:'32px', my:'auto',mb:4}} 
                    onClick={() => navigate('/profile/edit')}>
                Edit Profile
            </Button> } 
        </Grid>

        <Box sx={{ mx: 'auto',  
             display: 'flex', 
             flexDirection: 'column'}}>
        {profile.userId?.isPremium && (          
            <>
            {profile.bio && <Typography variant="body1" sx={{ mx:'auto', maxWidth:'50%', my:1}} align="justify" >
              {profile.bio}
            </Typography>}
            <Box sx={{ ml: 12, mb: 4 }}>
              {profile.userId.role == 'artist' && profile?.media.length > 0 && <Carousel media={profile.media}/>}
            </Box>
         </>
        )}
        <Box sx={{ mt: 4, mx: 4 }}>
          <Typography variant="h4" sx={{mb:2}} align='center'>
            {profile.userId.role == 'artist' ? 'StageM Events ' : `Events by ${profile.identityName}`}
          </Typography>
          <MyEvents profileRole={profile.userId.role} profileId={profile._id}/>
        </Box>
        </Box>
      </Stack> : <CircularLoader />
  );
}
