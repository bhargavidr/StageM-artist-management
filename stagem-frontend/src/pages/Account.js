import React, { useEffect, useState } from 'react'
import {Box, Typography, Button, Switch, Stack, Paper, Grid, Divider, TextField, Alert, IconButton, Collapse, CircularProgress, Tooltip} from '@mui/material'
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { useSelector,useDispatch } from 'react-redux'
import { useTheme } from '@emotion/react';

import { verifyEmail } from '../services/redux-store/actions/userAction';
import LoadingButtonComp from '../components/Buttons/LoadingButtonComp';
import EditEmail from '../components/EditEmail';
import EditPassword from '../components/EditPassword';

const Account = () => {
    const user  = useSelector(state => state.user)
    const [response, setResponse] = useState('')
    const [open, setOpen] = useState({
        alert: false,
        verifyCode: false,
        email: false, 
        password: false
    })

    const theme = useTheme()
    const dispatch = useDispatch()

    const handleVerify = async () => {
        setOpen({...open, verifyCode:true,  password:false})
        const res = await dispatch(verifyEmail())  
        if(res.code){
            setOpen({...open, alert:true, verifyCode:true, password:false})
        }
        setResponse(res)      
    }

    const displayErrors = () => {
        // console.log(serverErrors) 
          let result = <Alert severity="error" variant="outlined" sx={{ mb: 2 }}>
          {user.serverErrors}
        </Alert>
        return result;
    };


  return (
    <Box padding={5} sx={{ml:2}}>
        
        <Typography variant='h3' gutterBottom>Your account</Typography>
        <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
            <Paper sx={{display: 'flex', flexDirection: 'column', justifyContent: 'center',
                        maxWidth:'fit-content',
                        padding: 2,
                        mb: 1,
                        backgroundColor:theme.palette.secondary.dark}}>

                <Box display='flex' justifyContent='flex-start' sx={{p: 1}} alignItems='center'>
                <Typography variant='body1' gutterBottom>Email - {user.account.email}</Typography>
                <Tooltip title="Change Email" arrow><Button variant="outlined" 
                        color='primary' 
                        onClick={handleVerify} 
                        size='small' 
                        disabled={open.verifyCode}
                        sx={{ml:2}}>Change</Button></Tooltip>
                </Box>

                <Box display='flex' justifyContent='flex-start' sx={{p: 1}} alignItems='center'>
                <Typography variant='body1' gutterBottom>Password - ******</Typography>
                <Tooltip title="Change Password" arrow><Button variant="outlined" 
                        color='primary' 
                        disabled={open.password}
                        onClick={() => setOpen({...open, password: true, email:false, verifyCode: false})} 
                        size='small' 
                        sx={{ml:2}}>Change</Button></Tooltip>
                </Box>

                <Box display='flex' justifyContent='flex-start'>
                    {user.account.isPremium ? <CheckRoundedIcon color='success'/> : <CloseRoundedIcon /> }
                    <Typography variant='body1' gutterBottom>Premium Account</Typography>
                </Box>     
            </Paper>
            <Stack spacing={1} sx={{maxWidth:'80%', justifyContent: 'flex-start'}} >
        <Collapse in={open.alert}>
                <Alert sx={{ mb: 2 }}
                action={
                    <IconButton
                    aria-label="close"
                    color="inherit"
                    size="small"
                    onClick={() => {
                        setOpen({...open, alert:false});
                    }}
                    >
                    <CloseRoundedIcon fontSize="inherit" />
                    </IconButton> }                
                >
                A verification code has been sent to your email address
                </Alert>
      </Collapse>
            {user.serverErrors && displayErrors()}
            {open.verifyCode && <EditEmail response={response} open={open} setOpen={setOpen} />}
            {open.password && <EditPassword open={open} setOpen={setOpen} />}
            </Stack>
            </Grid>
        </Grid>
    </Box>
  )
}

export default Account