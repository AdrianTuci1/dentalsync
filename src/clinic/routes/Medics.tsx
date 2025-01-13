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
import MedicService from '../../shared/services/medicService';
import { useDispatch, useSelector } from 'react-redux';
import { openDrawer } from '../../shared/services/drawerSlice';
import { MedicsListItem } from '../types/Medic';
import SearchInput from '../components/SearchInput';
import { getSubdomain } from '../../shared/utils/getSubdomains';
import eventEmitter from '../../shared/utils/events';

const Medics: React.FC = () => {
  const [medics, setMedics] = useState<MedicsListItem[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const isSmallScreen = useMediaQuery('(max-width:800px)');
  const token = useSelector((state: any) => state.auth.subaccountToken);
  const dispatch = useDispatch();
  const db = getSubdomain() + '_db'


  // Fetch medics from API
  useEffect(() => {
    const fetchMedics = async () => {
      if (!token || !db) {
        console.error('Missing token or database');
        return;
      }

      const medicService = new MedicService(token, db);

      try {
        const medicsData = await medicService.getMedicsWithWorkingDays();
        const formattedMedics = medicsData.map((medic: any) => ({
          id: medic.id,
          name: medic.name,
          specialty: medic.specialization || 'Unknown',
          contact: medic.phone || 'No contact',
          email: medic.email || 'No email',
          workingDays: medic.workingDays || [],
          type: medic.employmentType === 'full-time' ? 'FULL-TIME' : 'PART-TIME',
        }));
        setMedics(formattedMedics);
      } catch (error) {
        console.error('Failed to fetch medics:', error);
      }
    };

    fetchMedics();
  }, [token, db]);

  useEffect(() => {
    const handleMedicUpdated = (updatedMedic: MedicsListItem) => {
  
      setMedics((prevMedics) => {
        const updatedMedics = prevMedics.map((medic) => {
          if (String(medic.id) === String(updatedMedic.id)) {
            return { ...updatedMedic }; // Replace with a new object
          }
          return medic;
        });
  
        return updatedMedics;
      });
    };
  
    const handleMedicCreated = (newMedic: MedicsListItem) => {
  
      setMedics((prevMedics) => {
        const newMedics = [...prevMedics, { ...newMedic }];
        return newMedics;
      });
    };
  
    eventEmitter.on('medicUpdated', handleMedicUpdated);
    eventEmitter.on('medicCreated', handleMedicCreated);
  
    return () => {
      eventEmitter.off('medicUpdated', handleMedicUpdated);
      eventEmitter.off('medicCreated', handleMedicCreated);
    };
  }, []);


    // Filtered medics based on search term
    const filteredMedics = useMemo(() => {
      if (!searchTerm.trim()) {
        return medics; // If searchTerm is empty, return all medics
      }
  
      const lowercasedSearch = searchTerm.toLowerCase();
      return medics.filter(
        (medic) =>
          medic.name.toLowerCase().includes(lowercasedSearch) ||
          medic.specialty.toLowerCase().includes(lowercasedSearch) ||
          medic.contact.toLowerCase().includes(lowercasedSearch)
      );
    }, [medics, searchTerm]);

  // Dispatch openDrawer action for adding or editing a medic
  const handleOpenDrawer = (medicId: string | null) => {
    dispatch(
      openDrawer({
        type: 'Medic',
        data: { medicId },
      })
    );
  };


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
                  {filteredMedics.map((medic, index) => (
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
                              .filter((day) => day !== '')
                              .map((day, idx) => (
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
                              label={medic.type}
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
