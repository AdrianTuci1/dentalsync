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
  useMediaQuery,
  TableHead,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useDispatch, useSelector } from 'react-redux';
import { openDrawer } from '../../shared/services/drawerSlice';
import ComponentService from '../../shared/services/componentService';
import { Component } from '../types/componentType';
import { getSubdomain } from '../../shared/utils/getSubdomains';
import SearchInput from '../components/SearchInput';

export const StocksTable: React.FC = () => {
  const [stocks, setStocks] = useState<Component[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [offset, setOffset] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const isSmallScreen = useMediaQuery('(max-width:800px)');

  const token = useSelector((state: any) => state.auth.subaccountToken);
  const clinicDb = getSubdomain() // Hardcoded clinicDb
  const dispatch = useDispatch();
  const componentService = new ComponentService(token, `${clinicDb}_db` );

  // Fetch Components
  const fetchComponents = async (reset = false) => {
    setIsLoading(true);
    try {
      const response = await componentService.getAllComponents(searchTerm, reset ? 0 : offset);
      setStocks((prev) => (reset ? response.components : [...prev, ...response.components]));
      setOffset(response.offset);
    } catch (error) {
      console.error('Failed to fetch components:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch components on mount and when searchTerm changes
  useEffect(() => {
    fetchComponents(true); // Reset on initial load
  }, [searchTerm]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setOffset(0); // Reset offset when searching
  };

  const handleRowClick = (stock: Component) => {
    dispatch(openDrawer({ type: 'Stock', data: { stock } }));
  };

  const handleAddStockClick = () => {
    dispatch(openDrawer({ type: 'Stock', data: { stock: null } }));
  };

  const handleLoadMore = () => {
    fetchComponents();
  };

  return (
    <>
      <TableContainer component={Paper}>
        {/* Search & Add Section */}
        <Box display="flex" justifyContent="space-between" alignItems="center" padding="10px">
          <SearchInput
            value={searchTerm}
            onChange={handleSearchChange}
          />

          <Button startIcon={<AddIcon />} variant="outlined" color="primary" onClick={handleAddStockClick}>
            Add New
          </Button>
        </Box>

        {/* Table */}
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
            {stocks.map((stock) => (
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
            {stocks.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No components available.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Load More Button */}
      <Box display="flex" justifyContent="center" margin="20px 0">
        <Button
          variant="contained"
          color="primary"
          onClick={handleLoadMore}
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : 'Load More'}
        </Button>
      </Box>
    </>
  );
};

export default StocksTable;
