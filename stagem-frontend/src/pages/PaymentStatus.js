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

  useEffect(() => {
    if(location.pathname == '/success'){
      setLoader()
      dispatch(userPremiumUpdate())
      setTimeout(() => {
        navigate('/profile');
      }, 3000)
    }
  },[])


  return (
    <Container>
      {location.pathname === '/success' ? (
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
        >
          <Typography variant="h4" gutterBottom sx={{mx:6}}>
            Payment Successful
          </Typography>
          <Typography variant="subtitle" gutterBottom sx={{mx:1}}>
            Redirecting to profile page.....
          </Typography>
        </Box>
      ) : (
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
        >
          <Typography variant="h5" color="error" sx={{mt:4}}>
            An error occurred in payment
          </Typography>
          <Button size='small' sx={{mx:2}} onClick={()=>navigate('/premium')}>Try again</Button>
        </Box>
      )}
    </Container>
  );
};

export default PaymentStatus;
