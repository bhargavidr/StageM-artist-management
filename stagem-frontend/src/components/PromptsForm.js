import React, { useState,useEffect } from 'react';
import { Box, Button, Modal, TextField, Switch, FormControlLabel, Typography } from '@mui/material';
import { useSiteData } from '../contextAPI/SiteContext';

const PromptsForm = ({form, setForm, prevPrompts}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true)
  const [enableEdit, setEnableEdit] = useState(true)
  const errors = {}

  const {dispatchSiteData, siteData} = useSiteData()

  useEffect(()=> {
    if(prevPrompts && prevPrompts.length > 0){
      setEnableEdit(false)
      setIsEmpty(false)
    }    
  },[])

  const handleAddFields = () => {    
    if (form.prompts.length < 5) {
      setForm({...form, prompts:[...form.prompts, { prompt: '', isRequired: false }] });
    }
    isEmpty && setIsEmpty(false)
  };

  const handleChange = (index, field, value) => {
    const updatedForm = form.prompts.map((ele, i) => 
      i === index ? { ...ele, [field]: value } : ele
    );
    setForm({...form, prompts: updatedForm});
  };

  const resetForm = () => {
    setIsEmpty(true)
    setForm({...form, prompts: [] })
    dispatchSiteData({type: 'RESET_CLIENT_ERRORS'})
  }  


  const viewPromptsInfo = () => {
    return (<ul> <Typography variant="body2" sx={{ color: 'gray', mb: 2 }}>
          <li>Use the form to enter your prompts/questions and specify whether they are compulsory.</li>
          <li>Add up to 5 prompts by clicking the "+ Add" button.</li>
          <li>The "Clear" button will reset the form, removing all existing prompts.</li>
          <li>Click "Submit" to save the prompts and see a preview.</li>
          
        </Typography></ul>)
  }

  const handleSubmit = () => {
    if(form.prompts.length > 0){
        errors.prompts = {}
        form.prompts.forEach((ele,i )=> {
            if(!ele.prompt){
                errors.prompts[i] = 'Cannot add empty prompts'
            }
        });
        
        if (Object.keys(errors.prompts).length === 0) {
            delete errors.prompts;
        } else {
            dispatchSiteData({type: 'SET_CLIENT_ERRORS', payload: errors})
        }
    }
    console.log(errors, 'errors')
    if(Object.keys(errors).length === 0){
        dispatchSiteData({type: 'RESET_CLIENT_ERRORS'})
        setIsModalOpen(false);
    } 
  };

  return (
    <div>
      

      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        fullwidth={30}
      >
        <Box sx={{ ...style, width: 600 }}>
          <h2 id="prompts-form-modal">Prompts Form</h2>

          {isEmpty ? viewPromptsInfo() : form.prompts.map((item, index) => (
            <Box key={index} sx={{ marginBottom: 2 }}>
              <TextField
                label="Prompt"
                value={item.prompt}
                onChange={(e) => handleChange(index, 'prompt', e.target.value)}
                fullWidth
                variant="standard"
                error={siteData.clientErrors?.prompts && siteData.clientErrors.prompts[index] }
              helperText={siteData.clientErrors?.prompts && siteData.clientErrors.prompts[index] }
              />
              <FormControlLabel
                control={
                    <Switch   checked={form.prompts[index].isRequired}
                        onChange={(e) => handleChange(index, 'isRequired', e.target.checked)}
                        color="secondary"
                        size='small'
                        sx={{ml:1}}
                    />
                }
                label="Required"
                />
            </Box>
          ))}

          <Button
            variant="outlined"
            onClick={handleAddFields}
            disabled={form.prompts.length >= 5}
            sx={{ marginRight: 2 }}
          >
            + Add 
          </Button>
          <Button
            variant="outlined"
            onClick={resetForm}
            sx={{ marginRight: 2 }}
          >
            Clear 
          </Button>
          <Button variant="contained" color="primary" onClick={handleSubmit} disabled={form.prompts.length < 1}>
            Submit
          </Button>
        </Box>
      </Modal>

      <Box sx={{ border: '1px solid gray', paddingX: 2, my:2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="overline" display="block" gutterBottom>
            Application Form Preview
            </Typography>
            {enableEdit && <Button variant="contained" onClick={() => setIsModalOpen(true)} size='small'>
            Open Form
            </Button>}
        </Box>
        {isEmpty ? viewPromptsInfo() : form.prompts.map((item, index) => (
          <Box key={index} sx={{ mb:1 }}>
            <TextField
              label={item.prompt}
              required={item.isRequired}
              size="small"
              fullWidth
              disabled
              variant='standard'
            />
          </Box>
        ))}
      </Box>
    </div>
  );
};

const style = {
  position: 'absolute',
  maxWidth:'80%',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

export default PromptsForm;
