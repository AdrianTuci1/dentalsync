import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Box,
  Button,
  TextField,
  useMediaQuery,
  TableHead,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useDispatch, useSelector } from 'react-redux';
import { openDrawer } from '../../shared/services/drawerSlice';
import ComponentService from '../../shared/services/componentService';
import { Component } from '../types/componentType';

export const StocksTable: React.FC = () => {
  const [stocks, setStocks] = useState<Component[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const isSmallScreen = useMediaQuery('(max-width:800px)');

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

  const handleRowClick = (stock: Component) => {
    dispatch(openDrawer({ type: 'Stock', data: { stock } }));
  };

  const handleAddStockClick = () => {
    dispatch(openDrawer({ type: 'Stock', data: { stock: null } }));
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
          <Button startIcon={<AddIcon />} variant="outlined" color="primary" onClick={handleAddStockClick}>
            Add New
          </Button>
        </Box>

        <Table aria-label="stocks table">
          {!isSmallScreen && (
            <TableHead>
              <TableRow>
                <TableCell>Component Name</TableCell>
                <TableCell>Unit Price</TableCell>
                <TableCell>Vendor</TableCell>
                <TableCell>Quantity</TableCell>
              </TableRow>
            </TableHead>
          )}
          <TableBody>
            {filteredStocks.map((stock) => (
              <TableRow
                key={stock.id}
                hover
                onClick={() => handleRowClick(stock)}
                style={{ cursor: 'pointer' }}
              >
                <TableCell>
                  <Box display="flex" flexDirection="column">
                    <Box>{stock.componentName}</Box>
                    {isSmallScreen && <Box>Quantity: {stock.quantity}</Box>}
                  </Box>
                </TableCell>
                {!isSmallScreen && (
                  <>
                    <TableCell>{stock.unitPrice}</TableCell>
                    <TableCell>{stock.vendor}</TableCell>
                    <TableCell>{stock.quantity}</TableCell>
                  </>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default StocksTable;
