import { TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

const SearchBar = ({ action, type }) => {
  const [searchValue, setSearchValue] = useState('');  // Initialize search value
  const [placeholder, setPlaceholder] = useState('Search....');
  const dispatch = useDispatch();


  const handleSearch = (value) => {
    switch (type) {
      case 'events': {
        setPlaceholder('Search for event names....');
        dispatch(action(value));
        break;
      }
      case 'artists': {
        setPlaceholder('Search for artist usernames, names, or tags.....');
        action(value);
        break;
      }
      case 'artistManagers': {
        setPlaceholder('Search for artist managers usernames or names.....');
        action(value);
        break;
      }
      default:
        break;
    }
  };

  useEffect(() => {
    handleSearch(searchValue);
  }, []);

  const handleInputChange = (e) => {
    const { value } = e.target;
    setSearchValue(value);  // Update search value
    handleSearch(value);  // Trigger the search
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <TextField
        variant="outlined"
        placeholder={placeholder}
        fullWidth
        sx={{ maxWidth: '80%', mt: 2 }}
        value={searchValue}
        onChange={handleInputChange}  // onChange handler
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
    </div>
  );
};

export default SearchBar;
