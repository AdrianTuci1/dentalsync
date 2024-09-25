import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  Box,
  useMediaQuery,
  TextField,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AddTreatmentDrawer from '../../components/addTreatment/AddTreatmentDrawer'; // Import the drawer component

interface Treatment {
  name: string;
  price: string;
  duration: string;
  typeOfVisit: string;
}

const treatments: Treatment[] = [
  { name: 'General Checkup', price: 'Start from $50', duration: '± 1 hour(s)', typeOfVisit: 'SINGLE VISIT' },
  { name: 'Teeth Whitening', price: 'Start from $300', duration: '± 1 hour(s) / treatments', typeOfVisit: 'MULTIPLE VISIT' },
  { name: 'Teeth Cleaning', price: 'Start from $75', duration: '± 1 hour(s)', typeOfVisit: 'SINGLE VISIT' },
  { name: 'Tooth Extraction', price: 'Start from $300', duration: '± 2 hour(s) / treatments', typeOfVisit: 'MULTIPLE VISIT' },
  { name: 'Tooth Fillings', price: 'Start from $210', duration: '± 1.5 hour(s)', typeOfVisit: 'SINGLE VISIT' },
  { name: 'Tooth Scaling', price: 'Start from $140', duration: '± 1.5 hour(s)', typeOfVisit: 'SINGLE VISIT' },
  { name: 'Tooth Braces (Metal)', price: 'Start from $3000', duration: '± 1.5 hour(s) / treatments', typeOfVisit: 'MULTIPLE VISIT' },
  { name: 'Veneers', price: 'Start from $925', duration: '± 1.5 hour(s)', typeOfVisit: 'SINGLE VISIT' },
  { name: 'Bonding', price: 'Start from $190', duration: '± 1.5 hour(s)', typeOfVisit: 'SINGLE VISIT' },
];

export const Treatments: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false); // Control drawer visibility

  const [searchTerm, setSearchTerm] = useState<string>('');

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(event.target.value);
  };
  
  const isSmallScreen = useMediaQuery('(max-width:800px)'); // Check screen size

  const toggleDrawer = () => {
    setIsDrawerOpen((prev) => !prev);
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Box display="flex" justifyContent="space-between" alignItems="center" padding="10px">
                          {/* Search Box */}
                <TextField
                    label="Search"
                    variant="outlined"
                    size="small"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    style={{ marginLeft: '20px' }}
                />
          <Box display="flex" gap="8px">
            <Button startIcon={<AddIcon />} variant="outlined" onClick={toggleDrawer}>
              Add New
            </Button>
          </Box>
        </Box>
        <Table aria-label="treatment table">
          {!isSmallScreen && (
            <TableHead>
              <TableRow>
                <TableCell>Treatment Name</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Estimate Duration</TableCell>
                <TableCell>Type of Visit</TableCell>
              </TableRow>
            </TableHead>
          )}
          <TableBody>
            {treatments.map((treatment) => (
              <TableRow key={treatment.name}>
                <TableCell>
                  {treatment.name}
                  {['General Checkup', 'Teeth Whitening'].includes(treatment.name) && (
                    <Chip label="SAMPLE" size="small" sx={{ marginLeft: 1 }} />
                  )}
                </TableCell>
                <TableCell>
                  {treatment.price}
                </TableCell>
                {!isSmallScreen && (
                  <>
                    <TableCell>{treatment.duration}</TableCell>
                    <TableCell>
                      <Chip label={treatment.typeOfVisit} color={treatment.typeOfVisit === 'SINGLE VISIT' ? 'primary' : 'secondary'} />
                    </TableCell>
                  </>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Drawer component to add treatment */}
      <AddTreatmentDrawer isOpen={isDrawerOpen} toggleDrawer={toggleDrawer} />
    </>
  );
};

export default Treatments;
