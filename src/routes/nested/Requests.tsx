import React, { useState } from 'react';
import PatientTable from '../../components/PatientTable';
import { Button, IconButton, Typography, ToggleButton, ToggleButtonGroup } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import AddPatientDrawer from '../../components/AddPatientDrawer'; // Adjust the import path as needed

function Patients() {
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
                                    Total Patients: 72
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
                                Add Patient
                            </Button>
                        </div>
                        <PatientTable />
                    </div>
                </div>
            </div>

            <AddPatientDrawer open={drawerOpen} onClose={() => toggleDrawer(false)} />
        </>
    );
}

export default Patients;
