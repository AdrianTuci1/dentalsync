import React from 'react';
import { Button, IconButton, Typography, ToggleButton, ToggleButtonGroup } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';

interface ActionComponentProps {
    view: 'list' | 'card';
    setView: (view: 'list' | 'card') => void;
    toggleDrawer: (open: boolean) => void;
}

const ActionComponent: React.FC<ActionComponentProps> = ({ view, setView, toggleDrawer }) => {
    const handleViewChange = (
        event: React.MouseEvent<HTMLElement>,
        newView: 'list' | 'card' | null
    ) => {
        if (newView !== null) {
            setView(newView);
        }
    };

    return (
        <div
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
    );
};

export default ActionComponent;
