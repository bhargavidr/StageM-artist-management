import React, { useEffect, useState } from 'react';
import { IconButton, Drawer, Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, Typography } from '@mui/material';
import {
  MenuOpenRounded,
  KeyboardDoubleArrowRightRounded,
  ArrowBackRounded,
  AccountCircle,
  EditCalendar,
  Description,
  ManageAccounts,
  AutoAwesome,
  LogoutRounded,
  HowToReg
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { useSiteData } from '../../contextAPI/SiteContext';
import { useSelector, useDispatch } from 'react-redux';
import {useNavigate} from 'react-router-dom'

import { userLogout } from '../../services/redux-store/actions/userAction';

export default function DrawerMenu({ open, setOpen }) {
  const theme = useTheme();
  const {siteData,dispatchSiteData} = useSiteData()

  const user=useSelector(state => state.user)
  const dispatch = useDispatch()

  const navigate = useNavigate();

  const optionItems = [ { text: 'Premium', icon: <AutoAwesome />, path: '/premium' },
    { text: 'Manage Profile', icon: <AccountCircle />, path: '/profile' },
    { text: 'Account settings', icon: <ManageAccounts />, path: '/account' },
    { text: 'Requests', icon: <HowToReg />, path: '/requests' },
    { text: 'Applications', icon: <Description />, path: '/applications'}
    ]
  
  if(user.account?.role == 'arManager'){
    optionItems.push({ text: 'Create Event', icon: <EditCalendar /> , path: '/events/edit'})
  }

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleBack = () => {
    setOpen(false)
    dispatchSiteData({type:'DASHBOARD_OFF'})
    navigate('/events')
  };

  const handleLogout = () => {
    toggleDrawer()
    dispatch(userLogout()); 
    navigate('/login')
  }

  const list = () => (
    <Box
      sx={{
        maxWidth: 240,
        backgroundColor: theme.palette.secondary.main,
        color: theme.palette.secondary.contrastText,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        paddingBottom: 3,
      }}
      role="presentation"
    >
      <List sx={{ flexGrow: 1 }}>
        <ListItem key="back-button" disablePadding>
          <ListItemButton onClick={handleBack}>
            <ListItemIcon>
              <ArrowBackRounded />
            </ListItemIcon>
            <ListItemText primary="BACK TO WEBSITE" />
          </ListItemButton>
        </ListItem>
        <Divider />
        {optionItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton onClick={() => {toggleDrawer();navigate(item.path);}}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
        <ListItem key="logout" disablePadding>
          <ListItemButton onClick={handleLogout}>
            <ListItemIcon>
              <LogoutRounded />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
      <Divider />
      <Box textAlign="center">
        <Typography variant="subtitle2" color="inherit">
          StageM
        </Typography>
      </Box>
    </Box>
  );

  return (
     <div>
      {siteData.isDashboardOn && <IconButton
        sx={{
          position: 'fixed',
          right: open ? 260 : 10, 
          top: 70,
          zIndex: 1201,
          padding: '20px',
        }}
          size="large"
          color="inherit"
          aria-label={open ? 'close drawer' : 'open drawer'}
          onClick={toggleDrawer}
        >
        {open ? <KeyboardDoubleArrowRightRounded /> : <MenuOpenRounded />}
      </IconButton>}
      <Drawer
        variant="persistent"
        anchor="right"
        open={open}
        ModalProps={{
          keepMounted: false,
        }}
        sx={{
          width: 240,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
          }
        }}
      >
        {list()}
      </Drawer>
    </div>
  );
}
