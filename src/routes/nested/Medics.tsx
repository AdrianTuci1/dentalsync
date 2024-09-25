import React, { useState } from 'react';
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
  IconButton,
  Button,
  useMediaQuery,
  TextField,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddMedicDrawer from '../../components/drawers/AddMedicDrawer';
import { blue, green, orange } from '@mui/material/colors';

interface Medic {
  name: string;
  specialty: string;
  contact: string;
  email: string;
  workingDays: string[];
  type: 'FULL-TIME' | 'PART-TIME';
}

const medics: Medic[] = [
  {
    name: 'Ronald Richards',
    specialty: 'Dentist',
    contact: '209 555-0104',
    email: 'teukuwestnu@gmail.com',
    workingDays: ['M', 'T', 'W', 'T', 'F', 'S'],
    type: 'PART-TIME',
  },
  {
    name: 'Drg Jerald O’Hara',
    specialty: 'Orthodontics',
    contact: '302 555-0107',
    email: 'cipeng@avicena.com',
    workingDays: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
    type: 'FULL-TIME',
  },
  // More medics...
];

const Medics: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState<string>('');

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(event.target.value);
  };

  const isSmallScreen = useMediaQuery('(max-width:800px)'); // Responsive query for screen size

  const toggleDrawer = (open: boolean) => {
    setDrawerOpen(open);
  };

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
        <div className="padding-box" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: 'calc(100vh - 60px)' }}>
          <div className="box" style={{ display: 'flex', width: '100%', height: '100%', borderRadius: '10px', flexDirection: 'column' }}>

            {/* Header section */}
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
                {/* Search Box */}
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

            {/* Medics Table */}
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
                  {medics.map((medic, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <IconButton>
                            <MoreVertIcon />
                          </IconButton>
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
                            {medic.workingDays.map((day, idx) => (
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

      <AddMedicDrawer open={drawerOpen} onClose={() => toggleDrawer(false)} />
    </>
  );
};

export default Medics;
