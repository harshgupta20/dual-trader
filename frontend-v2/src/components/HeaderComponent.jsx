import {
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  TextField,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useEffect, useState } from 'react';
import axiosInstance from '../utils/axios';

const HeaderComponent = () => {
  const [prices, setPrices] = useState({
    NIFTY: 23985.45,
    BANKNIFTY: 52123.6,
    FINNIFTY: 21345.2
  });
  const [previousPrices, setPreviousPrices] = useState(prices);

  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');

  const [allSymbols] = useState([
    'NIFTY',
    'BANKNIFTY',
    'FINNIFTY',
    'RELIANCE',
    'TCS',
    'HDFCBANK',
    'INFY',
    'ICICIBANK',
    'SBIN',
    'ITC'
  ]);

  // TODO: Get latest price
  // const handleGetLatestPrice = async (symbols) => {
  //   const response = await axiosInstance.post('/data/instruments-ltp', {})
  // }

  useEffect(() => {
    const interval = setInterval(() => {
      const newPrices = {
        NIFTY: +(23985 + (Math.random() - 0.5) * 30).toFixed(2),
        BANKNIFTY: +(52123 + (Math.random() - 0.5) * 50).toFixed(2),
        FINNIFTY: +(21345 + (Math.random() - 0.5) * 20).toFixed(2)
      };
      setPreviousPrices(prices);
      setPrices(newPrices);
    }, 3000);

    return () => clearInterval(interval);
  }, [prices]);

  const getColor = (symbol) => {
    if (prices[symbol] > previousPrices[symbol]) return 'text-green-400';
    if (prices[symbol] < previousPrices[symbol]) return 'text-red-900';
    return 'text-white';
  };

  const filteredResults = allSymbols.filter((sym) =>
    sym.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      <Box className="bg-blue-500 text-white w-full p-2 shadow-md">
        <Box className="flex items-center justify-between max-w-md mx-auto">
          <Box className="flex gap-6">
            {Object.keys(prices).map((symbol) => (
              <Box key={symbol} className="flex flex-col items-center">
                <Typography variant="caption" className="text-xs font-semibold">{symbol}</Typography>
                <Typography variant="body1" className={`font-bold ${getColor(symbol)}`}>
                  {prices[symbol]}
                </Typography>
              </Box>
            ))}
          </Box>

          <IconButton color="inherit" onClick={() => setSearchOpen(true)}>
            <SearchIcon className="text-white" />
          </IconButton>
        </Box>
      </Box>

      <Dialog open={searchOpen} onClose={() => setSearchOpen(false)} fullWidth >
        <DialogTitle>Search Stock</DialogTitle>
        <Box className="p-4 bg-gray-100 h-[80dvh] overflow-y-auto">
          <TextField
            autoFocus
            fullWidth
            variant="outlined"
            placeholder="Search stocks..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="mb-4"
          />

          {filteredResults.length === 0 ? (
            <Typography variant="body2" color="textSecondary">
              No stocks found
            </Typography>
          ) : (
            <List dense>
              {filteredResults.map((stock, index) => (
                <ListItem
                  button
                  key={index}
                  onClick={() => {
                    console.log('Selected:', stock);
                    setSearchOpen(false);
                  }}
                >
                  <ListItemText primary={stock} />
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      </Dialog>
    </>
  );
};

export default HeaderComponent;
