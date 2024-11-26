import { MY_APPLICATIONS, SINGLE_APPLICATION } from "../actions/applicationsAction";
import { SET_SERVER_ERRORS,SET_LOADER, RESET_LOADER } from "../actions/userAction"


const initialState = {
    myApplications: null,    
    application: null,     
    serverErrors: null,  
    isLoading: false     
}

const applicationReducer = (state = initialState, action) => {
    switch (action.type) {
        case SINGLE_APPLICATION:
            return { ...state, application: action.payload };
        case MY_APPLICATIONS:
            return { ...state, myApplications: action.payload };
        case SET_SERVER_ERRORS:
            return { ...state, serverErrors: action.payload };
        case SET_LOADER:
            return { ...state, isLoading: true };
        case RESET_LOADER:
            return { ...state, isLoading: false };
        default:
            return state;
    }
}

export default applicationReducer;
