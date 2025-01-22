import React, { useState, useRef, useEffect } from 'react';
import { Box, Paper, List, ListItem, IconButton, CircularProgress } from '@mui/material';
import { Remove } from '@mui/icons-material';
import ComponentService from '@/api/componentService';
import { useSelector } from 'react-redux';

interface ComponentInputProps {
  component: {
    id: string;
    componentName: string;
    unitPrice: number;
    componentUnits: number;
  };
  index: number;
  onComponentChange: (index: number, field: string, value: string | number) => void;
  onRemove: () => void;
  onInputFocus: (index: number) => void;
  onComponentSelect: (component: any, index: number) => void;
  currentIndex: number | null;
}

const ComponentInput: React.FC<ComponentInputProps> = ({
  component,
  index,
  onComponentChange,
  onRemove,
  onInputFocus,
  onComponentSelect,
  currentIndex,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<{ id: string; componentName: string; unitPrice: number }[]>([]);
  const [query, setQuery] = useState<string>('');
  const token = useSelector((state: any) => state.auth.subaccountToken); // Authentication token

  const inputRef = useRef<HTMLInputElement>(null);
  const componentService = new ComponentService(token, 'demo_db');

  const handleFocus = () => {
    onInputFocus(index);
    setIsDropdownOpen(true);
  };

  const handleSelect = (selectedComponent: { id: string; componentName: string; unitPrice: number }) => {
    onComponentSelect(selectedComponent, index);
    setIsDropdownOpen(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
      setIsDropdownOpen(false);
    }
  };

  const fetchComponents = async (searchQuery: string) => {
    setLoading(true);
    try {
      // Pass the query directly to the API, allowing it to handle empty or specific queries
      const { components } = await componentService.getAllComponents(searchQuery || '');
      const sanitizedComponents = components.map((comp: any) => ({
        id: comp.id,
        componentName: comp.componentName || '',
        unitPrice: comp.unitPrice ?? 0, // Ensure unitPrice is a number
      }));
  
      setSearchResults(sanitizedComponents);
    } catch (error) {
      console.error('Error fetching components:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };
  

  // Debounced fetch when query changes
  useEffect(() => {
    const debounceTimeout = setTimeout(() => fetchComponents(query), 300); // Debounced API call
    return () => clearTimeout(debounceTimeout);
  }, [query]);
  

  useEffect(() => {
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <Box position="relative" display="flex" alignItems="center" gap={1} marginTop={1}>
      <input
        ref={inputRef}
        type="text"
        placeholder="Select Component"
        value={component.componentName || ''}
        onChange={(e) => {
          setQuery(e.target.value);
          onComponentChange(index, 'componentName', e.target.value);
        }}
        onFocus={handleFocus}
        style={{ width: '100%', padding: '8px', marginRight: '8px' }}
      />
      <input
        type="number"
        placeholder="Unit Price"
        value={component.unitPrice ?? 0}
        disabled
        style={{ width: '60px', padding: '8px', marginRight: '8px' }}
      />
      <input
        type="number"
        placeholder="Units"
        value={component.componentUnits ?? 1}
        onChange={(e) => onComponentChange(index, 'componentUnits', parseInt(e.target.value, 10))}
        style={{ width: '60px', padding: '8px', marginRight: '8px' }}
      />
      <IconButton color="secondary" onClick={onRemove}>
        <Remove />
      </IconButton>
      {isDropdownOpen && currentIndex === index && (
        <Paper
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            width: '100%',
            maxHeight: '200px',
            overflowY: 'auto',
            zIndex: 1500,
          }}
        >
          {loading ? (
            <Box display="flex" justifyContent="center" p={2}>
              <CircularProgress size={20} />
            </Box>
          ) : (
            <List dense>
              {searchResults.map((comp) => (
                <ListItem
                  key={comp.id}
                  onMouseDown={() => handleSelect(comp)}
                  style={{ cursor: 'pointer' }}
                >
                  {comp.componentName}
                </ListItem>
              ))}
            </List>
          )}
        </Paper>
      )}
    </Box>
  );
};

export default ComponentInput;
