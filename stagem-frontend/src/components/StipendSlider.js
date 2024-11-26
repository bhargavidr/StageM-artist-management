import React, {useEffect, useState} from 'react'
import { FormControlLabel, Slider, Checkbox, Typography } from '@mui/material';

const StipendSlider = ({form, setForm, prevStipend}) => {
    const [includeStipend, setIncludeStipend] = useState(false); 
    const [value, setValue] = React.useState([500, 15000]);

    useEffect(()=> {
        !includeStipend && setForm({...form, stipend: null})
    },[includeStipend])

    const handleChange = (e) => {
        setValue(e.target.value)
        setForm({...form, stipend: e.target.value})
    }

  return (
    <>
      <FormControlLabel
        control={
          <Checkbox
            checked={includeStipend}
            onChange={() => setIncludeStipend(!includeStipend)}
            color="secondary"
            sx={{my:2}}
            disabled={prevStipend}
          />
        }
        label="Includes Stipend"
      />
      {includeStipend && (<> 
        <Slider
          valueLabelDisplay="auto"
          value={value}
          disabled={prevStipend}
          name="stipend"
          min={500}
          max={45000}
          onChange={handleChange}
          sx={{ width: '360px' }}
          color="secondary"
          step={100}
        />
        <Typography variant="caption" gutterBottom sx={{ml:1}}> Rs. {value[0]} - {value[1]} </Typography>
        </>
      )}
    </>      
  )
}

export default StipendSlider