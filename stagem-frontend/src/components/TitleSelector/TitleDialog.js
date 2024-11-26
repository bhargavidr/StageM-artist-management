import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField, Button } from '@mui/material';
import './TitleDialog.css';

import { useSiteData } from '../../contextAPI/SiteContext';

const TitleDialog = ({ open, handleClose, dialogValue, setDialogValue }) => {
  const { dispatchSiteData } = useSiteData()

  const handleTitleSubmit = (e) => {
    e.preventDefault();
    dispatchSiteData({type: 'ADD_TITLE_FROM_DIALOG', payload: dialogValue})
    handleClose(true);
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      
        <DialogTitle>Add a new title</DialogTitle>

        <DialogContent>
          <DialogContentText>
            Add your own work profile / title!
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            value={dialogValue}
            onChange={(e) => setDialogValue(e.target.value)}
            label="Title"
            type="text"
            variant="standard"
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={()=> handleClose(false)}>Cancel</Button>
          <Button onClick={handleTitleSubmit}>Add</Button>
        </DialogActions>

    </Dialog>
  );
};

export default TitleDialog;
