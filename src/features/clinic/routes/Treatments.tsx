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
import { fetchTreatments, selectTreatments, selectTreatmentLoading} from '@/api/treatmentSlice';

import { getSubdomain } from '@/shared/utils/getSubdomains';

export const Treatments: React.FC = () => {
  const dispatch = useDispatch();
  const treatments = useSelector(selectTreatments); // Select treatments from Redux
  const isLoading = useSelector(selectTreatmentLoading); // Select loading state
  const isSmallScreen = useMediaQuery('(max-width:800px)'); // Responsive check
  const token = useSelector((state: any) => state.auth.subaccountToken);
  const clinicDb = getSubdomain() + '_db'; // Hardcoded clinicDb


  const [searchTerm, setSearchTerm] = useState(''); // Local state for search term


  // Fetch all treatments on mount or when searchTerm changes
  useEffect(() => {
    if (token && clinicDb) {
      dispatch(fetchTreatments({ token, clinicDb, name: searchTerm }) as any);
    }
  }, [dispatch, token, clinicDb, searchTerm]);

  // Handle search input changes
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // Handle adding a new treatment
  const handleAddNew = () => {
    dispatch(openDrawer({ type: 'Treatment', data: { treatment: null } })); // Open drawer for new treatment
  };

  const handleRowClick = (treatmentId: string) => {
    const selectedTreatment: Treatment | undefined = treatments.find((t: Treatment) => t.id === treatmentId);
  
    if (!selectedTreatment) {
      console.error(`Treatment with ID ${treatmentId} not found.`);
      return;
    }
  
    dispatch(openDrawer({ type: 'Treatment', data: { treatment: selectedTreatment } })); // ✅ Pass the full treatment object
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
    </>
  );
};

export default Treatments;