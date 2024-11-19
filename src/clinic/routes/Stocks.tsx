import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Button,
  IconButton,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { openDrawer } from '../../shared/services/drawerSlice';
import ComponentService from '../../shared/services/componentService';
import { Component } from '../types/componentType';

export const StocksTable: React.FC = () => {
  const [stocks, setStocks] = useState<Component[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedStockId, setSelectedStockId] = useState<string | null>(null);

  const token = useSelector((state: any) => state.auth.subaccountToken);
  const clinicDb = 'demo_db'; // Hardcoded clinicDb
  const dispatch = useDispatch();
  const componentService = new ComponentService(token, clinicDb);

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const components = await componentService.getAllComponents();
        setStocks(components);
      } catch (error) {
        console.error('Failed to fetch components:', error);
      }
    };

    fetchStocks();
  }, [componentService]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredStocks = stocks.filter((stock) =>
    stock.componentName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddStockClick = () => {
    dispatch(openDrawer({ type: 'Stock', data: { stock: null } }));
  };

  const handleEditStockClick = (stock: Component) => {
    dispatch(openDrawer({ type: 'Stock', data: { stock } }));
  };

  const handleDeleteStock = async () => {
    if (!selectedStockId) return;

    try {
      await componentService.deleteComponent(selectedStockId);
      setStocks((prevStocks) => prevStocks.filter((stock) => stock.id !== selectedStockId));
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error('Failed to delete component:', error);
    }
  };

  const confirmDeleteStock = (id: string) => {
    setSelectedStockId(id);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setSelectedStockId(null);
    setDeleteDialogOpen(false);
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Box display="flex" justifyContent="space-between" alignItems="center" padding="10px">
          {/* Search Box */}
          <TextField
            label="Search"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={handleSearchChange}
            style={{ marginLeft: '20px' }}
          />

          {/* Add Stock Button */}
          <Button variant="outlined" color="primary" onClick={handleAddStockClick}>
            Add New
          </Button>
        </Box>

        <Table aria-label="stocks table">
          <TableHead>
            <TableRow>
              <TableCell>Component Name</TableCell>
              <TableCell>Unit Price</TableCell>
              <TableCell>Vendor</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredStocks.map((stock) => (
              <TableRow key={stock.id}>
                <TableCell>{stock.componentName}</TableCell>
                <TableCell>{stock.unitPrice}</TableCell>
                <TableCell>{stock.vendor}</TableCell>
                <TableCell>{stock.quantity}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEditStockClick(stock)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => confirmDeleteStock(stock.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={closeDeleteDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this stock? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleDeleteStock} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default StocksTable;
