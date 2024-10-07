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
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import AddStockDrawer from '../../components/drawers/AddStockDrawer'; // Adjust the import path as needed
import ComponentService from '../../services/componentService'; // Adjust import path
import { useSelector } from 'react-redux';
import { Component } from '../../types/componentType'; // Import the Component type

export const StocksTable: React.FC = () => {
  const [stocks, setStocks] = useState<Component[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [editStock, setEditStock] = useState<Component | null>(null);

  const token = useSelector((state: any) => state.auth.subaccountToken);
  const clinicDb = 'demo_db'; // Hardcoded clinicDb

  const componentService = new ComponentService(token, clinicDb);

  useEffect(() => {
    // Fetch initial stocks data
    componentService
      .getAllComponents()
      .then((components) => setStocks(components))
      .catch((error) => console.error('Failed to fetch components:', error));
  }, [componentService]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredStocks = stocks.filter((stock) =>
    stock.componentName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddStockClick = () => {
    setEditStock(null); // Reset to null when adding a new stock
    setDrawerOpen(true);
  };

  const handleEditStockClick = (stock: Component) => {
    setEditStock(stock);
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const handleSaveStock = async (newStock: Component) => {
    if (editStock) {
      // Editing an existing stock
      try {
        const updatedStock = await componentService.updateComponent(editStock.id, newStock);
        setStocks((prevStocks) =>
          prevStocks.map((stock) =>
            stock.id === updatedStock.id ? updatedStock : stock
          )
        );
      } catch (error) {
        console.error('Failed to update component:', error);
      }
    } else {
      // Creating a new stock
      try {
        const createdStock = await componentService.createComponent(newStock);
        setStocks((prevStocks) => [...prevStocks, createdStock]);
      } catch (error) {
        console.error('Failed to create component:', error);
      }
    }
    setDrawerOpen(false);
  };

  const handleDeleteStock = async (id: string) => {
    try {
      await componentService.deleteComponent(id);
      setStocks((prevStocks) => prevStocks.filter((stock) => stock.id !== id));
    } catch (error) {
      console.error('Failed to delete component:', error);
    }
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
                  <IconButton onClick={() => handleDeleteStock(stock.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* AddStockDrawer Component */}
      <AddStockDrawer
        open={drawerOpen}
        onClose={handleDrawerClose}
        onSave={handleSaveStock}
        stock={editStock} // Pass the stock to be edited if applicable
      />
    </>
  );
};

export default StocksTable;
