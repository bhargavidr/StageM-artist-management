import axios from '../../../config/axios'
import { SET_LOADER, RESET_LOADER, SET_SERVER_ERRORS } from './userAction'
import { toast } from "react-toastify";


export const PROFILE_EVENTS="PROFILE_EVENTS"
export const SINGLE_EVENT = 'SINGLE_EVENT'
export const ALL_EVENTS = "ALL_EVENTS"
export const SET_REQUESTS = "SET_REQUESTS"


export const startPublishEvent = (formData, resetAndMove, id) => {
    return async (dispatch, getState) => {
        try{         
            const state = getState();
            const role = state.user.account.role   
            let response = ''
            if(id){ //update if id is present
                response = await axios.put(`/${role}/event/${id}`, formData, {
                    headers: {
                        Authorization: localStorage.getItem('token'),
                        "Content-Type":"multipart/form-data"
                    }
                })
            }else{ //no id means new event
                response = await axios.post(`/${role}/event`, formData, {
                    headers: {
                        Authorization: localStorage.getItem('token'),
                        "Content-Type":"multipart/form-data"
                    }
                })
            }
            dispatch(setEvent(response.data.data))
            dispatch(setServerErrors(null))
            resetAndMove()
            toast.success(response.data.message)
        }catch(e){
            console.log(e)
            dispatch(resetLoader())
            dispatch(setServerErrors(e.response.data.error))
        }
    }
}

export const setEvent = (event) => {
    return {type: SINGLE_EVENT, payload: event}
}

export const startProfileEvents = (id) => { //only for arManager
    return async (dispatch, getState) => {
        try{
            const response = await axios.get(`/profile/${id}/events`, { 
                headers: {
                    Authorization: localStorage.getItem('token'),
                }
            })
            dispatch(setProfileEvents(response.data))
            dispatch(setServerErrors(null))
        }catch(err){
            dispatch(setServerErrors(err.response.data.error))
        }
        
    }
}

export const setProfileEvents = (events) => {
    return { type: PROFILE_EVENTS, payload: events}
}

export const startAllEvents = (search) => {
    return async (dispatch) => {
        try{
            const response = await axios.get(`/events`, {
                headers: {
                    Authorization: localStorage.getItem('token')
                }, 
                params: {search}
            })
            dispatch(setAllEvents(response.data))
            dispatch(setServerErrors(null))
        }catch(err){
            dispatch(setServerErrors(err.response.data.error))
        }
        
    }
}

const setAllEvents = (events) => {
    return { type: ALL_EVENTS, payload: events}
}

export const startSingleEvent = (id) => {
    return async (dispatch) => {
        try{
            const response = await axios.get(`/event/${id}`)
            dispatch(setEvent(response.data))
            dispatch(setServerErrors(null))
            dispatch(resetLoader())
        }catch(err){ 
            dispatch(setServerErrors(err.response.data.error))
            dispatch(resetLoader())
        } 
    }
}

export const deleteEvent = (id) => {
    return async (dispatch) => {
        try{
            const response = await axios.delete(`arManager/event/${id}`, {
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            })
            dispatch(setEvent(response.data))
            dispatch(setServerErrors(null))
            dispatch(resetLoader())
            toast.success(response.data.message)
        }catch(err){ 
            toast.error(err.response.data.error)
            dispatch(resetLoader())
        } 
    }
}

export const startRequest = (eventId, id, status) => {
    return async (dispatch, getState) => {
        const state = getState();
        const role = state.user.account.role
        try{
            let res = ''
            if(id && status && role == 'arManager'){
                res = await axios.put(`${role}/event/${eventId}/request/${id}`, {status}, {
                    headers: {
                        Authorization: localStorage.getItem('token')
                    }
                })
            } else {
                res = await axios.post(`${role}/event/${eventId}/request`,{}, {
                    headers: {
                        Authorization: localStorage.getItem('token')
                    }
                })
            }            
            dispatch(setServerErrors(null))
            dispatch(resetLoader())
            toast.success(res.data.message)
            dispatch(getRequests())
        }catch(e){
            dispatch(resetLoader());
            toast.error(e.response.data.error);
        }
    }
}

export const getRequests = () => {
    return async (dispatch, getState) => {
        const state = getState();
        const role = state.user.account.role
        try{
            const response = await axios.get(`${role}/requests`, {
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            })
            dispatch(setMyRequests(response.data))
            dispatch(setServerErrors(null))
            dispatch(resetLoader())
        }catch(err){ 
            dispatch(setServerErrors(err.response.data.error))
            dispatch(resetLoader())
        } 
    }
}

const setMyRequests = (requests) => {
    return {type: SET_REQUESTS, payload: requests}
}

const setServerErrors = (error) => {
    return { type: SET_SERVER_ERRORS, payload: error}
}

export const setLoader = (value) => {
    return { type: SET_LOADER }
}

export const resetLoader = (value) => {
    return { type: RESET_LOADER }
}
