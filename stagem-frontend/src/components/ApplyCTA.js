import React from 'react'
import { Typography, Paper, Stack  } from '@mui/material';
import SubjectRoundedIcon from '@mui/icons-material/SubjectRounded';
import PaymentsSharpIcon from '@mui/icons-material/PaymentsSharp';
import RecentActorsSharpIcon from '@mui/icons-material/RecentActorsSharp';
import { useNavigate, useParams } from 'react-router-dom';

const ApplyCTA = ({singleEvent, color}) => {
    const navigate = useNavigate()
    const {id} = useParams()

  return (
    <Paper elevation={3} component='a' onClick={() => navigate(`/events/${id}/apply`)}
        sx={{ p: 1,
            mt: 2,
            right: 24,
            top:80,
            width: '240px',
            backgroundColor: color.main,
            height: 'fit-content',
            position: 'fixed',
            cursor: 'pointer',
            '&:hover': {
                backgroundColor: color.dark,
            } }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom align="center">
            APPLY NOW !
        </Typography>

        <Stack direction="column" spacing={1}>
            <Stack direction="row" alignItems="center">
                <RecentActorsSharpIcon fontSize="small" sx={{ mr: 1 }} />
                {singleEvent.artistTitles.map((ele,i) => 
                    <Typography variant="body2" sx={{mx:1}}>{ele}</Typography>)}
            </Stack>

            {singleEvent.stipend && (
                <Stack direction="row" alignItems="center">
                    <PaymentsSharpIcon fontSize="small" sx={{ mr: 1 }} />
                    <Typography variant="body2">
                        {singleEvent.stipend[0]} - {singleEvent.stipend[1]}
                    </Typography>
                </Stack>
            )}

            <Stack direction="row" alignItems="center">
                <SubjectRoundedIcon fontSize="small" sx={{ mr: 1 }} />
                <Typography variant="body2">
                    {singleEvent.prompts.length}
                </Typography>
            </Stack>
        </Stack>
    </Paper>
  )
}

export default ApplyCTA