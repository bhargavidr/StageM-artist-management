import React, { createContext, useContext, useReducer, useState } from 'react';

// Create context
const SiteContext = createContext();

const initialState = {
    isDashboardOn: false,
    titles : ['Guitarist', 'Singer', 'Dancer', 'Music Band', 'Stand Up Comedy', 'Painter'],
    clientErrors: {},
    isLoading: false
}

const reducer = (state, action) => {
    switch(action.type) {

        case 'DASHBOARD_ON': return {
            ...state, isDashboardOn: true
        }

        case 'DASHBOARD_OFF': return {
            ...state, isDashboardOn: false
        }       

        case 'ADD_TITLE_FROM_DIALOG' : {
            //add axios to admin to add title
            return {
                ...state, 
                titles: [...state.titles, action.payload]
            }
        }

        case 'SET_CLIENT_ERRORS' : return {
                ...state, clientErrors: action.payload
            }
        

        case 'RESET_CLIENT_ERRORS' : return {
            ...state, clientErrors: {}
        }

        case 'SET_LOADER': return {...state, isLoading: true}
        case 'RESET_LOADER': return {...state, isLoading: false}

        default: {
            return state
        }
    }
}

// AuthProvider component
export const AuthProvider = ({ children }) => {
    const [siteData, dispatchSiteData] = useReducer(reducer, initialState)

    return (
        <SiteContext.Provider value={{ siteData, dispatchSiteData }}>
            {children}
        </SiteContext.Provider>
    );
};


export const useSiteData = () => {
    return useContext(SiteContext);
};
