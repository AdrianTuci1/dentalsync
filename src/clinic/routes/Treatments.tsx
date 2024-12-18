import React, { useState, useEffect } from 'react';
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
import { openDrawer } from '../../shared/services/drawerSlice';
import TreatmentService from '../../shared/services/treatmentService';
import { Treatment } from '../types/treatmentType';
import generateInitials from '../../shared/utils/generateInitials';
import SearchInput from '../components/SearchInput';

export const Treatments: React.FC = () => {
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [offset, setOffset] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const isSmallScreen = useMediaQuery('(max-width:800px)');
  const token = useSelector((state: any) => state.auth.subaccountToken);
  const dispatch = useDispatch();
  const treatmentService = new TreatmentService(token, 'demo_db'); // Replace with actual token and db

  
  // Fetch treatments
  const fetchTreatments = async (reset = false) => {
    setIsLoading(true);
    try {
      const response = await treatmentService.getAllTreatments(searchTerm, reset ? 0 : offset);
      setTreatments((prev) => (reset ? response.treatments : [...prev, ...response.treatments]));
      setOffset(response.offset); // Update offset for "Load More"
    } catch (error) {
      console.error('Failed to fetch treatments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Refetch treatments when searchTerm changes
  useEffect(() => {
    fetchTreatments(true); // Reset on search term change
  }, [searchTerm]);

  // Handle search input changes
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setOffset(0); // Reset pagination
  };



  const handleAddNew = () => {
    dispatch(openDrawer({ type: 'Treatment', data: { treatmentId: null } }));
  };

  const handleRowClick = (treatmentId: string) => {
    dispatch(openDrawer({ type: 'Treatment', data: { treatmentId } }));
  };

  const handleLoadMore = () => {
    fetchTreatments();
  };

  return (
    <>
      <TableContainer component={Paper}>
        {/* Action Section */}
        <Box display="flex" justifyContent="space-between" alignItems="center" padding="10px">
          {/* Search Box */}
          <SearchInput
            value={searchTerm}
            onChange={handleSearchChange}
          />

          <Button startIcon={<AddIcon />} variant="outlined" onClick={handleAddNew}>
            Add New
          </Button>
        </Box>

        {/* Treatment Table */}
        <Table aria-label="treatment table">
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
            {treatments.map((treatment) => (
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
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : 'Load More'}
        </Button>
      </Box>
    </>
  );
};

export default Treatments;
