import React, { useState, useEffect } from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Button,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { closeDrawer } from '../drawerSlice';
import { Component } from '@/features/clinic/types/componentType';
import { selectTopDrawer } from '@/shared/utils/selectors';
import ComponentService from '@/api/componentService';
import { getSubdomain } from '@/shared/utils/getSubdomains';
import { addStock, updateStock } from '@/api/stockSlice';

const StockDrawer: React.FC = () => {
  const dispatch = useDispatch();

  const token = useSelector((state: any) => state.auth.subaccountToken); // Authentication token
  const db = getSubdomain() + '_db'
  const stockService = new ComponentService(token, db)

  const { drawerData } = useSelector(selectTopDrawer);
  const stock = drawerData?.stock || null;

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

  const isModified = () => {
    if (!stock) return true; // Always proceed for new stocks
    return (
      stock.componentName !== newStock.componentName ||
      stock.unitPrice !== newStock.unitPrice ||
      stock.vendor !== newStock.vendor ||
      stock.quantity !== newStock.quantity
    );
  };

  const handleSave = async () => {
    if (!isModified()) {
      console.log('No changes detected. Skipping save.');
      return;
    }

    const savedStock: Component = {
      id: newStock.id || '', // Ensure ID is present for updates
      componentName: newStock.componentName || '',
      unitPrice: newStock.unitPrice || 0,
      vendor: newStock.vendor || '',
      quantity: newStock.quantity || 0,
      createdAt: newStock.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      if (stock) {
        // Update existing stock
        await stockService.updateComponent(savedStock.id, savedStock);
        dispatch(updateStock(savedStock)); // Dispatch update action
        console.log('Stock updated successfully:', savedStock);
      } else {
        // Create new stock
        const createdStock = await stockService.createComponent(savedStock);
        dispatch(addStock(createdStock)); // Dispatch add action
        console.log('Stock created successfully:', createdStock);
      }
      dispatch(closeDrawer());
    } catch (error) {
      console.error('Error saving stock:', error);
      alert('Failed to save stock. Please try again.');
    }
  };

  const handleClose = () => {
    if (stock && isModified()) {
      handleSave();
    }
    dispatch(closeDrawer());
  };

  return (
    <Drawer anchor="right" open={true} onClose={handleClose}>
      <div
                style={{
                  width: window.innerWidth <= 500 ? "100vw" : "400px", // Full screen on small devices
                  maxWidth: "100vw", // Prevent overflow
                  margin: "0 auto", // Center on larger screens
                  padding:'10px'
                }}
          >
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">{stock ? 'Edit Stock' : 'Add New Stock'}</Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 2, }}>
          <label>
            <Typography variant="body2">Component Name</Typography>
            <input
              name="componentName"
              value={newStock.componentName || ''}
              onChange={handleNewStockChange}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </label>
          <label>
            <Typography variant="body2">Unit Price</Typography>
            <input
              name="unitPrice"
              type="number"
              value={newStock.unitPrice?.toString() || '0'}
              onChange={handleNewStockChange}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </label>
          <label>
            <Typography variant="body2">Vendor</Typography>
            <input
              name="vendor"
              value={newStock.vendor || ''}
              onChange={handleNewStockChange}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </label>
          <label>
            <Typography variant="body2">Quantity</Typography>
            <input
              name="quantity"
              type="number"
              value={newStock.quantity?.toString() || '0'}
              onChange={handleNewStockChange}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </label>
        </Box>
        {!stock && (
          <Box display="flex" justifyContent="flex-end" marginTop={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              disabled={
                !newStock.componentName ||
                !newStock.vendor ||
                newStock.quantity === 0 ||
                newStock.unitPrice === 0
              }
            >
              Save
            </Button>
          </Box>
        )}
      </div>
    </Drawer>
  );
};

export default StockDrawer;
