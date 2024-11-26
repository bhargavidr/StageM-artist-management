import React, {useEffect} from 'react';
import { Box, Typography, List, ListItem } from '@mui/material';
import LoadingButtonComp from '../components/Buttons/LoadingButtonComp';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { handlePayment } from '../services/handlePayment';

const Premium = () => {
    const {myProfile, account} = useSelector(state => state.user)
    const navigate = useNavigate();

    useEffect(() => {
      // Check if stripeId is in localStorage and navigate to /success if it's present
      const stripeId = localStorage.getItem('stripeId');
      if (stripeId) {
        navigate('/success');
      }
    }, [navigate]);

    const body = {
      name: myProfile.username
    }

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="80vh" 
      textAlign="center"  
    >
      <Box 
        sx={{
          padding: '2%', 
          border: 1,
          borderRadius: '10px', 
          borderColor: 'white',
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
          maxWidth: '50%',
        }}
      > 
        <Typography variant="h6" gutterBottom>
          <u>Premium for Rs.1100 per year</u>
        </Typography>
        <Typography variant="h4" gutterBottom>
          Unlock features and enhance your profile:
        </Typography>
        <List>
          <ListItem>• Add media to events</ListItem>
          <ListItem>• Add bio to profile</ListItem>
          <ListItem>• Add social media links to profile</ListItem>
        </List>
        <Box display='flex' justifyContent='flex-end'>
            {account.isPremium ? <Typography variant="caption" gutterBottom>
                                    You are a already a premium user
                                  </Typography> :
         <LoadingButtonComp handleSubmit={() => handlePayment(body)}/>}
        </Box>       
      </Box>
    </Box>
  );
};

export default Premium;
