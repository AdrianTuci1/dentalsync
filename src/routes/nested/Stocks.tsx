import React from 'react';
import { Box, Typography, Button, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Checkbox, LinearProgress, IconButton } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import MoreVertIcon from '@mui/icons-material/MoreVert';

interface StockItem {
  id: string;
  items: string;
  price: string;
  date: string;
  vendor: string;
  status: string;
  itemsReceived: string;
  canSendEmail: boolean;
  receiveDisabled: boolean;
}

const stocksData: StockItem[] = [
  { id: '#OS12KOS', items: '5 items', price: '$1.500', date: 'July 14, 2015', vendor: 'Barone LLC.', status: 'PENDING', itemsReceived: '0/3', canSendEmail: true, receiveDisabled: false },
  { id: '#OS11KOS', items: '890 items', price: '$1.270', date: 'October 30, 2017', vendor: 'Acme Co.', status: 'PENDING', itemsReceived: '0/3', canSendEmail: true, receiveDisabled: false },
  { id: '#OS10KOS', items: '204 items', price: '$1.124', date: 'October 24, 2018', vendor: 'Abstergo Ltd.', status: 'COMPLETE', itemsReceived: '3/3', canSendEmail: true, receiveDisabled: true },
  { id: '#OS09KOS', items: '564 items', price: '$1.420', date: 'March 6, 2018', vendor: 'Binford Ltd.', status: 'PENDING', itemsReceived: '0/3', canSendEmail: true, receiveDisabled: false },
  { id: '#OS08KOS', items: '324 items', price: '$1.080', date: 'February 11, 2014', vendor: 'K24', status: 'PARTIALLY RECEIVED', itemsReceived: '2/4', canSendEmail: true, receiveDisabled: false },
  { id: '#OS12KOS', items: '80 items', price: '$700', date: 'October 31, 2017', vendor: 'Dentalku', status: 'COMPLETE', itemsReceived: '3/3', canSendEmail: true, receiveDisabled: true },
  { id: '#OS12KOS', items: '2 items', price: '$5.000', date: 'March 13, 2014', vendor: 'K24', status: 'COMPLETE', itemsReceived: '3/3', canSendEmail: true, receiveDisabled: true },
  { id: '#OS12KOS', items: '1 items', price: '$2.000', date: 'December 2, 2018', vendor: 'Biffco Enterprises Ltd.', status: 'COMPLETE', itemsReceived: '3/3', canSendEmail: true, receiveDisabled: true },
];

const Stocks: React.FC = () => {
  return (
    <Box sx={{ height:'calc(100vh - 60px)', overflow:'scroll', width:'100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', paddingInline:'16px' }}>
        <Box>
          <Typography variant="h6">Total Asset Value</Typography>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>$10,200,323</Typography>
        </Box>
        <Box>
          <Typography variant="body2">32 products</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px', paddingInline:'16px' }}>
            <Typography variant="body2" sx={{ color: 'green' }}>In stock: 20</Typography>
            <Typography variant="body2" sx={{ color: 'orange' }}>Low stock: 4</Typography>
            <Typography variant="body2" sx={{ color: 'red' }}>Out of stock: 8</Typography>
          </Box>
        </Box>
      </Box>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingInline:'16px' }}>
        <Typography variant="h6">Order Stock</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Button variant="outlined" startIcon={<FilterListIcon />}>Filters</Button>
          <Button variant="contained" color="primary">+ Order Stock</Button>
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox />
              </TableCell>
              <TableCell>Order</TableCell>
              <TableCell>Created</TableCell>
              <TableCell>From Vendor</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Item Received</TableCell>
              <TableCell>Send Email</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stocksData.map((stock) => (
              <TableRow key={stock.id}>
                <TableCell padding="checkbox">
                  <Checkbox />
                </TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="subtitle2">{stock.id}</Typography>
                    <Typography variant="body2">{stock.items} • {stock.price}</Typography>
                  </Box>
                </TableCell>
                <TableCell>{stock.date}</TableCell>
                <TableCell>{stock.vendor}</TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{
                    color: stock.status === 'COMPLETE' ? 'green' : stock.status === 'PENDING' ? 'orange' : 'purple',
                    fontWeight: 'bold',
                  }}>
                    {stock.status}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <LinearProgress variant="determinate" value={parseInt(stock.itemsReceived.split('/')[0]) / parseInt(stock.itemsReceived.split('/')[1]) * 100} sx={{ width: '60%', height: '8px', borderRadius: '4px' }} />
                    <Typography variant="body2">{stock.itemsReceived}</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Button variant="contained" color="primary" disabled={stock.receiveDisabled}>
                    Receive
                  </Button>
                  {stock.canSendEmail && (
                    <IconButton>
                      <MoreVertIcon />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Stocks;
