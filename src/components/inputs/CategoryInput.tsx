import React, { useEffect, useState, useRef } from 'react';
import { Box, Paper, List, ListItem, IconButton, Typography } from '@mui/material';
import { Close } from '@mui/icons-material';
import CategoryService from '@/api/categoryService';

interface CategoryInputProps {
  value: string;
  onChange: (value: string) => void;
  clinicDbName: string;
}

const CategoryInput: React.FC<CategoryInputProps> = ({ value, onChange, clinicDbName }) => {
  const [filteredCategories, setFilteredCategories] = useState<string[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const categoryService = new CategoryService(clinicDbName);

  const fetchFilteredCategories = async (search: string) => {
    setLoading(true);
    try {
      const categories = await categoryService.getFilteredCategories(search);
      setFilteredCategories(categories);
    } catch (error) {
      console.error('Failed to fetch filtered categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    onChange(inputValue);

    if (inputValue) {
      fetchFilteredCategories(inputValue); // Fetch categories based on the input
      setIsDropdownOpen(true);
    } else {
      setFilteredCategories([]);
      setIsDropdownOpen(false);
    }
  };

  const handleCategorySelect = (category: string) => {
    onChange(category);
    setIsDropdownOpen(false);
  };

  const handleInputFocus = () => {
    if (value) {
      fetchFilteredCategories(value);
    }
    setIsDropdownOpen(true);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      inputRef.current &&
      dropdownRef.current &&
      !inputRef.current.contains(event.target as Node) &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsDropdownOpen(false);
    }
  };

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
    <Box position="relative" width="100%">
      <Box position="relative">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          placeholder="Search or select a category"
          style={{
            width: '100%',
            padding: '8px',
            border: '1px solid #ccc',
            borderRadius: '4px',
          }}
        />
        {value && (
          <IconButton
            onClick={() => onChange('')}
            style={{
              position: 'absolute',
              right: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
            }}
          >
            <Close />
          </IconButton>
        )}
      </Box>
      {isDropdownOpen && (
        <Paper
          ref={dropdownRef}
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            width: '100%',
            maxHeight: '200px',
            overflowY: 'auto',
            zIndex: 1500,
            borderRadius: '4px',
            backgroundColor: '#fff',
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.15)',
          }}
        >
          <List>
            {loading ? (
              <Typography align="center" padding="8px">
                Loading...
              </Typography>
            ) : filteredCategories.length > 0 ? (
              filteredCategories.map((cat) => (
                <ListItem
                  key={cat}
                  onClick={() => handleCategorySelect(cat)}
                  style={{ cursor: 'pointer' }}
                >
                  {cat}
                </ListItem>
              ))
            ) : (
              <Typography align="center" padding="8px">
                No categories found
              </Typography>
            )}
          </List>
        </Paper>
      )}
    </Box>
  );
};

export default CategoryInput;