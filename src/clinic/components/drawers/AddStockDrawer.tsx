import React, { useState, useEffect } from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  TextField,
  Button,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { Component } from '../../types/componentType'; // Import the Component type

interface AddStockDrawerProps {
  open: boolean;
  onClose: () => void;
  onSave: (newStock: Component) => void;
  stock?: Component | null; // Optional, for editing existing stock
}

const AddStockDrawer: React.FC<AddStockDrawerProps> = ({
  open,
  onClose,
  onSave,
  stock,
}) => {
  const [newStock, setNewStock] = useState<Partial<Component>>({
    componentName: '',
    unitPrice: 0,
    vendor: '',
    quantity: 0,
  });

  useEffect(() => {
    if (stock) {
      setNewStock(stock);
    } else {
      setNewStock({
        componentName: '',
        unitPrice: 0,
        vendor: '',
        quantity: 0,
      });
    }
  }, [stock]);

  const handleNewStockChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setNewStock((prevStock) => ({
      ...prevStock,
      [name]: name === 'quantity' || name === 'unitPrice' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSave = () => {
    // Default values for undefined fields
    const savedStock: Component = {
      id: newStock.id || '', // Ensure the id exists or handle it appropriately elsewhere
      componentName: newStock.componentName || '',
      unitPrice: newStock.unitPrice || 0,
      vendor: newStock.vendor || '',
      quantity: newStock.quantity || 0,
      createdAt: newStock.createdAt || new Date().toISOString(), // Default current time if missing
      updatedAt: newStock.updatedAt || new Date().toISOString(),
    };

    onSave(savedStock);
    onClose();
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Drawer anchor="right" open={open} onClose={handleClose}>
      <Box sx={{ width: 350, padding: 2 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">{stock ? 'Edit Stock' : 'Add New Stock'}</Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <TextField
          label="Component Name"
          name="componentName"
          value={newStock.componentName || ''}
          onChange={handleNewStockChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Unit Price"
          name="unitPrice"
          value={newStock.unitPrice?.toString() || '0'}
          type="number"
          onChange={handleNewStockChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Vendor"
          name="vendor"
          value={newStock.vendor || ''}
          onChange={handleNewStockChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Quantity"
          name="quantity"
          type="number"
          value={newStock.quantity?.toString() || '0'}
          onChange={handleNewStockChange}
          fullWidth
          margin="normal"
        />
        <Box display="flex" justifyContent="flex-end" marginTop={2}>
          <Button onClick={handleClose} style={{ marginRight: 8 }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            disabled={!newStock.componentName || !newStock.vendor || newStock.quantity === 0 || newStock.unitPrice === 0}
          >
            Save
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default AddStockDrawer;
