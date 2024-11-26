import React, { useState } from 'react';
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Link,
  Paper,
  Box,
  Grid,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Alert, 
  Snackbar
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import { useNavigate } from 'react-router-dom';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import axios from '../config/axios';



export default function Register() {
  const navigate = useNavigate();
  const [serverErrors, setServerErrors] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false)

  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email address').required('Email cannot be blank'),
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .max(81, 'Password must be less than 81 characters')
      .required('Password cannot be blank'),
    role: Yup.string().oneOf(['artist', 'arManager'], 'Invalid role').required('Role is required'),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await axios.post('/register', values);
      if (response) {
        setSuccessMessage('Registered successfully!');
        setErrorMessage('');
        setOpenSnackbar(true);
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setServerErrors(error.response.data);
        setErrorMessage('')
      } else {
        setErrorMessage('Registration failed, please try again');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const displayErrors = () => {
    let result;
    // console.log(serverErrors)
    if (serverErrors.length == 1) {
      result = <Alert severity="error" sx={{ width: '100%', mt: 2 }}>
      {serverErrors.details[0].message}
    </Alert>
    } else {
      result = (
          serverErrors.details.map((error, i) => (
            <Alert severity="error" sx={{ width: '100%', mt: 2 }} key={i}>
            {error.message}
          </Alert>
          ))        
      );
    }
    return result;
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
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
              Sign Up
            </Typography>
            {serverErrors && displayErrors()}
            <Formik
              initialValues={{ email: '', password: '', role: '' }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ values, errors, touched, handleChange, handleSubmit, isSubmitting }) => (
                <Form noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    autoComplete="email"
                    autoFocus
                    error={touched.email && errors.email}
                    helperText={touched.email && errors.email}
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    value={values.password}
                    onChange={handleChange}
                    autoComplete="current-password"
                    error={touched.password && errors.password}
                    helperText={touched.password && errors.password}
                  />
                  <FormControl component="fieldset" margin="normal" required error={touched.role && !!errors.role}>
                    <FormLabel component="legend">Role</FormLabel>
                    <RadioGroup row aria-label="role" name="role" value={values.role} onChange={handleChange}>
                      <FormControlLabel value="artist" control={<Radio />} label="Artist" />
                      <FormControlLabel value="arManager" control={<Radio />} label="Artist Manager" />
                    </RadioGroup>
                    {touched.role && errors.role && (
                      <Typography color="error" variant="body2">
                        {errors.role}
                      </Typography>
                    )}
                  </FormControl>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    disabled={isSubmitting}
                  >
                    Sign Up
                  </Button>
                  <Grid container>
                    <Grid item>
                      <Link href="/login" variant="body2">
                        {"Already have an account? Sign In"}
                      </Link>
                    </Grid>
                  </Grid>
                </Form>
              )}
            </Formik>
            
        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
        <MuiAlert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          {successMessage}
        </MuiAlert>
      </Snackbar>


            {errorMessage && (
              <Alert severity="error" sx={{ width: '100%', mt: 2 }}>
                {errorMessage}
              </Alert>
            )}
          </Box>
        </Grid>
      </Grid>
    
  );
}
