import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Grid,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';

interface Step1Props {
  handleNext: () => void;
  handleClose: () => void;
}

const Step1: React.FC<Step1Props> = ({ handleNext, handleClose }) => {
  const [category, setCategory] = useState('cosmetic');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('');
  const [component, setComponent] = useState('');
  const [quantity, setQuantity] = useState(0);

  return (
    <Box sx={{ padding: '20px', maxHeight: '100vh', overflowY: 'auto' }}>
      <Typography variant="h5" sx={{ marginBottom: 2 }}>
        Add Treatment
      </Typography>

      {/* Treatment Name */}
      <Typography variant="subtitle1">Basic Info</Typography>
      <TextField
        fullWidth
        label="Treatment Name"
        placeholder="Braces Treatment"
        variant="outlined"
        sx={{ marginBottom: 2, marginTop: 1 }}
      />

      {/* Treatment Category */}
      <Typography variant="subtitle2" sx={{ marginBottom: 1 }}>
        Treatment Category
      </Typography>
      <RadioGroup
        row
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        sx={{ marginBottom: 2 }}
      >
        <FormControlLabel value="medical" control={<Radio />} label="Medical Service" />
        <FormControlLabel value="cosmetic" control={<Radio />} label="Cosmetic Service" />
      </RadioGroup>

      {/* Treatment Description */}
      <TextField
        fullWidth
        multiline
        rows={3}
        label="Treatment Description"
        placeholder="Description"
        variant="outlined"
        inputProps={{ maxLength: 200 }}
        helperText="0 / 200"
        sx={{ marginBottom: 3 }}
      />

      {/* Set Multiple Visit */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px',
          backgroundColor: '#F7F9FC',
          borderRadius: 1,
          marginBottom: 3,
        }}
      >
        <Typography>Set Multiple Visit</Typography>
        <Button variant="text" onClick={handleNext}>Setup</Button>
      </Box>

      {/* Price & Duration */}
      <Typography variant="subtitle1">Price & Duration</Typography>
      <Grid container spacing={2} sx={{ marginBottom: 3 }}>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Price Treatment"
            placeholder="Enter price"
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
              endAdornment: <InputAdornment position="end">/jaw</InputAdornment>,
            }}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </Grid>
        <Grid item xs={6}>
          <FormControl fullWidth>
            <InputLabel id="duration-select-label">Estimate Duration</InputLabel>
            <Select
              labelId="duration-select-label"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              label="Estimate Duration"
            >
              <MenuItem value="30m">30 minutes</MenuItem>
              <MenuItem value="1h">1 hour</MenuItem>
              <MenuItem value="1.5h">1.5 hours</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Component Used */}
      <Typography variant="subtitle1" sx={{ marginBottom: 1 }}>
        Component Used
      </Typography>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px',
          backgroundColor: '#F7F9FC',
          borderRadius: 1,
          marginBottom: 3,
        }}
      >
        <FormControl fullWidth>
          <InputLabel id="component-select-label">Select Component</InputLabel>
          <Select
            labelId="component-select-label"
            value={component}
            onChange={(e) => setComponent(e.target.value)}
            label="Select Component"
            sx={{ marginRight: 2 }}
          >
            <MenuItem value="component1">Component 1</MenuItem>
            <MenuItem value="component2">Component 2</MenuItem>
          </Select>
        </FormControl>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button variant="outlined" onClick={() => setQuantity(Math.max(0, quantity - 1))}>-</Button>
          <Typography sx={{ margin: '0 8px' }}>{quantity}</Typography>
          <Button variant="outlined" onClick={() => setQuantity(quantity + 1)}>+</Button>
        </Box>
      </Box>

      {/* Create Button */}
      <Button variant="contained" fullWidth onClick={handleClose}>
        Create
      </Button>
    </Box>
  );
};

export default Step1;
