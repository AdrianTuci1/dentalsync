import React from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  Button,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface DetailsTabProps {
  patientUser: any; // The patient data passed as a prop
  onInputChange: (field: string, value: any) => void; // Callback to handle input changes
  onSave: () => void; // Callback to save changes
}

const DetailsTab: React.FC<DetailsTabProps> = ({ patientUser, onInputChange, onSave }) => {
  const [expanded, setExpanded] = React.useState<{ [key: string]: boolean }>({
    info: true,
    others: false,
  });

  const handleAccordionChange = (panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded({ ...expanded, [panel]: isExpanded });
  };

  const inputStyles: React.CSSProperties = {
    width: '100%',
    padding: '8px',
    fontSize: '16px',
    marginTop: '4px',
    marginBottom: '16px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    boxSizing: 'border-box',
  };

  const labelStyles: React.CSSProperties = {
    fontWeight: 'bold',
    marginBottom: '4px',
    display: 'block',
  };

  return (
    <Box>
      {/* Info Accordion */}
      <Accordion expanded={expanded.info} onChange={handleAccordionChange('info')}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Info</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <label style={labelStyles}>
            Name
            <input
              type="text"
              value={patientUser?.name || ''}
              onChange={(e) => onInputChange('name', e.target.value)}
              style={inputStyles}
            />
          </label>
          <label style={labelStyles}>
            Age
            <input
              type="number"
              value={patientUser?.patientProfile?.age || ''}
              onChange={(e) => onInputChange('patientProfile.age', e.target.value)}
              style={inputStyles}
            />
          </label>
          <label style={labelStyles}>
            Gender
            <select
              value={patientUser?.patientProfile?.gender || ''}
              onChange={(e) => onInputChange('patientProfile.gender', e.target.value)}
              style={inputStyles}
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </label>
          <label style={labelStyles}>
            Avatar URL
            <input
              type="text"
              value={patientUser?.photo || ''}
              onChange={(e) => onInputChange('photo', e.target.value)}
              style={inputStyles}
            />
          </label>
          <label style={labelStyles}>
            Phone
            <input
              type="text"
              value={patientUser?.patientProfile?.phone || ''}
              onChange={(e) => onInputChange('patientProfile.phone', e.target.value)}
              style={inputStyles}
            />
          </label>
          <label style={labelStyles}>
            Email
            <input
              type="email"
              value={patientUser?.email || ''}
              onChange={(e) => onInputChange('email', e.target.value)}
              style={inputStyles}
            />
          </label>
          <label style={labelStyles}>
            Address
            <input
              type="text"
              value={patientUser?.patientProfile?.address || ''}
              onChange={(e) => onInputChange('patientProfile.address', e.target.value)}
              style={inputStyles}
            />
          </label>
        </AccordionDetails>
      </Accordion>

      {/* Others Accordion */}
      <Accordion expanded={expanded.others} onChange={handleAccordionChange('others')}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Others</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <label style={labelStyles}>
            Labels
            <input
              type="text"
              value={Array.isArray(patientUser?.patientProfile?.labels) ? 
                    patientUser.patientProfile.labels.join(', ') : ''}
              onChange={(e) =>
                onInputChange(
                  'patientProfile.labels',
                  e.target.value.split(',').map((label) => label.trim()) // Convert string back to array
                )
              }
              style={inputStyles}
              placeholder="Separate labels with commas"
            />
          </label>
          <label style={labelStyles}>
            Notes
            <textarea
              value={patientUser?.patientProfile?.notes || ''}
              onChange={(e) => onInputChange('patientProfile.notes', e.target.value)}
              rows={4}
              style={{ ...inputStyles, resize: 'vertical' }}
            />
          </label>
        </AccordionDetails>
      </Accordion>

      {/* Save Button */}
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="contained" color="primary" onClick={onSave}>
          Save
        </Button>
      </Box>
    </Box>
  );
};

export default DetailsTab;