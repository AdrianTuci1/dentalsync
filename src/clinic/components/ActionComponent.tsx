import React, { useState } from 'react';
import { Button, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

interface ActionComponentProps {
    toggleDrawer: (open: boolean) => void;
}

const ActionComponent: React.FC<ActionComponentProps> = ({ toggleDrawer }) => {
    const [searchTerm, setSearchTerm] = useState<string>('');

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    return (
        <div
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

            <Button startIcon={<AddIcon />} variant="outlined" color="primary" onClick={() => toggleDrawer(true)}>
                Add New
            </Button>
        </div>
    );
};

export default ActionComponent;
