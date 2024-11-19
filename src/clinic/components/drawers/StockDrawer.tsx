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
import { useDispatch, useSelector } from 'react-redux';
import { closeDrawer } from '../../../shared/services/drawerSlice';
import { Component } from '../../types/componentType';

const StockDrawer: React.FC = () => {
  const dispatch = useDispatch();

  // Access drawerData from Redux
  const { drawerData } = useSelector((state: any) => state.drawer);
  const stock = drawerData?.stock || null; // Get stock from drawerData

  const [newStock, setNewStock] = useState<Partial<Component>>({
    componentName: '',
    unitPrice: 0,
    vendor: '',
    quantity: 0,
  });

  // Initialize or reset newStock when the stock changes
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
    const savedStock: Component = {
      id: newStock.id || '', // Ensure the id exists or handle it elsewhere
      componentName: newStock.componentName || '',
      unitPrice: newStock.unitPrice || 0,
      vendor: newStock.vendor || '',
      quantity: newStock.quantity || 0,
      createdAt: newStock.createdAt || new Date().toISOString(),
      updatedAt: newStock.updatedAt || new Date().toISOString(),
    };

    // Save logic can go here or trigger an action
    console.log('Saved Stock:', savedStock);

    // Close the drawer after saving
    dispatch(closeDrawer());
  };

  return (
    <Drawer anchor="right" open={true} onClose={() => dispatch(closeDrawer())}>
      <Box sx={{ width: 400, padding: 2 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">{stock ? 'Edit Stock' : 'Add New Stock'}</Typography>
          <IconButton onClick={() => dispatch(closeDrawer())}>
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
          <Button onClick={() => dispatch(closeDrawer())} style={{ marginRight: 8 }}>
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

export default StockDrawer;
