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
  Checkbox,
  Chip,
  IconButton,
  Typography,
  Button,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FilterListIcon from '@mui/icons-material/FilterList';
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import AddMedicDrawer from '../../components/AddMedicDrawer'; // Assuming you create a drawer for adding medics
import { blue, green, orange } from '@mui/material/colors';

interface Medic {
  name: string;
  specialty: string;
  contact: string;
  email: string;
  workingDays: string[];
  assignedTreatment: string;
  type: 'FULL-TIME' | 'PART-TIME';
}

const medics: Medic[] = [
  {
    name: 'Ronald Richards',
    specialty: 'Dentist',
    contact: '209 555-0104',
    email: 'teukuwestnu@gmail.com',
    workingDays: ['M', 'T', 'W', 'T', 'F', 'S'],
    assignedTreatment: 'Dental service',
    type: 'PART-TIME',
  },
  {
    name: 'Drg Jerald O’Hara',
    specialty: 'Orthodontics',
    contact: '302 555-0107',
    email: 'cipeng@avicena.com',
    workingDays: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
    assignedTreatment: 'Dental service, Oral Disease service +2',
    type: 'FULL-TIME',
  },
  {
    name: 'Putri Larasati',
    specialty: 'Pediatric Dentistry',
    contact: '629 555-0129',
    email: 'larasati@avicena.com',
    workingDays: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
    assignedTreatment: 'Dental service',
    type: 'FULL-TIME',
  },
  {
    name: 'Drg Soap Mactavish',
    specialty: 'Dentist',
    contact: '303 555-0105',
    email: 'soap@avicena.com',
    workingDays: ['M', 'T', 'W', 'T', 'F', 'S'],
    assignedTreatment: 'Oral Disease service',
    type: 'PART-TIME',
  },
  {
    name: 'Devon Lane',
    specialty: 'Endodontics',
    contact: '603 555-0123',
    email: 'devon@avicena.com',
    workingDays: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
    assignedTreatment: 'Dental service, Oral Disease service +2',
    type: 'FULL-TIME',
  },
  {
    name: 'Jacob Jones',
    specialty: 'Pediatric Dentistry',
    contact: '704 555-0127',
    email: 'jacobjones@avicena.com',
    workingDays: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
    assignedTreatment: 'Dental service, Oral Disease service +2',
    type: 'FULL-TIME',
  },
  {
    name: 'Marvin McKinney',
    specialty: 'Pediatric Dentistry',
    contact: '907 555-0101',
    email: 'marvinmckinney@avicena.com',
    workingDays: ['M', 'T', 'W', 'T', 'F', 'S'],
    assignedTreatment: 'Dental service',
    type: 'PART-TIME',
  },
  {
    name: 'Dianne Russell',
    specialty: 'Orthodontics',
    contact: '406 555-0120',
    email: 'teukuwestnu@gmail.com',
    workingDays: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
    assignedTreatment: 'Dental service, Oral Disease service +2',
    type: 'FULL-TIME',
  },
];

const Medics: React.FC = () => {
  const [view, setView] = useState<'list' | 'card'>('list');
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleViewChange = (
    event: React.MouseEvent<HTMLElement>,
    newView: 'list' | 'card' | null
  ) => {
    if (newView !== null) {
      setView(newView);
    }
  };

  const toggleDrawer = (open: boolean) => {
    setDrawerOpen(open);
  };

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
        <div className="padding-box" style={{display:'flex', alignItems:'center', justifyContent:'center', padding:'25px', width:'100%', height:'calc(100vh - 60px)'}}>
          <div className="box" style={{display:'flex', width:'100%', height:'100%', borderRadius:'10px', flexDirection:'column'}}>
            
            {/* Header section */}
            <div
              className="action-component"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBlockEnd: '20px',
                width: '100%',
                boxSizing: 'border-box',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="h6" component="div">
                  Total Medics: {medics.length}
                </Typography>

                <IconButton aria-label="filter" style={{ marginLeft: '15px' }}>
                  <FilterListIcon />
                </IconButton>

                <ToggleButtonGroup
                  value={view}
                  exclusive
                  onChange={handleViewChange}
                  aria-label="view toggle"
                  style={{ marginLeft: '15px' }}
                >
                  <ToggleButton value="list" aria-label="list view">
                    <ViewListIcon />
                  </ToggleButton>
                  <ToggleButton value="card" aria-label="card view">
                    <ViewModuleIcon />
                  </ToggleButton>
                </ToggleButtonGroup>
              </div>

              <Button variant="contained" color="primary" onClick={() => toggleDrawer(true)}>
                Add Medic
              </Button>
            </div>

            {/* Medics Table */}
            <TableContainer component={Paper} style={{height:'calc(100vh - 60px)', overflowY:'scroll'}}>
              <Table aria-label="medics table">
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox />
                    </TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Contact</TableCell>
                    <TableCell>Working Days</TableCell>
                    <TableCell>Assigned Treatment</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell padding="checkbox" />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {medics.map((medic, index) => (
                    <TableRow key={index}>
                      <TableCell padding="checkbox">
                        <Checkbox />
                      </TableCell>
                      <TableCell>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar style={{ marginRight: 8 }}>{medic.name[0]}</Avatar>
                          <div>
                            <div>{medic.name}</div>
                            <div style={{ fontSize: 'small', color: 'gray' }}>{medic.specialty}</div>
                          </div>
                        </div>
                      </TableCell>
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
                      <TableCell>{medic.assignedTreatment}</TableCell>
                      <TableCell>
                        <Chip
                          label={medic.type}
                          style={{
                            backgroundColor:
                              medic.type === 'FULL-TIME' ? green[100] : orange[100],
                          }}
                        />
                      </TableCell>
                      <TableCell padding="checkbox">
                        <IconButton>
                          <MoreVertIcon />
                        </IconButton>
                      </TableCell>
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
