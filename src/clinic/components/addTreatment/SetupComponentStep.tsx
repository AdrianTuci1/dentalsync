import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  TextField,
  Grid,
  Select,
  MenuItem,
  IconButton,
  FormControl,
  InputLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  InputAdornment,
} from '@mui/material';
import { Add, Remove, DeleteOutline } from '@mui/icons-material';

interface Step3Props {
  handlePrev: () => void;
  handleClose: () => void;
}

const Step3: React.FC<Step3Props> = ({ handlePrev, handleClose }) => {
  const [components, setComponents] = useState([
    { name: 'Orthodontic Brackets - $15', quantity: 1, freeOption: 'totallyFree', freeUpTo: 1 },
  ]);

  const handleAddComponent = () => {
    setComponents([
      ...components,
      { name: '', quantity: 1, freeOption: 'totallyFree', freeUpTo: 1 },
    ]);
  };

  const handleRemoveComponent = (index: number) => {
    setComponents(components.filter((_, i) => i !== index));
  };

  const handleUpdateComponent = (index: number, key: string, value: any) => {
    const updatedComponents = components.map((component, i) =>
      i === index ? { ...component, [key]: value } : component
    );
    setComponents(updatedComponents);
  };

  return (
    <Box sx={{ padding: '20px', maxHeight: '100vh', overflowY: 'auto' }}>
      {/* Title */}
      <Typography variant="h5" sx={{ marginBottom: 2 }}>
        Setup Component
      </Typography>

      {/* List of Components */}
      {components.map((component, index) => (
        <Box
          key={index}
          sx={{
            marginBottom: 3,
            padding: '16px',
            borderRadius: '8px',
            border: '1px solid #e0e0e0',
            position: 'relative',
          }}
        >
          <Grid container spacing={2} alignItems="center">
            {/* Component Name */}
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel id={`component-select-label-${index}`}>Select Component</InputLabel>
                <Select
                  labelId={`component-select-label-${index}`}
                  value={component.name}
                  onChange={(e) =>
                    handleUpdateComponent(index, 'name', e.target.value)
                  }
                  label="Select Component"
                >
                  <MenuItem value="Orthodontic Brackets - $15">
                    Orthodontic Brackets - $15
                  </MenuItem>
                  <MenuItem value="Molar bands - $20">Molar bands - $20</MenuItem>
                  <MenuItem value="Arch wires - $10">Arch wires - $10</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Quantity Controls */}
            <Grid item xs={4}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <IconButton
                  onClick={() =>
                    handleUpdateComponent(index, 'quantity', Math.max(1, component.quantity - 1))
                  }
                >
                  <Remove />
                </IconButton>
                <Typography sx={{ margin: '0 8px' }}>{component.quantity}</Typography>
                <IconButton
                  onClick={() =>
                    handleUpdateComponent(index, 'quantity', component.quantity + 1)
                  }
                >
                  <Add />
                </IconButton>
              </Box>
            </Grid>

            {/* Delete Icon */}
            <Grid item xs={2}>
              <IconButton color="error" onClick={() => handleRemoveComponent(index)}>
                <DeleteOutline />
              </IconButton>
            </Grid>
          </Grid>

          {/* Free Options */}
          <Box sx={{ marginTop: 2 }}>
            <RadioGroup
              row
              value={component.freeOption}
              onChange={(e) =>
                handleUpdateComponent(index, 'freeOption', e.target.value)
              }
            >
              <FormControlLabel
                value="totallyFree"
                control={<Radio />}
                label="Totally Free"
              />
              <FormControlLabel
                value="freeUpTo"
                control={<Radio />}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    Free up to
                    <TextField
                      size="small"
                      sx={{ width: 50, marginLeft: 1 }}
                      value={component.freeUpTo}
                      onChange={(e) =>
                        handleUpdateComponent(index, 'freeUpTo', Number(e.target.value))
                      }
                      inputProps={{ min: 1, type: 'number' }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">pcs</InputAdornment>
                        ),
                      }}
                    />
                  </Box>
                }
              />
            </RadioGroup>
          </Box>
        </Box>
      ))}

      {/* Add Component Button */}
      <Button variant="outlined" fullWidth onClick={handleAddComponent} sx={{ marginBottom: 3 }}>
        + Add Component
      </Button>

      {/* Previous and Close Buttons */}
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Button variant="contained" fullWidth onClick={handlePrev}>
            Previous
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Button variant="contained" fullWidth color="success" onClick={handleClose}>
            Finish
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Step3;
