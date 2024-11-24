// DentalHistoryTab.tsx
import React from 'react';
import { Box } from '@mui/material';
import TeethChart from '../../teeth/TeethChart';
import Accordion from '../../teeth/Accordion';

const DentalHistoryTab: React.FC = () => (
  <Box sx={{ p: 1 }}>
      <Accordion title="Permanent Teeth">
        <TeethChart teethType="permanent" />
      </Accordion>
      <Accordion title="Deciduous Teeth">
        <TeethChart teethType="deciduous" />
      </Accordion>
  </Box>
);

export default DentalHistoryTab;
