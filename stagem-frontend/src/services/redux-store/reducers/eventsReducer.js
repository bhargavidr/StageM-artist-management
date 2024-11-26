import {SET_SERVER_ERRORS, SET_LOADER, RESET_LOADER } from "../actions/userAction"
import {  PROFILE_EVENTS, SINGLE_EVENT, ALL_EVENTS, SET_REQUESTS } from "../actions/eventsAction"

const initialState = {
    allEvents: [],         
    singleProfileEvents: [],          
    singleEvent: null,
    myRequests: [],
    serverErrors: null,
    isLoading: false
}

const eventsReducer = (state=initialState, action) => {
    switch(action.type){
        case SINGLE_EVENT: return {...state, singleEvent: action.payload}
        case PROFILE_EVENTS: return {...state, singleProfileEvents: action.payload}
        case ALL_EVENTS: return {...state, allEvents: action.payload}
        case SET_REQUESTS: return {...state, myRequests: action.payload}
        case SET_SERVER_ERRORS: return {...state, serverErrors: action.payload}        
        case SET_LOADER: return {...state, isLoading: true}
        case RESET_LOADER: return {...state, isLoading: false}
        default: return state
    }
}

export default eventsReducer