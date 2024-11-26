import axios from '../../../config/axios';
import { SET_LOADER, RESET_LOADER, SET_SERVER_ERRORS } from './userAction'
import { toast } from "react-toastify";

export const MY_APPLICATIONS = "MY_APPLICATIONS";
export const SINGLE_APPLICATION = 'SINGLE_APPLICATION';

export const startSubmitApplication = (formData, eventId, id, resetAndMove) => {
    return async (dispatch, getState) => {
        dispatch(setLoader)

        let response = '';
        try {
            const state = getState();
            const role = state.user.account.role;
            
            if (id) { // Update if id is present
                response = await axios.put(`/${role}/event/${eventId}/application/${id}`, formData, {
                    headers: {
                        Authorization: localStorage.getItem('token')                        
                    }
                });
            } else { // No id means new application
                response = await axios.post(`/${role}/event/${eventId}/application`, formData, {
                    headers: {
                        Authorization: localStorage.getItem('token')
                    }
                });
            }
            dispatch(setApplication(response.data.data));
            dispatch(setServerErrors(null));
            toast.success(response.data.message)
            !id && resetAndMove()
        } catch (e) {
            console.log(e);
            dispatch(resetLoader());
            toast.error(e.response.data.error);
        }
    }
}

export const getMyApplications = (eventId, page) => {
    return async (dispatch, getState) => {
        const state = getState();
        const role = state.user.account.role;
        let url = '';

        if (role === 'arManager' && eventId) {
            url = `/${role}/event/${eventId}/applications`;
        } else if (role === 'artist') {
            url = `/${role}/applications`;
        }

        try{
            const response = await axios.get(url, {
                headers: {
                    Authorization: localStorage.getItem('token'),
                },
                params: { page },
            });
            dispatch(setMyApplications(response.data));
            dispatch(setServerErrors(null));
        } catch (err) {
            toast.error(err.response.data.error);
            dispatch(resetLoader());
        }
    }
}

const setMyApplications = (applications) => {
    return { type: MY_APPLICATIONS, payload: applications };
}

export const startSingleApplication = (id, eventId) => {
    return async (dispatch, getState) => {
        const state = getState();
        const role = state.user.account.role;

        let url = ''
            
        if (role === 'arManager' && eventId) {
            url = `/${role}/event/${eventId}/application/${id}`;
        } else if (role === 'artist') {
            url = `/${role}/application/${id}`;
        }

        try {            
            const response = await axios.get(url, {
                headers: {
                    Authorization: localStorage.getItem('token'),
                },
            });
            dispatch(setApplication(response.data));
            dispatch(setServerErrors(null));
            dispatch(resetLoader());
        } catch (err) {
            dispatch(setServerErrors(err.response.data.error));
            dispatch(resetLoader());
        }
    }
}

export const startDeleteApplication = (id, eventId, resetAndMove) => {
    return async (dispatch, getState) => {
        const state = getState();
        const role = state.user.account.role;
        try {            
            const response = await axios.delete(`/${role}/event/${eventId}/application/${id}`, {
                headers: {
                    Authorization: localStorage.getItem('token'),
                },
            });
            dispatch(setApplication(null));
            dispatch(setServerErrors(null));
            toast.success('Application deleted')
            resetAndMove()
        } catch (err) {
            toast.error(err.response.data.error);
            dispatch(resetLoader());
        }
    }
}


const setApplication = (application) => {
    return { type: SINGLE_APPLICATION, payload: application };
}


const setServerErrors = (error) => {
    return { type: SET_SERVER_ERRORS, payload: error };
}

export const setLoader = (value) => {
    return { type: SET_LOADER };
}

export const resetLoader = (value) => {
    return { type: RESET_LOADER };
}
