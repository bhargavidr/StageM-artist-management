import React, {useState} from 'react';
import PropTypes from 'prop-types';

import { useAutocomplete } from '@mui/base/useAutocomplete';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { createFilterOptions } from '@mui/material/Autocomplete';
import { useTheme } from '@mui/material/styles';
import TitleDialog from './TitleDialog'; 

import './TitleSelector.css'; 
import { useSiteData } from '../../contextAPI/SiteContext';
import { useSelector } from 'react-redux';

const filter = createFilterOptions();

function Tag(props) {
  const { label, onDelete, ...other } = props;
  return (
    <div {...other}>
      <span>{label}</span>
      <CloseIcon onClick={onDelete} />
    </div>
  );
}

Tag.propTypes = {
  label: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired,
};


export default function TitleSelector({form, setForm}) {
  const theme = useTheme();
  const [open, toggleOpen] = useState(false);
  const [dialogValue, setDialogValue] = useState('');
  const { siteData } = useSiteData()
  const user = useSelector(state => state.user)

  const handleClose = (isAdded) => {
    setDialogValue('');
    toggleOpen(false);
    if(isAdded){
      setForm({...form, titles: [...form.titles, dialogValue]})
    }
  };

  const labelName = () => {
    if(user.account.role === 'artist'){
      return 'Work profile / Title (upto 6)'
    }
    return 'Artist Titles / Positions *'
  }

  

  const {
    getRootProps,
    getInputLabelProps,
    getInputProps,
    getTagProps,
    getListboxProps,
    getOptionProps,
    groupedOptions,
    focused,
    setAnchorEl,
  } = useAutocomplete({
    id: 'customized-hook-demo',
    multiple: true,
    options: siteData.titles,
    value: form.titles,
    getOptionLabel: (option) => option,
    onChange: (event, newValue) => {
      // console.log(newValue)
      const lastOption = newValue[newValue.length - 1];
      if (typeof lastOption === 'string' && !siteData.titles.includes(lastOption)) {
        toggleOpen(true);
        setDialogValue(lastOption);
      } else {      
        setForm({...form, titles: newValue})
      }
    },
    filterOptions: (options, params) => {
      const filtered = filter(options, params);
      if (params.inputValue !== '' && !siteData.titles.includes(params.inputValue)) {
        filtered.push(params.inputValue);
      }
      return filtered;
    },
  });

  return (
    <div className={`root ${theme.palette.mode === 'dark' ? 'root-dark' : ''}`}>
      <div {...getRootProps()}>
        <label {...getInputLabelProps()}> {labelName()} </label>
        <div
          ref={setAnchorEl}
          className={`input-wrapper ${focused ? 'focused' : ''} ${
            theme.palette.mode === 'dark' ? 'input-wrapper-dark' : ''
          }`}
        >
          {form.titles && form.titles.map((option, index) => {
            const { key, ...tagProps } = getTagProps({ index });
            return (
              <div key={key} className={`styled-tag ${theme.palette.mode === 'dark' ? 'styled-tag-dark' : ''}`} {...tagProps}>
                <span>{option}</span>
                <CloseIcon onClick={tagProps.onDelete} />
              </div>
            );
          })}
          <input {...getInputProps()} />
        </div>
      </div>
      {groupedOptions.length > 0 ? (
        <ul className={`listbox ${theme.palette.mode === 'dark' ? 'listbox-dark' : ''}`} {...getListboxProps()}>
          {groupedOptions.map((option, index) => {
            const { key, ...optionProps } = getOptionProps({ option, index });
            return (
              <li key={key} {...optionProps}>
                <span>{option}</span>
                <CheckIcon fontSize="small" />
              </li>
            );
          })}
        </ul>
      ) : null}
      {siteData.clientErrors?.titles && <span style={{color:"red"}}>{siteData.clientErrors.titles}</span>}

      <TitleDialog
        open={open}
        handleClose={handleClose}
        dialogValue={dialogValue}
        setDialogValue={setDialogValue}
      />
    </div>
  );
}
