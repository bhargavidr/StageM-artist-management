import React from 'react';
import { Card, CardContent, Avatar, Typography, CardActionArea, Box } from '@mui/material';
import Chip from '@mui/material/Chip';
import BusinessIcon from '@mui/icons-material/Business';
import { useNavigate } from 'react-router-dom';

const ProfileCard = ({ profile }) => {

    const nav = useNavigate()
  return (
    <CardActionArea sx={{ width: '94%', my: 1 }}>
    <Card onClick={() => nav(`/profile/${profile._id}`)}
        sx={{ width: '100%', height:'100%',  
            display: 'flex', flexDirection: 'column', alignItems: 'center', 
            p: 1 }}>
      
        <Avatar
          size='large'
          alt={ profile.artistName || profile.identityName}
          src={profile.pfp}
          sx={{ width:'180px', height: '180px', mb: 1}}
        />

      <CardContent sx={{  display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
        <Typography variant="h6" align="center">
          {profile.artistName || profile.identityName}
        </Typography>
        <Typography variant="subtitle1" align="center" >
          @{profile.username}
        </Typography>
        {profile.address ? (
               <><Box display="flex" sx={{ my:'5%' }} alignItems='flex-start'>
                <BusinessIcon fontSize="small" />
                <Typography variant="body2" sx={{ ml: 1 }}>{profile.address}</Typography>
              </Box></>
            ) : (
                <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 1, my: 1 }}>
                {profile.titles?.map((ele, i) => (
                    <Chip key={i} label={ele} size='small' />
                ))}
                </Box>
            )}

            <Typography variant="body1" align="center" sx={{ fontWeight: 'bold' }}>
                Events - {profile.events.length}
            </Typography>
      </CardContent>
    </Card>
    </CardActionArea>
  );
};

export default ProfileCard;
