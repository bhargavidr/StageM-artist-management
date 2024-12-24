import React, { useState, useEffect } from 'react';
import { verifyEmail, updatePassword } from '../services/redux-store/actions/userAction';
import { useDispatch } from 'react-redux';
import { toast } from "react-toastify"; 
import { useSiteData } from '../contextAPI/SiteContext';
import { TextField, Button } from '@mui/material';
import CheckRounded from '@mui/icons-material/CheckRounded';
import CloseRounded from '@mui/icons-material/CloseRounded';
import LoadingButtonComp from '../components/Buttons/LoadingButtonComp';
import validator from 'validator';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
    const [response, setResponse] = useState(null);
    const [email, setEmail] = useState('');
    const [emailOpen, setEmailOpen] = useState(true);
    const [code, setCode] = useState('');
    const [password, setPassword] = useState({
        open: false,
        new: ''
    });
    const dispatch = useDispatch();
    const { siteData, dispatchSiteData } = useSiteData();
    const isLoading = siteData.isLoading;
    const navigate = useNavigate();

    const [isButtonDisabled, setButtonDisabled] = useState(false);


    useEffect(() => {
        if (response && code === response.code.toString()) {
            setPassword({ ...password, open: true });
            setEmailOpen(false)
        } else {
            setPassword({ ...password, open: false });
        }
    }, [code, response]);

    const clientValidationsEmail = () => {
        const errors = {};
        if (validator.isEmpty(email)) {
            errors.email = 'Email is required';
        }else if(!validator.isEmail(email)){
            errors.email = 'Invalid email format'
        }
        return errors
    }

    const clientValidationsPassword = () => {
        const errors = {};
        if (validator.isEmpty(password.new)) {
            errors.newPassword = 'New password is required';
        } else if (!validator.isLength(password.new, { min: 5, max: 81 })) {
            errors.newPassword = 'Password must be between 5 and 81 characters';
        }
        return errors;
    };

    const handleSendCode = async () => {    
        try{
            const errors = clientValidationsEmail();
            if (Object.keys(errors).length > 0) {
                dispatchSiteData({ type: 'SET_CLIENT_ERRORS', payload: errors });
                return;
            }

            dispatchSiteData({ type: 'RESET_CLIENT_ERRORS' });
            setButtonDisabled(true);
            setTimeout(() => setButtonDisabled(false), 10000); // Disable button for 10 seconds
            
            const res = await dispatch(verifyEmail(email)); // Pass email to verifyEmail action
                if (res.code) {
                    toast.success(res.message);
                    setResponse(res);
                }
        }catch(e){

        }
    
    };

    const handleSubmit = async () => {
        const errors = clientValidationsPassword();
        if (Object.keys(errors).length > 0) {
            dispatchSiteData({ type: 'SET_CLIENT_ERRORS', payload: errors });
            return;
        }
        dispatchSiteData({ type: 'RESET_CLIENT_ERRORS' });
        const data = {email, newPassword: password.new}
        dispatch(updatePassword(data, resetForm));        
    };

    const resetForm = () => {
        setPassword({open:false, new:''})
        setCode('')
        setEmail('')
        setResponse(null)
        navigate('/login');
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
            <TextField
                required
                disabled={!setEmailOpen}
                placeholder="Enter registered email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={!!siteData.clientErrors?.email}
                helperText={siteData.clientErrors?.email}  
            />
            <Button
                size='small'
                onClick={handleSendCode}
                disabled={isButtonDisabled}
                style={{ marginBottom: 20 }}
            >
                {isButtonDisabled ? 'Sending...' : 'Send Code'}
            </Button>

            <TextField
                variant="standard"
                label="Enter verification code"
                value={code}
                onChange={(e) => setCode(e.target.value.trim())}
                InputProps={{
                    endAdornment:
                        code ? (
                            password.open ? (
                                <CheckRounded color="success" />
                            ) : (
                                <CloseRounded color="error" />
                            )
                        ) : null
                }}
                style={{ marginBottom: 20 }}
                
            />
            <TextField
                label="New password"
                required
                type="password"
                disabled={!password.open}
                value={password.new}
                onChange={(e) => setPassword({ ...password, new: e.target.value.trim() })}
                error={!!siteData.clientErrors?.newPassword}
                helperText={siteData.clientErrors?.newPassword}                
                style={{ marginBottom: 20 }}
            />
            <LoadingButtonComp disabled={!password.open} handleSubmit={handleSubmit} isLoading={isLoading} />
        </div>
    );
};

export default ForgotPassword;
