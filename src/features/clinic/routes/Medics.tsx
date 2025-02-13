import React, { useState, useEffect, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Chip,
  Button,
  useMediaQuery,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { blue, green, orange } from '@mui/material/colors';
import { useDispatch, useSelector } from 'react-redux';
import { openDrawer } from '@/components/drawerSlice';
import SearchInput from '../../../components/inputs/SearchInput';
import { getSubdomain } from '@/shared/utils/getSubdomains';
import { fetchMedics, selectMedicLoading, selectMedics } from '@/api/medicSlice';

const Medics: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const isSmallScreen = useMediaQuery("(max-width:800px)");

  const token = useSelector((state: any) => state.auth.subaccountToken);
  const db = getSubdomain() + "_db";
  const dispatch = useDispatch();

  // Redux state selectors
  const medics = useSelector(selectMedics);
  const isLoading = useSelector(selectMedicLoading);


  // Fetch medics from API on mount
  useEffect(() => {
    if (token && db) {
      dispatch(fetchMedics({ token, clinicDb: db }) as any);
    }
  }, [dispatch, token, db]);


  // ✅ Fix filtering logic
  const filteredMedics = useMemo(() => {
    if (!searchTerm.trim()) return medics;

    const lowercasedSearch = searchTerm.toLowerCase();
    return medics.filter(
      (medic: any) =>
        (medic.name?.toLowerCase() || "").includes(lowercasedSearch) ||
        (medic.specialty?.toLowerCase() || "").includes(lowercasedSearch) ||
        (medic.contact?.toLowerCase() || "").includes(lowercasedSearch)
    );
  }, [medics, searchTerm]);

  // **Dispatch openDrawer action for adding or editing a medic**
  const handleOpenDrawer = (medicId: string | null) => {
    dispatch(openDrawer({ type: "Medic", data: { medicId } }));
  };

  if(isLoading) {
    return <div>Loading data....</div>
  }

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
        <div
          className="padding-box"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: 'calc(100vh - 60px)',
          }}
        >
          <div
            className="box"
            style={{
              display: 'flex',
              width: '100%',
              height: '100%',
              borderRadius: '10px',
              flexDirection: 'column',
            }}
          >
            {/* Action Section */}
            <div
              className="action-component"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px',
                width: '100%',
                boxSizing: 'border-box',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <SearchInput
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
              </div>
              <Button startIcon={<AddIcon />} variant="outlined" color="primary" onClick={() => handleOpenDrawer(null)}>
                Add New
              </Button>
            </div>

            {/* Medics Table */}
            <TableContainer
              component={Paper}
              style={{ height: 'calc(100vh - 60px)', overflowY: 'scroll' }}
            >
              <Table stickyHeader aria-label="medics table">
                {!isSmallScreen && (
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Contact</TableCell>
                      <TableCell>Working Days</TableCell>
                      <TableCell>Type</TableCell>
                    </TableRow>
                  </TableHead>
                )}
                <TableBody>
                  {filteredMedics.map((medic: any, index: any) => (
                    <TableRow
                      key={index}
                      onClick={() => handleOpenDrawer(medic.id)}
                      style={{ cursor: 'pointer' }}
                    >
                      <TableCell>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar style={{ marginRight: 8 }}>{medic.name[0]}</Avatar>
                          <div>
                            <div>{medic.name}</div>
                            <div style={{ fontSize: 'small', color: 'gray' }}>{medic.specialty}</div>
                          </div>
                        </div>
                      </TableCell>
                      {!isSmallScreen && (
                        <>
                          <TableCell>
                            <div>{medic.contact}</div>
                            <div style={{ fontSize: 'small', color: 'blue' }}>{medic.email}</div>
                          </TableCell>
                          <TableCell>
                            {medic.workingDays
                              .filter((day: any) => day !== '')
                              .map((day: any, idx: any) => (
                                <Chip
                                  key={idx}
                                  label={day}
                                  style={{
                                    margin: 2,
                                    backgroundColor: day === 'S' ? blue[100] : blue[300],
                                  }}
                                />
                              ))}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={medic.employmentType}
                              style={{
                                backgroundColor:
                                  medic.type === 'FULL-TIME' ? green[100] : orange[100],
                              }}
                            />
                          </TableCell>
                        </>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>
      </div>
    </>
  );
};

export default Medics;
