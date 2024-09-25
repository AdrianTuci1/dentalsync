import React, { useState } from 'react';
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
  TextField,
} from '@mui/material';
import AddStockDrawer from '../../components/drawers/AddStockDrawer'; // Adjust the import path as needed

interface Stock {
  name: string;
  unitPrice: string;
  vendor: string;
  quantity: number;
}

const initialStocks: Stock[] = [
  { name: 'Dental Floss', unitPrice: '$3.50', vendor: 'Dental Supplies Inc.', quantity: 120 },
  { name: 'Toothpaste', unitPrice: '$2.00', vendor: 'Colgate Vendor', quantity: 300 },
  { name: 'Mouthwash', unitPrice: '$4.00', vendor: 'OralCare Products', quantity: 100 },
  { name: 'Toothbrush', unitPrice: '$1.50', vendor: 'Clean Teeth Ltd.', quantity: 250 },
  { name: 'Dental Mirror', unitPrice: '$5.25', vendor: 'DentalTools Co.', quantity: 80 },
  { name: 'Gloves', unitPrice: '$0.15', vendor: 'SafeHands Vendor', quantity: 1000 },
  { name: 'Face Masks', unitPrice: '$0.50', vendor: 'Medical Supply Co.', quantity: 600 },
];

export const StocksTable: React.FC = () => {
  const [stocks, setStocks] = useState<Stock[]>(initialStocks);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredStocks = stocks.filter((stock) =>
    stock.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddStockClick = () => {
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const handleAddStock = (newStock: Stock) => {
    setStocks((prevStocks) => [...prevStocks, newStock]);
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
              <TableCell>Name</TableCell>
              <TableCell>Unit Price</TableCell>
              <TableCell>Vendor</TableCell>
              <TableCell>Quantity</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredStocks.map((stock, index) => (
              <TableRow key={index}>
                <TableCell>{stock.name}</TableCell>
                <TableCell>{stock.unitPrice}</TableCell>
                <TableCell>{stock.vendor}</TableCell>
                <TableCell>{stock.quantity}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* AddStockDrawer Component */}
      <AddStockDrawer
        open={drawerOpen}
        onClose={handleDrawerClose}
        onSave={handleAddStock}
      />
    </>
  );
};

export default StocksTable;
