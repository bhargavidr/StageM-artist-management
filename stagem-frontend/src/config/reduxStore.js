import {legacy_createStore, combineReducers, applyMiddleware} from 'redux'
import {thunk} from 'redux-thunk'

import userReducer from '../services/redux-store/reducers/userReducer'
import eventsReducer from '../services/redux-store/reducers/eventsReducer'
import applicationReducer from '../services/redux-store/reducers/applicationReducer'
import messageReducer from '../services/redux-store/reducers/messageReducer'

const configureStore = () => {
    const store  = legacy_createStore(combineReducers({
        user: userReducer,
        events: eventsReducer,
        applications: applicationReducer,
        messages: messageReducer
    }), applyMiddleware(thunk))

    return store 
}

export default configureStore