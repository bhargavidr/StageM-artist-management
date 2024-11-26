import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Avatar, Button, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, Typography, TextField } from '@mui/material';
import { getMyApplications } from '../services/redux-store/actions/applicationsAction';
import { Link, useNavigate } from 'react-router-dom';
import { format, parseISO } from 'date-fns';

import CircularLoader from '../components/CircularLoader';
import SingleApplication from './SingleApplication';

const Applications = ({eventId, eventName}) => {
  const { myApplications } = useSelector(state => state.applications);
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate()

  const [page, setPage] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    dispatch(getMyApplications(eventId, page));
  }, [page, eventId]);


  // Handle page change
  const handleChangePage = (event, newPage) => {
    // console.log(newPage,'newPage')
    setPage(newPage);
  };

  const setHeading = () => {
     return user.account.role === 'arManager' ? `Applications for ${eventName}` : 'My Applications'
  }

  return (
    myApplications ? <Box sx={{
                            width: '100%',                            
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center', 
                            justifyContent: 'center'}} >

      <Typography variant='h3' gutterBottom> {setHeading()} </Typography>
      <TableContainer component={Paper} sx={{maxWidth: eventId ? '100%' : '60%'}}>
      <Table aria-label="applications table" >
        <TableHead>
          <TableRow  sx={{ fontWeight: 'bold' }}>            
            {user.account.role === 'arManager' && <TableCell  sx={{ fontWeight: 'bold' }}>Applied By</TableCell>}
            {user.account.role === 'artist' && <TableCell  sx={{ fontWeight: 'bold' }}>Event</TableCell>}
            <TableCell  sx={{ fontWeight: 'bold' }}>Position</TableCell>           
            <TableCell  sx={{ fontWeight: 'bold' }}>Submission date</TableCell>
            <TableCell  sx={{ fontWeight: 'bold' }}>Prompts answered</TableCell>
            <TableCell  sx={{ fontWeight: 'bold' }}>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {myApplications.applications.map((ele) => (
            <TableRow key={ele._id} sx={{p: 1}} >        
              {user.account.role === 'arManager' ?               
                  <TableCell>
                    <Link to={`/profile/${ele.appliedBy._id}`} style={{ display: 'flex', alignItems: 'center', color:'white' }}>
                    <Avatar alt={ele.appliedBy.username} src={ele.appliedBy.pfp} size='small' sx={{mr:1}} />
                      @{ele.appliedBy.username}
                    </Link>
                  </TableCell>  :
                  <TableCell>
                     <Link to={`/events/${ele.event._id}`} style={{ display: 'flex', alignItems: 'center', color:'white'}}>
                      <Avatar alt={ele.event.arManager.username} src={ele.event.arManager.pfp} size='small' sx={{mr:1}} />
                      @{ele.event.eventTitle}
                    </Link>
                  </TableCell>            
              }
              <TableCell>{ele.artistTitles}</TableCell>             
              <TableCell>{format(parseISO(ele.createdAt), 'do MMMM, yyyy h:mm aaa')}</TableCell>
              <TableCell align='center' >{ele.promptResponses.filter(res => res).length}</TableCell>
              <TableCell>{ele.status}</TableCell>
              <TableCell><Button size='small' 
                            onClick={() => navigate(`/events/${ele.event._id}/application/${ele._id}`)}
                            >View</Button>
              </TableCell>
              {open && <SingleApplication open={open} setOpen={setOpen} id={ele._id}/>}
            </TableRow>
          
          ))}
        </TableBody>
      </Table>

      <TablePagination
        component="div"
        count={myApplications.count}
        page={page}
        showFirstButton
        showLastButton
        rowsPerPageOptions={[5]}
        rowsPerPage={5}
        onPageChange={handleChangePage}
      />
    </TableContainer>
    
    </Box> : <CircularLoader />
  );
};

export default Applications;
