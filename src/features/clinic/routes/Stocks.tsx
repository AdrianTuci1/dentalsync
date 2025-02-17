import React, { useState } from 'react';
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
import { useDispatch } from 'react-redux';
import { openDrawer } from '@/components/drawerSlice';
import { Component } from '../types/componentType';
import SearchInput from '../../../components/inputs/SearchInput';
import useStocks from '@/api/hooks/useComponents';

export const StocksTable: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const isSmallScreen = useMediaQuery("(max-width:800px)");
  const dispatch = useDispatch();

  // Use the custom hook to retrieve stocks, loading status, error, and loadMore callback.
  const { stocks, loading, error, loadMore } = useStocks(searchTerm);

  /** Handle search input change */
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  /** Handle row click (edit component) */
  const handleRowClick = (stock: Component) => {
    dispatch(openDrawer({ type: "Stock", data: { stock } }));
  };

  /** Handle adding a new component */
  const handleAddStockClick = () => {
    dispatch(openDrawer({ type: "Stock", data: { stock: null } }));
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

        {loading && stocks.length === 0 ? (
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
          onClick={loadMore}
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Load More'}
        </Button>
      </Box>
    </>
  );
};

export default StocksTable;
