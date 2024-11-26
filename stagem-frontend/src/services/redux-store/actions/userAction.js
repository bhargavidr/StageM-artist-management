import axios from '../../../config/axios'
import { toast } from "react-toastify";
import { setProfileEvents } from './eventsAction'; //for artist events

export const LOGIN="LOGIN"
export const SET_SERVER_ERRORS="SET_SERVER_ERRORS"
export const LOGOUT="LOGOUT"
export const SET_LOADER="SET_LOADER"
export const RESET_LOADER="RESET_LOADER"
export const SET_MY_PROFILE="SET_MY_PROFILE"
export const SET_SINGLE_PROFILE = "SET_SINGLE_PROFILE"
export const UPDATE_ACC = "UPDATE_ACC"

export const startUserLogin= (formData, resetForm) => {
    return async (dispatch) => {
        try{
            const response = await axios.post('/login', formData)
            localStorage.setItem('token',response.data.token)
            dispatch(userLogin(response.data.data))
            dispatch(getProfile())
            dispatch(setServerErrors(null))
            resetForm()
        }catch(e){
            console.log(e)
            dispatch(setServerErrors(e.response.data.error))
        }
    }
}


export const getAccAndProfile = () => {
    return async (dispatch) => {
        
    try{
        const responseAcc = await axios.get('/account', {
            headers: {
                Authorization: localStorage.getItem('token')
            }
        })
        dispatch(userLogin(responseAcc.data))
        dispatch(getProfile())
        dispatch(setServerErrors(null))
    }catch(e){
        console.log(e)
        dispatch(resetLoader())
        dispatch(setServerErrors(e.response?.data?.error))
    }}
}

export const verifyEmail = () => {
    return async (dispatch) => {
    try{
        const response = await axios.get('/account/verifyEmail', {
            headers: {
                Authorization: localStorage.getItem('token')
            }
        })
        dispatch(setServerErrors(null))
        return response.data
    }catch(e){
        console.log(e)
        dispatch(resetLoader())
        dispatch(setServerErrors(e.response.data.error))
    }}
}

export const updateEmail = (email, setOpen) => {
    return async (dispatch) => {
        try{
            const response = await axios.put('/account/email', {email}, {
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            })
            dispatch(setServerErrors(null))
            dispatch(userUpdate(response.data.data))
            dispatch(resetLoader())
            setOpen({alert: false,
                verifyCode: false,
                email: false, 
                password: false})
        }catch(e){
            console.log(e)
            dispatch(resetLoader())
            dispatch(setServerErrors(e.response.data.error))
        }}
}

export const updatePassword = (data, setOpen) => {
    return async (dispatch) => {
        try{
            const response = await axios.put('/account/password', data, {
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            })
            dispatch(setServerErrors(null))
            dispatch(userUpdate(response.data.data))
            dispatch(resetLoader())
            setOpen({alert: false,
                verifyCode: false,
                email: false, 
                password: false})
        }catch(e){
            console.log(e)
            dispatch(resetLoader())
            dispatch(setServerErrors(e.response.data.error))
        }}
}

export const userPremiumUpdate = () => {
    return async (dispatch) => {
        try {
            const response = await axios.get('/update-premium', {
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            })
            dispatch(setServerErrors(null))
            dispatch(userUpdate(response.data.data))
            dispatch(resetLoader())
            toast.success(response.data.message)
            localStorage.removeItem('stripeId')
        }catch(err){
            console.log(err)
            dispatch(resetLoader())
        }
    }
}

export const userLogin = (user) => {
    return { type: LOGIN, payload: user}
}


export const userUpdate = (user) => {
    return { type: UPDATE_ACC, payload: user}
}

export const userLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('stripeId')
    localStorage.removeItem('profile')
    return { type: LOGOUT }
}


//profile 
export const startProfile = (formData, resetAndMove) => {
    return async (dispatch, getState) => {
        try{
            const state = getState();
            const role = state.user.account.role

            let response = ''
            if(role){
            if(state.user.myProfile){ //update if profile exists
                response = await axios.put(`/${role}/profile`, formData, {
                    headers: {
                        Authorization: localStorage.getItem('token'),
                        "Content-Type":"multipart/form-data"
                    }
                })
            }else{ //create if profile doesn't exist
                response = await axios.post(`/${role}/profile`, formData, {
                    headers: {
                        Authorization: localStorage.getItem('token'),
                        "Content-Type":"multipart/form-data"
                    }
                })
            }}
            dispatch(getProfile())
            dispatch(setServerErrors(null))
            resetAndMove()
        }catch(e){
            console.log(e)
            dispatch(resetLoader())
            dispatch(setServerErrors(e.response.data.error))
            toast.error(e.response.data)
        }
    }
}

export const getProfile = (userId) => {
    return async (dispatch, getState) => {
        try{
            const state = getState();
            const role = state.user.account.role
            if(!userId ){ //get current user deets
                const response = await axios.get(`/${role}/profile`,{
                    headers: {
                        Authorization: localStorage.getItem('token'),
                    }
                })
                const profile = response.data
                dispatch(setMyProfile(profile))
                if(profile.userId.role == 'artist'){
                    dispatch(setProfileEvents(profile.events))
                }
                dispatch(setServerErrors(null))
                localStorage.setItem('profile',profile.username)
            } else if (userId) {
                const response = await axios.get(`/profile/${userId}`,{
                    headers: {
                        Authorization: localStorage.getItem('token'),
                    }
                })
                const profile = response.data                
                dispatch(setSingleProfile(profile))
                if(profile.userId.role == 'artist'){
                    dispatch(setProfileEvents(profile.events))
                }
                dispatch(setServerErrors(null))              
            }
        }catch(e){
            console.log(e)
            dispatch(resetLoader())
            dispatch(setServerErrors(e.response?.data?.error))
        }
    }
}


export const setMyProfile = (profile) => {
    return {type: SET_MY_PROFILE, payload: profile}
}

export const setSingleProfile = (profile) => {
    return {type: SET_SINGLE_PROFILE, payload: profile}
}


const setServerErrors = (error) => {
    return { type: SET_SERVER_ERRORS, payload: error}
}

//isLoading state
export const setLoader = () => {
    return { type: SET_LOADER }
}

export const resetLoader = () => {
    return { type: RESET_LOADER }
}
