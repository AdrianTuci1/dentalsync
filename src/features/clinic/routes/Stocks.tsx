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
import { openDrawer } from '@/components/drawerSlice';
import { Component } from '../types/componentType';
import { getSubdomain } from '@/shared/utils/getSubdomains';
import SearchInput from '../../../components/inputs/SearchInput';
import { fetchComponents, selectStockLoading, selectStocks} from '@/api/stockSlice';

export const StocksTable: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [offset, setOffset] = useState<number>(0);
  const isSmallScreen = useMediaQuery('(max-width:800px)');

  const token = useSelector((state: any) => state.auth.subaccountToken);
  const clinicDb = getSubdomain() + '_db';
  const dispatch = useDispatch();

  // Redux stocks state
  const stocks = useSelector(selectStocks);
  const isLoading = useSelector(selectStockLoading);

  /** ✅ Fetch components on mount & when search term changes */
  useEffect(() => {
    if (token && clinicDb) {
      dispatch(fetchComponents({ name: searchTerm, offset: 0, token, clinicDb }) as any);
    }
  }, [dispatch, searchTerm, token, clinicDb]);

  /** ✅ Handle search input change */
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setOffset(0); // Reset offset when searching
  };

  /** ✅ Handle row click (edit component) */
  const handleRowClick = (stock: Component) => {
    dispatch(openDrawer({ type: 'Stock', data: { stock } }));
  };

  /** ✅ Handle adding a new component */
  const handleAddStockClick = () => {
    dispatch(openDrawer({ type: 'Stock', data: { stock: null } }));
  };

  /** ✅ Handle Load More for pagination */
  const handleLoadMore = () => {
    if (!isLoading && token && clinicDb) {
      dispatch(fetchComponents({ name: searchTerm, offset: offset + 20, token, clinicDb }) as any);
      setOffset((prevOffset) => prevOffset + 20);
    }
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

        {isLoading && stocks.length === 0 ? (
          <p>Loading stocks...</p>
        ): stocks.length === 0 ? (
          <p>No stocks found</p>
        ): (
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
            {stocks.map((stock: Component) => (
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
        )}
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
