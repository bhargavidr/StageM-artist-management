import axios from '../../../config/axios'
import { toast } from "react-toastify";
import { SET_LOADER, RESET_LOADER, setLoader, resetLoader } from './userAction';

export const GET_USERS = 'GET_USERS'
export const GET_MSGS = 'GET_MESSAGES'
export const SEND_MSG = 'SEND_MESSAGE'
export const UPDATE_READ = 'UPDATE_READ'
export const GET_UNREAD = 'GET_UNREAD'

export const startGetUsers = () => {
    return async(dispatch) => {
        try{
            const response = await axios.get('/messages/users',{
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            })
            dispatch(setUsers(response.data))
            dispatch(resetLoader())
        }catch(e){
            dispatch(resetLoader())
            toast.error(e.response.data.error)
        }
    }
}

const setUsers = (users) => {
    return { type: GET_USERS, payload: users}
}

export const startGetMessages = (id) => {
    return async(dispatch) => {
        try{
            const response = await axios.get(`/messages/${id}`,{
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            })
            dispatch(setMessages(response.data))
            dispatch(resetLoader())
        }catch(e){
            dispatch(resetLoader())
            toast.error(e.response.data.error)
        }
    }
}

export const startGetUnreadMessages = (id) => {
    return async(dispatch) => {
        try{
            const response = await axios.get('/messages/unread',{
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            })
            dispatch(setUnread(response.data))
            dispatch(resetLoader())
        }catch(e){
            dispatch(resetLoader())
            toast.error(e.response.data.error)
        }
    }
}


export const startSendMessage = (id, message) => { 
    return async(dispatch) => {
        try{            
            const response = await axios.post(`/messages/send/${id}`,{message},{
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            })
            dispatch(resetLoader())
            dispatch(startGetMessages(id))
        }catch(e){
            dispatch(resetLoader())
            toast.error(e.response.data.error)
        }
    }
}

export const startUpdateRead = (id) => {
    return async (dispatch) => {
        try{
            const response = await axios.put(`/messages/${id}`,{},{
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            })
            dispatch(setMessages(response.data))
            dispatch(startGetUnreadMessages(id))
            dispatch(resetLoader())
        }catch (e){
            dispatch(resetLoader())
            toast.error(e.response.data.error)
        }
    }
}

const setMessages = (messages) => {
    return { type: GET_MSGS, payload: messages}
}

const setUnread = (messages) => {
    return { type: GET_UNREAD, payload: messages}
}