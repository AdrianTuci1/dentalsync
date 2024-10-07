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
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import TreatmentDrawer from '../../components/drawers/TreatmentDrawer'; // Import the drawer component
import TreatmentService from '../../services/treatmentService'; // Import the service to interact with API
import { Treatment } from '../../types/treatmentType'; // Use the defined Treatment type
import { useSelector } from 'react-redux';

export const Treatments: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false); // Control drawer visibility
  const [selectedTreatmentId, setSelectedTreatmentId] = useState<string | null>(null); // Selected treatment ID for view/edit
  const [treatments, setTreatments] = useState<Treatment[]>([]); // Fetched treatments from the server
  const [searchTerm, setSearchTerm] = useState<string>('');
  const isSmallScreen = useMediaQuery('(max-width:800px)'); // Check screen size

  const token = useSelector((state: any) => state.auth.subaccountToken);

  const treatmentService = new TreatmentService(token, 'demo_db'); // Initialize TreatmentService

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

  const toggleDrawer = () => {
    setIsDrawerOpen((prev) => !prev);
    setSelectedTreatmentId(null); // Reset selected treatment ID when drawer is toggled
  };

  const handleEdit = (treatmentId: string) => {
    setSelectedTreatmentId(treatmentId); // Set the selected treatment ID
    setIsDrawerOpen(true); // Open the drawer
  };

  const handleDelete = async (treatmentId: string) => {
    try {
      await treatmentService.deleteTreatment(treatmentId);
      setTreatments((prev) => prev.filter((t) => t.id !== treatmentId)); // Remove deleted treatment from the list
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
                <TableCell>Category</TableCell> {/* Category instead of Type of Visit */}
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
                  <TableCell>{treatment.name}</TableCell>
                  <TableCell>{treatment.price}</TableCell>
                  {!isSmallScreen && (
                    <>
                      <TableCell>{treatment.duration}</TableCell>
                      <TableCell>{treatment.category}</TableCell> {/* Changed to category */}
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

      {/* Drawer component for add/edit treatment */}
      <TreatmentDrawer
        isOpen={isDrawerOpen}
        toggleDrawer={toggleDrawer}
        treatmentId={selectedTreatmentId} // Pass selected treatment ID for editing
      />
    </>
  );
};

export default Treatments;
