import React, { useState } from 'react';
import {
  Avatar,
  Alert,
  Button,
  CssBaseline,
  TextField,
  Link,
  Paper,
  Box,
  Grid,
  Typography,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { startUserLogin } from '../services/redux-store/actions/userAction';
import * as Yup from 'yup';


export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [clientErrors, setClientErrors] = useState({});

  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email address').required('Email cannot be blank'),
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .max(128, 'Password must be less than 128 characters')
      .required('Password cannot be blank'),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await validationSchema.validate(formData, { abortEarly: false });
      setClientErrors({});

      const resetForm = () => {
        setFormData({
          email: '',
          password: '',
        });
        navigate('/events');
      };

      dispatch(startUserLogin(formData, resetForm));
    } catch (err) {
      const formattedErrors = err.inner.reduce((acc, error) => {
        acc[error.path] = error.message;
        return acc;
      }, {});
      setClientErrors(formattedErrors);
    }
  };

  const handleChange = (e) => {
    const { value, name } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const displayErrors = () => {
    let result = <Alert severity="error" sx={{ width: '100%', mt: 2 }} >
            {user.serverErrors}
          </Alert>
                
    return result;
  };

  return (
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={8}
          sx={{
            backgroundImage: `url(${process.env.REACT_APP_FRONTPAGE})`, 
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Grid item xs={12} sm={8} md={4} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}></Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            {user.serverErrors && displayErrors()}
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"                
                fullWidth
                id="email"
                value={formData.email}
                onChange={handleChange}
                label="Email Address"
                name="email"
                autoComplete="email"
                error={!!clientErrors.email}
                helperText={clientErrors.email}
                autoFocus
              />
              <TextField
                margin="normal"            
                fullWidth
                name="password"
                value={formData.password}
                onChange={handleChange}
                label="Password"
                type="password"
                id="password"
                error={!!clientErrors.password}
                helperText={clientErrors.password}
                autoComplete="current-password"
              />
              <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                Sign In
              </Button>
              <Grid container>
                <Grid item>
                  <Link href="/register" variant="body2">
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>

  );
}
