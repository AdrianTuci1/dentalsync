import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
  useMediaQuery,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useDispatch, useSelector } from 'react-redux';
import { openDrawer } from '@/components/drawerSlice';
import { Treatment } from '../types/treatmentType';
import generateInitials from '@/shared/utils/generateInitials';
import SearchInput from '../../../components/inputs/SearchInput';
import { fetchTreatments, selectTreatments, selectLoading} from '@/api/treatmentSlice';
import { AppDispatch } from '@/shared/services/store';

export const Treatments: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const treatments = useSelector(selectTreatments); // Select treatments from Redux
  const loading = useSelector(selectLoading); // Select loading state
  const isSmallScreen = useMediaQuery('(max-width:800px)'); // Responsive check

  const [searchTerm, setSearchTerm] = useState(''); // Local state for search term
  const [offset, setOffset] = useState(0); // Pagination offset

  // Fetch treatments on mount or when searchTerm changes
  useEffect(() => {
    dispatch(fetchTreatments({ searchTerm, offset: 0 }) as any); // Reset to fetch from the beginning
    setOffset(0); // Reset offset
  }, [dispatch, searchTerm]);

  // Handle search input changes
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value); // Update search term
  };

  // Handle adding a new treatment
  const handleAddNew = () => {
    dispatch(openDrawer({ type: 'Treatment', data: { treatmentId: null } })); // Open drawer for new treatment
  };

  // Handle editing a treatment
  const handleRowClick = (treatmentId: string) => {
    dispatch(openDrawer({ type: 'Treatment', data: { treatmentId } })); // Open drawer for editing
  };

  // Handle loading more treatments
  const handleLoadMore = () => {
    const newOffset = offset + 20; // Increment offset (assume 20 items per page)
    setOffset(newOffset);
    dispatch(fetchTreatments({ searchTerm, offset: newOffset }) as any); // Fetch more treatments
  };

  return (
    <>
      <TableContainer component={Paper}>
        {/* Action Section */}
        <Box display="flex" justifyContent="space-between" alignItems="center" padding="10px">
          {/* Search Input */}
          <SearchInput value={searchTerm} onChange={handleSearchChange} />
          {/* Add New Button */}
          <Button startIcon={<AddIcon />} variant="outlined" onClick={handleAddNew}>
            Add New
          </Button>
        </Box>

        {/* Treatments Table */}
        <Table aria-label="treatments table">
          {!isSmallScreen && (
            <TableHead>
              <TableRow>
                <TableCell>Treatment</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Estimate Duration</TableCell>
                <TableCell>Category</TableCell>
              </TableRow>
            </TableHead>
          )}
          <TableBody>
            {treatments.map((treatment: Treatment) => (
              <TableRow
                key={treatment.id}
                hover
                onClick={() => handleRowClick(treatment.id)}
                style={{ cursor: 'pointer' }}
              >
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <Box
                      width={30}
                      height={30}
                      bgcolor={treatment.color}
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      marginRight={2}
                      style={{ borderRadius: '4px' }}
                    >
                      <Typography variant="body2" color="white">
                        {generateInitials(treatment.name)}
                      </Typography>
                    </Box>
                    {treatment.name}
                  </Box>
                </TableCell>
                <TableCell>{treatment.price}</TableCell>
                {!isSmallScreen && (
                  <>
                    <TableCell>{treatment.duration}</TableCell>
                    <TableCell>{treatment.category}</TableCell>
                  </>
                )}
              </TableRow>
            ))}
            {treatments.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No treatments available.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Load More Button */}
      <Box display="flex" justifyContent="center" margin="20px 0">
        <Button
          variant="contained"
          color="primary"
          onClick={handleLoadMore}
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Load More'}
        </Button>
      </Box>
    </>
  );
};

export default Treatments;