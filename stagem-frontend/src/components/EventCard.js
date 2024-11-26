import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea, Chip } from '@mui/material';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import { useTheme } from '@emotion/react';
import { useNavigate } from 'react-router-dom';

const EventCard = ({ event }) => {
  const now = new Date();
  const eventDate = new Date(event.date);
  const navigate = useNavigate()

  const setBackgroundColor = () => {
    if(eventDate > now){
      return theme.palette.secondary.dark 
    } else {
      return 'black'
    }
  }

  const theme = useTheme()

  return (
    <CardActionArea sx={{ width: '94%', my: 1 }}>
    <Card
      onClick={() => navigate(`/events/${event._id}`)}
      sx={{
        width: '100%',
        aspectRatio: '3 / 4',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
  
      {event.media.length < 1 ? (
        <Box
          sx={{
            height: '40%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            flexGrow: 1,
            backgroundColor: setBackgroundColor(),
          }}
        >
          <Typography variant="h5" component="div" color="white">
            {eventDate > now && 'UPCOMING!'}
          </Typography>
          <Typography variant="subtitle1" color="white">
            {new Date(event.date).toLocaleDateString()}
          </Typography>
        </Box>
      ) : (
        <CardMedia
          component="img"
          sx={{ height: '40%', objectFit: 'cover' }} 
          image={event.media[0]}
          alt={event.eventTitle}
        />
      )}
  
      {/* Card Content */}
      <CardContent
        sx={{
          height: '60%', 
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        {/* Event Title */}
        <Typography variant="h5" sx={{ height: '8%', fontWeight: 'bold' }}>
          {event.eventTitle}
        </Typography>
  
        {/* AR Manager Info */}
        <Typography variant="subtitle1" sx={{ height: '10%' }}>
          {event.arManager.identityName}
        </Typography>
  
        {/* Event Date & Location */}
        <Box sx={{ height: '15%' }}>
          <Typography variant="body2" color="text.secondary">
            {new Date(event.date).toLocaleDateString()}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {event.location === 'online' ? 'Online' : event.location.address}
          </Typography>
        </Box>
  
        {/* Artist Titles (Conditionally Rendered) */}
        {eventDate > now && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', height: '15%' }}>
            {event.artistTitles.map((artistTitle, i) => (
              <Chip size='small' label={artistTitle} key={i} />
            ))}
          </Box>
        )}
  
        <Typography
          variant="body2"
          color="text.secondary"
          paragraph
          sx={{ height: '20%' }}
        >
          {event.description.slice(0, 120)}...
        </Typography>
  
        {/* Last Updated */}
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ textAlign: 'end', ml: 1, height: '5%' }}
        >
          Last updated at {new Date(event.updatedAt).toLocaleString()}
        </Typography>
      </CardContent>
    </Card>
  </CardActionArea>
  
  );
};


export default EventCard
