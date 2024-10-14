import React, { useState, useEffect } from 'react';
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
  TextField,
} from '@mui/material';
import { blue, green, orange } from '@mui/material/colors';
import MedicService from '../../services/medicService';
import { useSelector } from 'react-redux';
import MedicDrawer from '../../components/drawers/MedicDrawer';
import { MedicsListItem } from '../../types/Medic';


const Medics: React.FC = () => {
  const [medics, setMedics] = useState<MedicsListItem[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedMedicId, setSelectedMedicId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const isSmallScreen = useMediaQuery('(max-width:800px)');
  const token = useSelector((state: any) => state.auth.subaccountToken);

  useEffect(() => {
    const medicService = new MedicService(token, 'demo_db');
    const fetchMedics = async () => {
      try {
        const medicsData = await medicService.getMedicsWithWorkingDays();
        const formattedMedics = medicsData.map((medic: any) => ({
          id: medic.id,
          name: medic.name,
          specialty: medic.specialization,
          contact: medic.phone,
          email: medic.email,
          workingDays: medic.workingDays,
          type: medic.employmentType === 'full-time' ? 'FULL-TIME' : 'PART-TIME',
        }));
        setMedics(formattedMedics);
      } catch (error) {
        console.error('Failed to fetch medics:', error);
      }
    };

    fetchMedics();
  }, [token]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const toggleDrawer = (open: boolean, medicId: string | null = null) => {
    setDrawerOpen(open);
    setSelectedMedicId(medicId);
  };

  const filteredMedics = medics.filter(medic =>
    medic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    medic.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
    medic.contact.includes(searchTerm)
  );

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
        <div className="padding-box" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: 'calc(100vh - 60px)' }}>
          <div className="box" style={{ display: 'flex', width: '100%', height: '100%', borderRadius: '10px', flexDirection: 'column' }}>
            <div className="action-component" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px', width: '100%', boxSizing: 'border-box' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <TextField
                  label="Search"
                  variant="outlined"
                  size="small"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  style={{ marginLeft: '20px' }}
                />
              </div>
              <Button variant="outlined" color="primary" onClick={() => toggleDrawer(true)}>
                Add New
              </Button>
            </div>

            <TableContainer component={Paper} style={{ height: 'calc(100vh - 60px)', overflowY: 'scroll' }}>
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
                    <TableRow key={index} onClick={() => toggleDrawer(true, medic.id)} style={{ cursor: 'pointer' }}>
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
                              .filter(day => day !== '')
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
                                backgroundColor: medic.type === 'FULL-TIME' ? green[100] : orange[100],
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

      <MedicDrawer open={drawerOpen} onClose={() => toggleDrawer(false)} medicId={selectedMedicId} />
    </>
  );
};

export default Medics;
