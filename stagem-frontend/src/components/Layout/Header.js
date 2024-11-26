import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Tabs, Tab, Box, Avatar, Menu, MenuItem } from '@mui/material';
import { Link, useNavigate, useLocation, useParams } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import { userLogout } from '../../services/redux-store/actions/userAction';
import { useSiteData } from '../../contextAPI/SiteContext';

const Header = ({ open, setOpen }) => {
  const theme = useTheme();
  const {siteData,dispatchSiteData} = useSiteData()

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();  // Hook to get current path

  const { tag } = useParams(); 
  const user = useSelector((state) => state.user);

  const [anchorEl, setAnchorEl] = useState(null);
  const [tabPath, setTabPath] = useState(user.account?.role == 'artist' ? "/events" : "/artists");  
  
  useEffect(() => {
    // Check the current path and update `tabPath` based on it
    if (location.pathname.startsWith('/artists')) {
      setTabPath('/artists');
    } else if (location.pathname.startsWith('/events') || location.pathname.startsWith('/artistManagers')) {
      setTabPath('/events');
    }
  }, [location.pathname, tag]);

  // on click of avatar
  const handleMenuOpen = (e) => {
    if(user.isLoggedIn){
      setAnchorEl(e.currentTarget);
    } else {
      navigate('/login')
    }    
  };

  const handleMenuClose = (e) => {
    setAnchorEl(null);
    const { id } = e.target;

    if (id === 'dashboard') {
      setOpen(true)
      dispatchSiteData({type:'DASHBOARD_ON'})
      navigate('/profile');
    } else if (id === 'logout') {
      dispatch(userLogout());
      navigate('/login')
    }
  };

  const menuOpen = Boolean(anchorEl);

  const handleTabChange = (newPath) => {
    setTabPath(newPath);
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        background: 'black',
        boxShadow: '0 2px 8px #801313' ,
        width: open ? `calc(100% - 240px)` : '100%',
        marginRight: open ? '240px' : 0,
        transition: 'width 0.3s, margin-right 0.3s',
      }}
    >
      <Toolbar sx={{ display: 'flex', flexGrow: '1', justifyContent: 'center' }}>
        <Typography variant="h6" style={{ flexGrow: 1, maxWidth: '100px' }}>
          <Link to={tabPath} style={{ textDecoration: 'none', color: 'inherit' }}>
            StageM
          </Link>
        </Typography>

        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {!siteData.isDashboardOn ? (
            <>
              <Tabs
                value={tabPath}
                textColor="inherit"
                indicatorColor="secondary"
                centered
                onChange={(e, newPath) => handleTabChange(newPath)}
              >
                <Tab
                  label="Events"
                  component={Link}
                  sx={{ '&:hover': { backgroundColor: theme.palette.secondary.main } }}
                  to="/events"
                  key="eventsTab"
                  value="/events"
                />
                <Tab
                  label="Artists"
                  component={Link}
                  sx={{ '&:hover': { backgroundColor: theme.palette.secondary.main } }}
                  to="/artists"
                  key="artistsTab"
                  value="/artists"
                />
              </Tabs>
            </>
          ) : (
            <Typography variant="h6">Personal Dashboard</Typography>
          )}
        </Box>

        
        {!siteData.isDashboardOn && (
          <IconButton color="inherit" onClick={(e)=> handleMenuOpen(e)}>
            <Avatar src={user.myProfile?.pfp} alt={user.myProfile?.username}/>
          </IconButton>
        )}
        <Menu
          anchorEl={anchorEl}
          open={menuOpen}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <MenuItem id="dashboard" onClick={handleMenuClose}>
            Dashboard
          </MenuItem>
          <MenuItem id="logout" onClick={handleMenuClose}>
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
