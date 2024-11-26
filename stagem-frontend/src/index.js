import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './App.css'
import App from './App';
import reportWebVitals from './reportWebVitals';

import {BrowserRouter} from 'react-router-dom'
import configureStore from './config/reduxStore';
import {Provider} from 'react-redux'
import { AuthProvider } from './contextAPI/SiteContext';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'


const store = configureStore()
store.subscribe(() => {
  console.log(store.getState())
})

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
  <Provider store = {store} >
  <AuthProvider>
      <App />
      <ToastContainer  theme="colored" />
  </AuthProvider>
  </Provider>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
