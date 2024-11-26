import React, {useState, useEffect} from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';

import PrivateRoute from './components/PrivateRoute';

import Register from "./pages/Register";
import Login from "./pages/Login";
import DrawerMenu from './components/Layout/DrawerMenu';
import AllEvents from './pages/AllEvents'
import AllProfiles from './pages/AllProfiles'

import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile'

import EditEvent from './pages/EditEvent';
import SingleEvent from './pages/SingleEvent';

import Applications from './pages/Applications';
import SingleApplication from './pages/SingleApplication';
import EditApplication from './pages/EditApplication';

import Requests from './pages/Requests';
import MyEvents from './pages/MyEvents';
import Premium from './pages/Premium';
import PaymentStatus from './pages/PaymentStatus';
import Unauthorized from './pages/Unauthorized';

import Header from './components/Layout/Header'

import {useDispatch, useSelector} from 'react-redux'
import {userLogout, getAccAndProfile} from './services/redux-store/actions/userAction'
import Account from './pages/Account';
import Footer from './components/Layout/Footer';
import { useSiteData } from './contextAPI/SiteContext';
import Messages from './pages/Messages';



const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#121212', 
    },
    primary: {
      main: '#FFF',
    },
    secondary: {
      main: '#b71c1c',
      dark: '#801313',
      light: '#c54949',
    },
    }
});

function App() {

  const role  = useSelector(state => state.user.account?.role )
  
  const [open, setOpen] = useState(false); //drawerMenu
  const dispatch = useDispatch();
  const {dispatchSiteData} = useSiteData()

  const location = useLocation()
  const isLoginPage = location.pathname === '/login' || location.pathname === '/register'; //div padding
  useEffect(() => {
    const dashboardPages = ['/profile', '/profile/edit','/account',
                            '/events/edit','/events/edit/:id',                            
                            '/events/:eventId/application/:id','/events/:eventId/applications','/applications',
                            '/requests','/premium']
    if(dashboardPages.includes(location.pathname)){
      dispatchSiteData({type:'DASHBOARD_ON'})
    } else {
      dispatchSiteData({type:'DASHBOARD_OFF'})
    }
  }, [location])
  


  useEffect(()=> {
    if(localStorage.getItem('token')){
      (async() => {
        try{
          dispatch(getAccAndProfile())
        }catch (err){
          dispatch(userLogout())
          console.log(err)
        }
      })();
    }
  },[])


  

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {!isLoginPage && <Box sx={{ display: 'flex' }}>
          <Header open={open} setOpen={setOpen}/>
          <DrawerMenu open={open} setOpen={setOpen}/>
      </Box>}

      <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      </Routes>


      
       {!isLoginPage && <div style={{ paddingTop: '10vh', marginBottom:2, minHeight:'90vh'}}>
      <Routes>      

      <Route path='/events' element={ <AllEvents /> } />
      <Route path='/' element={ <AllEvents /> } />

      <Route path='/artists' element={ <AllProfiles /> } />

      <Route path='/artists/:tag' element={
          <PrivateRoute  permittedRoles={['artist', 'arManager']} >
            <AllProfiles />
          </PrivateRoute>
        } />

      <Route path='/artistManagers' element={ <AllProfiles /> } />

      <Route path='/account' element={
          <PrivateRoute  permittedRoles={['artist', 'arManager']} >
            <Account />
          </PrivateRoute>
        } />

      <Route path='/profile' element={
          <PrivateRoute  permittedRoles={['artist', 'arManager']} >
             <Profile />
          </PrivateRoute>
        } />

      <Route path='/profile/:id' element={
          <PrivateRoute  permittedRoles={['artist', 'arManager']} >
             <Profile />
          </PrivateRoute>
        } />

        <Route path='/profile/edit' element={
          <PrivateRoute permittedRoles={['artist', 'arManager']} >
            <EditProfile />
          </PrivateRoute>
        } />

        <Route path='/events/edit' element={
          <PrivateRoute permittedRoles={['arManager']} >
            <EditEvent />
          </PrivateRoute>
        } />

        <Route path='/events/edit/:id' element={
          <PrivateRoute permittedRoles={['arManager']} >
            <EditEvent />
          </PrivateRoute>
        } />

      <Route path='/events/:id' element={ <SingleEvent /> } />

    <Route path='/events/:eventId/apply' element={
          <PrivateRoute permittedRoles={['artist']} >
            <EditApplication />
          </PrivateRoute>
        } />

    <Route path='/events/:eventId/apply/:id' element={
          <PrivateRoute permittedRoles={['artist']} >
            <EditApplication />
          </PrivateRoute>
        } />

      <Route path='/events/:eventId/applications' element={
          <PrivateRoute permittedRoles={['arManager']} >
            <Applications />
          </PrivateRoute>
        } />

      <Route path='/applications' element={
          <PrivateRoute  permittedRoles={['artist', 'arManager']} >
            {role == 'artist' ? <Applications /> : <MyEvents />}            
          </PrivateRoute>
        } />

    <Route path='/events/:eventId/application/:id' element={
          <PrivateRoute  permittedRoles={['artist', 'arManager']} >
            <SingleApplication />
          </PrivateRoute>
        } />   

    <Route path='/requests' element={
          <PrivateRoute  permittedRoles={['artist', 'arManager']} >
            <Requests />
          </PrivateRoute>
        } />  
      
    <Route path='/premium' element={
        <PrivateRoute  permittedRoles={['artist', 'arManager']} >
          <Premium />
        </PrivateRoute>
      } /> 

    <Route path='/success' element={
        <PrivateRoute permittedRoles={['artist', 'arManager']}>
          <PaymentStatus />
        </PrivateRoute>
      } />

    <Route path='/fail' element={
        <PrivateRoute permittedRoles={['artist', 'arManager']} >
          <PaymentStatus />
        </PrivateRoute>
      } />

    <Route path = '/messages' element={
      <PrivateRoute permittedRoles={['artist', 'arManager']} >
        <Messages />
    </PrivateRoute>
    } />

       </Routes>
      </div>  }
      <Footer />
    </ThemeProvider>
  );
}

export default App;
