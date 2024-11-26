import React, {useEffect} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Button, Typography, Container } from '@mui/material';
import LoadingButtonComp from '../components/Buttons/LoadingButtonComp';
import { useDispatch, useSelector } from 'react-redux';
import { userPremiumUpdate, setLoader } from '../services/redux-store/actions/userAction';

const PaymentStatus = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch() 

  const {isLoading} = useSelector(state => state.user)

  const handleUnlock = () => {
    setLoader()
    dispatch(userPremiumUpdate())
  };

  useEffect(() => {
    // If on /success but stripeId is not in localStorage, redirect to /fail
    if (location.pathname === '/success' && !localStorage.getItem('stripeId')) {
      navigate('/fail');
    }
  }, [location.pathname, navigate]);

  return (
    <Container>
      {location.pathname === '/success' ? (
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
        >
          <Typography variant="h4" gutterBottom>
            Payment Successful
          </Typography>
          <LoadingButtonComp handleSubmit={handleUnlock} isLoading={isLoading} />     
        </Box>
      ) : (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Typography variant="h5" color="error">
            An error occurred
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default PaymentStatus;
