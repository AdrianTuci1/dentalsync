import React, { useEffect, useState, useRef } from 'react';
import { Paper, List, ListItem, IconButton, Typography } from '@mui/material';
import { Close } from '@mui/icons-material';
import CategoryService from '@/api/services/categoryService';

import styles from "./CategoryInput.module.scss";

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
    <div className={styles.categoryContainer}>
      <div className={styles.inputWrapper}>
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          placeholder="Search or select a category"
          className={styles.input}
        />
        {value && (
          <IconButton onClick={() => onChange("")} className={styles.clearButton}>
            <Close />
          </IconButton>
        )}
      </div>

      {isDropdownOpen && (
        <Paper ref={dropdownRef} className={styles.dropdown}>
          <List>
            {loading ? (
              <Typography align="center" className={styles.loadingText}>
                Loading...
              </Typography>
            ) : filteredCategories.length > 0 ? (
              filteredCategories.map((cat) => (
                <ListItem key={cat} onClick={() => handleCategorySelect(cat)} className={styles.listItem}>
                  {cat}
                </ListItem>
              ))
            ) : (
              <Typography align="center" className={styles.loadingText}>
                No categories found
              </Typography>
            )}
          </List>
        </Paper>
      )}
    </div>
  );
};

export default CategoryInput;