import { Button, TextField, Typography, IconButton, Popper, Paper } from '@mui/material';
import React, { useState, useEffect } from 'react';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';

import { useTheme } from '@mui/material/styles';
import { useSiteData } from '../contextAPI/SiteContext';


const ProfilePremium = ({form, setForm,isPremium}) => {
    const {siteData, dispatchSiteData} = useSiteData()
    const theme = useTheme();
    const errors = {
        links: {}
    }

    const handleAddField = (e) => {
        e.preventDefault()
        const formLength = form.links.length
        if(!form.links.at(-1)){
            errors.links[formLength - 1] = 'Link cannot be added when empty'
            dispatchSiteData({type: 'SET_CLIENT_ERRORS', payload: errors})
        } else {
            if (formLength < 6) {
                setForm({...form, links: [...form.links, '']})
            }
            dispatchSiteData({type: 'RESET_CLIENT_ERRORS'})
        } 
    };

    const handleRemoveField = (e, index) => {
        if(index == 0){
            setForm({...form, links: ['']})
        } else{
            const newFields = form.links.filter((ele,i) => i != index  )
            setForm({...form, links: newFields})
        }
        
    }

    
const handleLinkChange = (e, id) => {
    const link = e.target.value.trim()
    // if(fields.includes(link)) throw alert 
    const newFields = form.links.map((ele,i) => (i === id ? link : ele) );
    setForm({...form, links: newFields})
};
    
  return (
    <>  
        {!isPremium && <>
        <Typography variant="h4" gutterBottom>
            Unlock with premium!
          </Typography>
          <Typography variant="body1" gutterBottom>
            Set up your profile and add additional info on your profile with premium
          </Typography> <br /> </> }
          <TextField
            disabled = {!isPremium}
            fullWidth
            label="Bio"
            name="bio"
            value={form.bio}
            multiline
            rows={5}
            onChange={(e) => setForm({...form, bio: e.target.value})}
            variant="outlined"
            error={siteData.clientErrors?.bio }
            helperText={siteData.clientErrors?.bio }
            sx={{ marginBottom: 3,
              '& .Mui-disabled': {                
                color: theme.palette.text.disabled
            }}}
          />

{form.links && form.links.map((ele,i) => (<React.Fragment key={i}>
            <TextField
              disabled = {!isPremium}
              key={i}
              label="Add link (upto 6)"
              name="links"
              size="small"
              error={siteData.clientErrors?.links && siteData.clientErrors.links[i] }
              helperText={siteData.clientErrors?.links && siteData.clientErrors.links[i] }
              value={ele}
              onChange={(e) => handleLinkChange(e, i)}
              variant="outlined"
              sx={{ marginBottom: 2 }}
            />
            <IconButton
                disabled={!isPremium}
                key={i+1}
                color="primary"
                onClick={(e) => handleRemoveField(e, i)} 
                sx={{
                    '&:hover': {
                    bgcolor: theme.palette.secondary.main,
                    },
                }}
                >
                <CloseIcon />
            </IconButton></React.Fragment>
          ))}

          { form.links.length < 6 && (           
            <IconButton
              disabled = {!isPremium}
              color="primary"
              onClick={(e) => handleAddField(e)}
              sx={{                               
                '&:hover': {
                  bgcolor: theme.palette.secondary.main,
                },
              }}
            >
              <AddIcon />
            </IconButton>
          )}

    </>
  )
}

export default ProfilePremium