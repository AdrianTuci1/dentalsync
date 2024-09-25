import React, { useState } from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  TextField,
  Button,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

interface Stock {
  name: string;
  unitPrice: string;
  vendor: string;
  quantity: number;
}

interface AddStockDrawerProps {
  open: boolean;
  onClose: () => void;
  onSave: (newStock: Stock) => void;
}

const AddStockDrawer: React.FC<AddStockDrawerProps> = ({ open, onClose, onSave }) => {
  const [newStock, setNewStock] = useState<Stock>({
    name: '',
    unitPrice: '',
    vendor: '',
    quantity: 0,
  });

  const handleNewStockChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;
    setNewStock((prevStock) => ({
      ...prevStock,
      [name]: name === 'quantity' ? parseInt(value) || 0 : value,
    }));
  };

  const handleSave = () => {
    onSave(newStock);
    setNewStock({ name: '', unitPrice: '', vendor: '', quantity: 0 });
    onClose();
  };

  const handleClose = () => {
    setNewStock({ name: '', unitPrice: '', vendor: '', quantity: 0 });
    onClose();
  };

  return (
    <Drawer anchor="right" open={open} onClose={handleClose}>
      <Box sx={{ width: 350, padding: 2 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">Add New Stock</Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <TextField
          label="Name"
          name="name"
          value={newStock.name}
          onChange={handleNewStockChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Unit Price"
          name="unitPrice"
          value={newStock.unitPrice}
          onChange={handleNewStockChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Vendor"
          name="vendor"
          value={newStock.vendor}
          onChange={handleNewStockChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Quantity"
          name="quantity"
          type="number"
          value={newStock.quantity}
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
            disabled={!newStock.name || !newStock.unitPrice || !newStock.vendor}
          >
            Save
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default AddStockDrawer;
