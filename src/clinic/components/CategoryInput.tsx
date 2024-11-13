import React, { useEffect, useState, useRef } from 'react';
import { Box, Paper, List, ListItem, IconButton, Typography } from '@mui/material';
import { Add, Remove, Close } from '@mui/icons-material';
import CategoryService from '../../shared/services/categoryService';

interface CategoryInputProps {
  value: string;
  onChange: (value: string) => void;
  clinicDbName: string;
}

interface Category {
  id: string;
  name: string;
}

const CategoryInput: React.FC<CategoryInputProps> = ({ value, onChange, clinicDbName }) => {
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [pendingCategory, setPendingCategory] = useState<string>(value);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const categoryService = new CategoryService(clinicDbName);

  useEffect(() => {
    setPendingCategory(value);
  }, [value]);

  const fetchCategories = async () => {
    try {
      const data = await categoryService.getCategories();
      setFilteredCategories(data.categories); // Assuming each category object has 'id' and 'name'
      setIsDropdownOpen(true);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const handleCategoryInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    setPendingCategory(inputValue);
    onChange(inputValue);
    setIsDropdownOpen(true);

    if (inputValue) {
      const filtered = filteredCategories.filter((cat) =>
        cat.name.toLowerCase().includes(inputValue.toLowerCase())
      );
      setFilteredCategories(filtered);
    } else {
      fetchCategories();
    }
  };

  const handleCategorySelect = (categoryName: string) => {
    onChange(categoryName);
    setPendingCategory(categoryName);
    setIsDropdownOpen(false);
  };

  const handleCategoryRemove = async (categoryId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await categoryService.deleteCategory(categoryId);
      setFilteredCategories((prevCategories) => prevCategories.filter((cat) => cat.id !== categoryId));
    } catch (error) {
      console.error('Error removing category:', error);
    }
  };

  const handleAddCategory = async () => {
    if (pendingCategory && !filteredCategories.some((cat) => cat.name === pendingCategory)) {
      try {
        const newCategory = await categoryService.createCategory(pendingCategory);
        setFilteredCategories((prevCategories) => [...prevCategories, newCategory]);
        setPendingCategory('');
        onChange(pendingCategory);
        setIsDropdownOpen(false);
      } catch (error) {
        console.error('Error adding category:', error);
      }
    }
  };

  const clearCategoryInput = () => {
    setPendingCategory('');
    onChange('');
    setIsDropdownOpen(false);
    fetchCategories();
  };

  const handleInputFocus = () => {
    fetchCategories();
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
          value={pendingCategory}
          onChange={handleCategoryInput}
          onFocus={handleInputFocus}
          placeholder="Select or add a category"
          style={{
            width: '100%',
            padding: '8px',
            border: '1px solid #ccc',
            borderRadius: '4px',
          }}
        />
        {pendingCategory && (
          <IconButton
            onClick={clearCategoryInput}
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
            {filteredCategories.map((cat) => (
              <ListItem
                key={cat.id}
                onClick={() => handleCategorySelect(cat.name)}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                }}
              >
                <Typography>{cat.name}</Typography>
                <IconButton
                  onClick={(e) => handleCategoryRemove(cat.id, e)}
                  style={{ color: 'red' }}
                >
                  <Remove />
                </IconButton>
              </ListItem>
            ))}
            {!filteredCategories.some((cat) => cat.name === pendingCategory) && pendingCategory && (
              <ListItem 
                onClick={handleAddCategory} 
                style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between' }}
              >
                <Typography color="primary">Add "{pendingCategory}"</Typography>
                <IconButton style={{ color: 'blue' }}>
                  <Add />
                </IconButton>
              </ListItem>
            )}
          </List>
        </Paper>
      )}
    </Box>
  );
};

export default CategoryInput;
