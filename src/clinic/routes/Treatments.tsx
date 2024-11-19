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
  TextField,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useDispatch, useSelector } from 'react-redux';
import { openDrawer } from '../../shared/services/drawerSlice';
import TreatmentService from '../../shared/services/treatmentService';
import { Treatment } from '../types/treatmentType';
import generateInitials from '../../shared/utils/generateInitials';

export const Treatments: React.FC = () => {
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const isSmallScreen = useMediaQuery('(max-width:800px)');
  const token = useSelector((state: any) => state.auth.subaccountToken);
  const dispatch = useDispatch();

  const treatmentService = new TreatmentService(token, 'demo_db');

  // Fetch treatments from server
  useEffect(() => {
    const fetchTreatments = async () => {
      try {
        const fetchedTreatments = await treatmentService.getAllTreatments();
        setTreatments(fetchedTreatments);
      } catch (error) {
        console.error('Error fetching treatments:', error);
      }
    };

    fetchTreatments();
  }, [treatmentService]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleAddNew = () => {
    dispatch(openDrawer({ type: 'Treatment', data: { treatmentId: null } }));
  };

  const handleEdit = (treatmentId: string) => {
    dispatch(openDrawer({ type: 'Treatment', data: { treatmentId } }));
  };

  const handleDelete = async (treatmentId: string) => {
    try {
      await treatmentService.deleteTreatment(treatmentId);
      setTreatments((prev) => prev.filter((t) => t.id !== treatmentId));
    } catch (error) {
      console.error('Error deleting treatment:', error);
    }
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
            <Button startIcon={<AddIcon />} variant="outlined" onClick={handleAddNew}>
              Add New
            </Button>
          </Box>
        </Box>
        <Table aria-label="treatment table">
          {!isSmallScreen && (
            <TableHead>
              <TableRow>
                <TableCell>Treatment</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Estimate Duration</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
          )}
          <TableBody>
            {treatments
              .filter((treatment) =>
                treatment.name.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((treatment) => (
                <TableRow key={treatment.id}>
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
                      <TableCell>
                        <Button variant="text" onClick={() => handleEdit(treatment.id)}>
                          Edit
                        </Button>
                        <Button variant="text" color="error" onClick={() => handleDelete(treatment.id)}>
                          Delete
                        </Button>
                      </TableCell>
                    </>
                  )}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default Treatments;
