import React, { useEffect, useMemo, useState } from 'react';
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
  const treatments = useSelector(selectTreatments) || []; // ✅ Ensure it's always an array
  const isLoading = useSelector(selectTreatmentLoading);
  const isSmallScreen = useMediaQuery("(max-width:800px)");
  const token = useSelector((state: any) => state.auth.subaccountToken);
  const clinicDb = getSubdomain() + "_db";

  const [searchTerm, setSearchTerm] = useState("");

  // ✅ Fetch all treatments once when component mounts
  useEffect(() => {
    if (token && clinicDb) {
      dispatch(fetchTreatments({ token, clinicDb }) as any);
    }
  }, [dispatch, token, clinicDb]);

  // ✅ Local filtering (Runs only when `searchTerm` or `treatments` changes)
  const filteredTreatments = useMemo(() => {
    if (!searchTerm.trim()) return treatments;

    const lowercasedSearch = searchTerm.toLowerCase();
    return treatments.filter(
      (treatment: Treatment) =>
        treatment.name.toLowerCase().includes(lowercasedSearch) ||
        treatment.description?.toLowerCase().includes(lowercasedSearch)
    );
  }, [searchTerm, treatments]);

  // ✅ Handle search input changes
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // ✅ Handle adding a new treatment
  const handleAddNew = () => {
    dispatch(openDrawer({ type: "Treatment", data: { treatment: null } }));
  };

  // ✅ Handle row click (Ensure treatment exists)
  const handleRowClick = (treatmentId: string) => {
    const selectedTreatment = treatments.find((t: Treatment) => t.id === treatmentId);

    if (!selectedTreatment) {
      console.error(`Treatment with ID ${treatmentId} not found.`);
      return;
    }

    dispatch(openDrawer({ type: "Treatment", data: { treatment: selectedTreatment } }));
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
            {filteredTreatments.map((treatment: Treatment) => (
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