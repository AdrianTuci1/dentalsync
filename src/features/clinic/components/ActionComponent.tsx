import React, { useState, useMemo } from 'react';
import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchInput from '../../../components/inputs/SearchInput';
import { debounce } from 'lodash';

interface ActionComponentProps {
    toggleDrawer: (open: boolean) => void;
    onSearch: (searchTerm: string) => void; // Callback for search
}

const ActionComponent: React.FC<ActionComponentProps> = ({ toggleDrawer, onSearch }) => {
    const [searchTerm, setSearchTerm] = useState<string>('');

    // Create a debounced version of onSearch
    const debouncedSearch = useMemo(
        () =>
            debounce((value: string) => {
                onSearch(value);
            }, 300),
        [onSearch]
    );

    // Handle changes in the search field
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSearchTerm(value); // Update local state
        debouncedSearch(value); // Trigger debounced search
    };

    // Cleanup debounce on unmount
    React.useEffect(() => {
        return () => {
            debouncedSearch.cancel();
        };
    }, [debouncedSearch]);

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