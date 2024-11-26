import { GET_USERS, GET_MSGS, GET_UNREAD} from "../actions/messageAction"
import { SET_LOADER, RESET_LOADER } from "../actions/userAction"

const initialState = {
    users:[],
    messages: null ,
    unreadMessages: null,
    isLoading: false
}

const messageReducer = (state= initialState, action) => {
    switch(action.type){
        case SET_LOADER: return {...state, isLoading: true}
        case RESET_LOADER: return {...state, isLoading: false}
        case GET_USERS: return {...state, users: action.payload}
        case GET_MSGS: return {...state, messages: action.payload}
        case GET_UNREAD: return {...state, unreadMessages: action.payload}
        default: return state
    }
}

export default messageReducer