import {LOGIN, SET_SERVER_ERRORS, LOGOUT, SET_MY_PROFILE, SET_SINGLE_PROFILE, UPDATE_ACC, SET_LOADER, RESET_LOADER} from '../actions/userAction'


const initialState = {
    isLoggedIn: false,
    account: null,
    serverErrors: null,
    myProfile: null, 
    singleProfile: null,
    isLoading: false
}

const userReducer = (state = initialState, action) => {
    switch(action.type){
        case LOGIN:   return {...state, isLoggedIn: true, account: action.payload}
        
        case LOGOUT :  return initialState
        
        case SET_SERVER_ERRORS:   return {...state, serverErrors: action.payload}
        
        case SET_MY_PROFILE: 
            return {...state, myProfile: action.payload}

        case SET_SINGLE_PROFILE: 
            return {...state, singleProfile: action.payload}
        
        case UPDATE_ACC:{
            return {...state, account: action.payload}
        }
        case SET_LOADER: return {...state, isLoading: true}
        case RESET_LOADER: return {...state, isLoading: false}
        default: {
            return state
        }
    } 
}

export default userReducer