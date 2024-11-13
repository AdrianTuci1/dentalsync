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
import { Patient } from '../../../types/patient';

interface DetailsTabProps {
  patientData: Patient;
  onInputChange: (field: string, isSelect?: boolean) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onSave: () => void;
}

const DetailsTab: React.FC<DetailsTabProps> = ({ patientData, onInputChange, onSave }) => {
  const [expanded, setExpanded] = React.useState<{ [key: string]: boolean }>({
    info: true,
    contact: true,
    others: true,
  });

  const handleAccordionChange = (panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded({ ...expanded, [panel]: isExpanded });
  };

  // Define inline style types
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
              value={patientData?.name || ''}
              onChange={onInputChange('name')}
              style={inputStyles}
            />
          </label>
          <label style={labelStyles}>
            Age
            <input
              type="number"
              value={patientData?.patientProfile?.age || ''}
              onChange={onInputChange('patientProfile.age')}
              style={inputStyles}
            />
          </label>
          <label style={labelStyles}>
            Gender
            <select
              value={patientData?.patientProfile?.gender || ''}
              onChange={onInputChange('patientProfile.gender')}
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
              value={patientData?.photo || ''}
              onChange={onInputChange('photo')}
              style={inputStyles}
            />
          </label>
        </AccordionDetails>
      </Accordion>

      {/* Contact Accordion */}
      <Accordion expanded={expanded.contact} onChange={handleAccordionChange('contact')}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Contact</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <label style={labelStyles}>
            Phone
            <input
              type="text"
              value={patientData?.patientProfile?.phone || ''}
              onChange={onInputChange('patientProfile.phone')}
              style={inputStyles}
            />
          </label>
          <label style={labelStyles}>
            Email
            <input
              type="email"
              value={patientData?.email || ''}
              onChange={onInputChange('email')}
              style={inputStyles}
            />
          </label>
          <label style={labelStyles}>
            Address
            <input
              type="text"
              value={patientData?.patientProfile?.address || ''}
              onChange={onInputChange('patientProfile.address')}
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
              value={patientData?.patientProfile?.labels?.join(', ') || ''}
              onChange={onInputChange('patientProfile.labels')}
              style={inputStyles}
              placeholder="Separate labels with commas"
            />
          </label>
          <label style={labelStyles}>
            Notes
            <textarea
              value={patientData?.patientProfile?.notes || ''}
              onChange={onInputChange('patientProfile.notes')}
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
