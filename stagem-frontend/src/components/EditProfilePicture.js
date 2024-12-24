import { Avatar,  Fab, Box, Menu, MenuItem } from '@mui/material';
import React, { useState, useEffect } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import validator from 'validator';

export default function EditProfilePicture ({form, setForm}) {
    const [imagePreview, setImagePreview] = useState(form.pfp)
    const [anchorEl, setAnchorEl] = useState(null);
   

    useEffect(()=>{
        if(typeof(form.pfp) == 'string' && validator.isURL(form.pfp)){
            setImagePreview(form.pfp)
        } 
    },[form.pfp])
    
    const handleChange = (e) => {      
        const pfpFile = e.target.files[0]
        if(pfpFile){
            setImagePreview(URL.createObjectURL(pfpFile))
        }
        setForm({ ...form, pfp: pfpFile })        
    }

    const handleMenuOpen = (e) => {
        setAnchorEl(e.currentTarget)
    } 

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);

    return (
        <Box sx={{ position: 'relative', display: 'inline-block', mb: 2 }}>
              <Avatar
                sx={{ width: 200, height: 200, marginBottom: '20px' }}
                alt={form.username}
                src={imagePreview}
              /> 
              <Fab
                color="secondary"
                aria-label="edit"
                size="large"
                sx={{ position: 'absolute', bottom: 10, right: 0 }}
                onClick={handleMenuOpen}
              >                
                <EditIcon />
                <input type="file" hidden id="pfp" onChange={handleChange} accept="image/*" />
              </Fab>  

            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleMenuClose}  >

                <MenuItem id="edit" onClick={() => {
                document.getElementById('pfp').click();
                handleMenuClose();   }}>
                Add new profile picture
                </MenuItem>
                {form.pfp && <MenuItem id="delete" onClick={() => {
                setImagePreview('')
                setForm({...form, pfp:''})
                handleMenuClose();  
                }}>
                Remove profile picture
                </MenuItem>}
            </Menu>
        </Box>
    )
}