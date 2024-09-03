import * as React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox, Button, Chip, Rating, Box, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import FilterListIcon from '@mui/icons-material/FilterList';

interface Treatment {
  name: string;
  price: string;
  duration: string;
  typeOfVisit: string;
  rating: number | null;
  reviewCount: number;
}

const treatments: Treatment[] = [
  { name: 'General Checkup', price: 'Start from $50', duration: '± 1 hour(s)', typeOfVisit: 'SINGLE VISIT', rating: null, reviewCount: 0 },
  { name: 'Teeth Whitening', price: 'Start from $300', duration: '± 1 hour(s) / treatments', typeOfVisit: 'MULTIPLE VISIT', rating: null, reviewCount: 0 },
  { name: 'Teeth Cleaning', price: 'Start from $75', duration: '± 1 hour(s)', typeOfVisit: 'SINGLE VISIT', rating: 3.8, reviewCount: 48 },
  { name: 'Tooth Extraction', price: 'Start from $300', duration: '± 2 hour(s) / treatments', typeOfVisit: 'MULTIPLE VISIT', rating: 4.5, reviewCount: 110 },
  { name: 'Tooth Fillings', price: 'Start from $210', duration: '± 1.5 hour(s)', typeOfVisit: 'SINGLE VISIT', rating: 3.2, reviewCount: 75 },
  { name: 'Tooth Scaling', price: 'Start from $140', duration: '± 1.5 hour(s)', typeOfVisit: 'SINGLE VISIT', rating: 4.5, reviewCount: 186 },
  { name: 'Tooth Braces (Metal)', price: 'Start from $3000', duration: '± 1.5 hour(s) / treatments', typeOfVisit: 'MULTIPLE VISIT', rating: 4.5, reviewCount: 220 },
  { name: 'Veneers', price: 'Start from $925', duration: '± 1.5 hour(s)', typeOfVisit: 'SINGLE VISIT', rating: 4.0, reviewCount: 32 },
  { name: 'Bonding', price: 'Start from $190', duration: '± 1.5 hour(s)', typeOfVisit: 'SINGLE VISIT', rating: 4.0, reviewCount: 4 },
];

export const Treatments: React.FC = () => {
  return (
    <TableContainer component={Paper}>
      <Box display="flex" justifyContent="space-between" alignItems="center" padding="16px">
        <Typography variant="h6">{treatments.length} Treatments</Typography>
        <Box display="flex" gap="8px">
          <Button startIcon={<FilterListIcon />} variant="outlined">
            Filters
          </Button>
          <Button startIcon={<AddIcon />} variant="contained">
            Add Treatment
          </Button>
        </Box>
      </Box>
      <Table aria-label="treatment table">
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox">
              <Checkbox />
            </TableCell>
            <TableCell>Treatment Name</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Estimate Duration</TableCell>
            <TableCell>Type of Visit</TableCell>
            <TableCell>Rating</TableCell>
            <TableCell>Review</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {treatments.map((treatment) => (
            <TableRow key={treatment.name}>
              <TableCell padding="checkbox">
                <Checkbox />
              </TableCell>
              <TableCell>
                {treatment.name}
                {['General Checkup', 'Teeth Whitening'].includes(treatment.name) && (
                  <Chip label="SAMPLE" size="small" sx={{ marginLeft: 1 }} />
                )}
              </TableCell>
              <TableCell>{treatment.price}</TableCell>
              <TableCell>{treatment.duration}</TableCell>
              <TableCell>
                <Chip label={treatment.typeOfVisit} color={treatment.typeOfVisit === 'SINGLE VISIT' ? 'primary' : 'secondary'} />
              </TableCell>
              <TableCell>
                {treatment.rating !== null ? <Rating value={treatment.rating} readOnly precision={0.1} /> : 'No Rating'}
              </TableCell>
              <TableCell>{treatment.reviewCount} Review(s)</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Treatments