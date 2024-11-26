import React, {useState} from 'react'
import { TextField} from '@mui/material'
import LoadingButtonComp from './Buttons/LoadingButtonComp'
import validator from 'validator'

import { updatePassword, setLoader, resetLoader } from '../services/redux-store/actions/userAction'
import { useDispatch, useSelector } from 'react-redux'
import { useSiteData } from '../contextAPI/SiteContext'

const EditPassword = ({open, setOpen}) => {
    const [password, setPassword] = useState({
        prev:'', newPassword: ''
    })

    const {isLoading} = useSelector( state => state.user )

    const dispatch = useDispatch()
    const {siteData, dispatchSiteData} = useSiteData()

    const errors = {}
    const clientValidations = () => {
        if (validator.isEmpty(password.prev)) {
            errors.prev = 'Old password is required';
        }else if(!validator.isLength(password.prev, { min: 5, max: 81 })){
            errors.prev = 'Password must be between 5 and 81 characters'
        }


        if (validator.isEmpty(password.newPassword)) {
            errors.newPassword = 'New password is required';
        } else  if(password.prev == password.newPassword){
            errors.newPassword = 'New password cannot be the same as the old password'
        } else if(!validator.isLength(password.newPassword, { min: 5, max: 81 })){
            errors.newPassword = 'Password must be between 5 and 81 characters'
        }
    }


    const handleSubmit = () => {
        dispatch(setLoader())
        clientValidations()

        if(Object.keys(errors).length > 0){
            dispatchSiteData({type: 'SET_CLIENT_ERRORS', payload: errors})
            dispatch(resetLoader())
            return
        }
        dispatchSiteData({type: 'RESET_CLIENT_ERRORS'})
        dispatch(updatePassword(password, setOpen))
    }

  return (
    <><TextField
            label="Old password"
            required
            type='password'
            value={password.prev}
            onChange={(e) => setPassword({ ...password, prev: e.target.value.trim() })} 
            error={!!siteData.clientErrors?.prev }
            helperText={siteData.clientErrors?.prev }
            />

        <TextField
                label="New password"
                required
                type='password'
                disabled={!open.password}
                value={password.newPassword}
                onChange={(e) => setPassword({ ...password, newPassword: e.target.value.trim() })} 
                error={!!siteData.clientErrors?.newPassword }
                helperText={siteData.clientErrors?.newPassword }
                />

        <LoadingButtonComp disabled={!open.password} handleSubmit={handleSubmit} isLoading={isLoading} /> </>
  )
}


export default EditPassword