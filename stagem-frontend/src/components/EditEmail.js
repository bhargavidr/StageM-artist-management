import React, {useState, useEffect} from 'react'
import { TextField} from '@mui/material'
import LoadingButtonComp from './Buttons/LoadingButtonComp'
import validator from 'validator'

import { useSiteData } from '../contextAPI/SiteContext'
import {useSelector, useDispatch} from 'react-redux'
import { updateEmail, setLoader, resetLoader } from '../services/redux-store/actions/userAction'
import { CheckRounded, CloseRounded } from '@mui/icons-material'

const EditEmail = ({response, open, setOpen}) => {
    const userEmail  = useSelector(state => state.user.account.email)
    const {isLoading} = useSelector( state => state.user )
    const [code, setCode] = useState('')
    const [email, setEmail] = useState(userEmail)

    const dispatch = useDispatch()
    const {siteData, dispatchSiteData} = useSiteData()

    const errors = {}
    const clientValidations = () => {
        if (validator.isEmpty(email)) {
            errors.email = 'Email is required';
        }else if(!validator.isEmail(email)){
            errors.email = 'Invalid email format'
        }
    }

    useEffect(() =>  {        
        if(response && (code == response.code.toString())){
            setOpen({...open, email:true})
        } else {
            setOpen({...open, email:false})
        }
    },[code])

    const handleSubmit = () => {

        dispatch(setLoader())
        clientValidations()

        if(Object.keys(errors).length > 0){
            dispatchSiteData({type: 'SET_CLIENT_ERRORS', payload: errors})
            dispatch(resetLoader())
            return
        }

        dispatchSiteData({type: 'RESET_CLIENT_ERRORS'})

        if(email != userEmail){
            dispatch(setLoader())
            dispatch(updateEmail(email, setOpen))
        } else {
            setOpen({alert: false,
                verifyCode: false,
                email: false, 
                password: false})
        }
    }

  return (
        <><TextField
                    variant='standard'
                    label="Enter verification code"
                    value={code}
                    onChange={(e) => setCode(e.target.value.trim())} 
                    InputProps={{ endAdornment: 
                        code ? open.email ? <CheckRounded color='success'/> : <CloseRounded color='error' /> : null}}
                    />

            <TextField
                    variant='standard'
                    label="Enter email"
                    disabled={!open.email}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} 
                    error={!!siteData.clientErrors?.email }
                    helperText={siteData.clientErrors?.email }
                    />
            <LoadingButtonComp disabled={!open.email} handleSubmit={handleSubmit} isLoading={isLoading}></LoadingButtonComp> </>
  )
}

export default EditEmail