import React, { useState } from 'react';
import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchInput from './SearchInput';

interface ActionComponentProps {
    toggleDrawer: (open: boolean) => void;
    onSearch: (searchTerm: string) => void; // New callback for search
}

const ActionComponent: React.FC<ActionComponentProps> = ({ toggleDrawer, onSearch }) => {
    const [searchTerm, setSearchTerm] = useState<string>('');

    // Handle changes in the search field
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSearchTerm(value);
        onSearch(value); // Emit search term to parent
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
                <SearchInput
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
            </div>

            <Button
                startIcon={<AddIcon />}
                variant="outlined"
                color="primary"
                onClick={() => toggleDrawer(true)}
            >
                Add New
            </Button>
        </div>
    );
};

export default ActionComponent;
