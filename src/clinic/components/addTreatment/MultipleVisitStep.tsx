import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  TextField,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { ArrowUpward, ArrowDownward } from '@mui/icons-material';

interface Step2Props {
  handlePrev: () => void;
  handleClose: () => void;
  handleNext: () => void;
}

const Step2: React.FC<Step2Props> = ({ handlePrev, handleClose, handleNext }) => {
  const [visits, setVisits] = useState([{ treatmentName: '', description: '', days: 1 }]);

  const handleAddVisit = () => {
    setVisits([...visits, { treatmentName: '', description: '', days: 1 }]);
  };

  const handleRemoveVisit = (index: number) => {
    setVisits(visits.filter((_, i) => i !== index));
  };

  const handleUpdateVisit = (index: number, key: string, value: any) => {
    const updatedVisits = visits.map((visit, i) =>
      i === index ? { ...visit, [key]: value } : visit
    );
    setVisits(updatedVisits);
  };

  return (
    <Box sx={{ padding: '20px', maxHeight: '100vh', overflowY: 'auto' }}>
      {/* Title */}
      <Typography variant="h5" sx={{ marginBottom: 2 }}>
        Visitation Settings
      </Typography>

      {/* Add New Visit Button */}
      <Button variant="contained" onClick={handleAddVisit} sx={{ marginBottom: 2 }}>
        + Add New Visit
      </Button>

      {/* List of Visits */}
      {visits.map((visit, index) => (
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
          <Box sx={{ position: 'absolute', top: '8px', left: '8px', display: 'flex' }}>
            {/* Arrow up/down buttons */}
            <IconButton
              size="small"
              onClick={() => {
                if (index > 0) {
                  const temp = visits[index];
                  const updatedVisits = [...visits];
                  updatedVisits[index] = updatedVisits[index - 1];
                  updatedVisits[index - 1] = temp;
                  setVisits(updatedVisits);
                }
              }}
              disabled={index === 0}
            >
              <ArrowUpward fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => {
                if (index < visits.length - 1) {
                  const temp = visits[index];
                  const updatedVisits = [...visits];
                  updatedVisits[index] = updatedVisits[index + 1];
                  updatedVisits[index + 1] = temp;
                  setVisits(updatedVisits);
                }
              }}
              disabled={index === visits.length - 1}
            >
              <ArrowDownward fontSize="small" />
            </IconButton>
          </Box>

          {/* Visit Title */}
          <Typography variant="subtitle1" sx={{ marginBottom: 2 }}>
            Visit #{index + 1}
          </Typography>

          {/* Treatment Name */}
          <FormControl fullWidth sx={{ marginBottom: 2 }}>
            <InputLabel id={`treatment-name-label-${index}`}>Treatment Name</InputLabel>
            <Select
              labelId={`treatment-name-label-${index}`}
              value={visit.treatmentName}
              onChange={(e) => handleUpdateVisit(index, 'treatmentName', e.target.value)}
              label="Treatment Name"
            >
              <MenuItem value="Oral Hygeine">Oral Hygeine</MenuItem>
              <MenuItem value="Oral Checkup">Oral Checkup</MenuItem>
            </Select>
          </FormControl>

          {/* Treatment Description */}
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Treatment Description"
            placeholder="Description"
            variant="outlined"
            value={visit.description}
            onChange={(e) => handleUpdateVisit(index, 'description', e.target.value)}
            inputProps={{ maxLength: 200 }}
            helperText={`${visit.description.length} / 200`}
            sx={{ marginBottom: 3 }}
          />

          {/* Component Used */}
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
            <Typography>Component Used</Typography>
            <Button variant="text" onClick={handleNext}>Setup</Button>
          </Box>

          {/* Days Between Visits */}
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Visit Interval"
                value={visit.days}
                onChange={(e) => handleUpdateVisit(index, 'days', Number(e.target.value))}
                InputProps={{
                  endAdornment: <InputAdornment position="end">Day(s)</InputAdornment>,
                }}
              />
            </Grid>
          </Grid>

          {/* Remove Visit Button */}
          {visits.length > 1 && (
            <Button
              variant="outlined"
              color="error"
              sx={{ marginTop: 2 }}
              onClick={() => handleRemoveVisit(index)}
            >
              Remove Visit
            </Button>
          )}
        </Box>
      ))}

      {/* Previous Button */}
      <Button variant="contained" fullWidth onClick={handlePrev} sx={{ marginTop: 3 }}>
        Previous
      </Button>
    </Box>
  );
};

export default Step2;
