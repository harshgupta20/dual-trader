import { Button, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <Box className="min-h-screen bg-white flex flex-col items-center text-gray-900">
      
      {/* Hero Section */}
      <Box className="w-full px-6 py-10 text-center">
        <Typography variant="h4" className="font-bold mb-4 leading-tight">
          Trade Smart. Trade Fast.
        </Typography>
        <Typography variant="body1" className="text-gray-600 mb-6">
          A powerful platform built for modern traders. Analyze. Hedge. Execute — all from one screen.
        </Typography>
        <Button
          fullWidth
          variant="contained"
          size="large"
          className="bg-blue-600 text-white"
          onClick={() => navigate('/buy-sell-future')}
        >
          Start Trading
        </Button>
      </Box>

      {/* App Preview */}
      <Box className="w-full px-6 mt-8">
        <img
          src="/assets/landing-mockup.png" // Replace with real asset
          alt="Preview Mock Up Image"
        />
      </Box>

      {/* Features */}
      <Box className="px-6 py-10 w-full">
        <Typography variant="h6" className="mb-4 font-semibold text-center">
          Why Choose Us
        </Typography>
        <ul className="space-y-4 text-sm text-gray-700">
          <li>✅ Real-time LTP tracking & future price analytics</li>
          <li>✅ Instant Buy/Sell execution across multiple accounts</li>
          <li>✅ Powerful yet minimal UI for serious traders</li>
          <li>✅ Fully secure. Data never leaves your device.</li>
        </ul>
      </Box>

      {/* Trust Section */}
      <Box className="px-6 w-full text-center mb-8">
        <Typography variant="body2" className="text-gray-400 text-xs">
          Built with ❤️ by traders, for traders. 100% secure. No middlemen.
        </Typography>
      </Box>

      {/* Bottom CTA */}
      <Box className="px-6 pb-6 w-full">
        <Button
          fullWidth
          variant="outlined"
          size="large"
          onClick={() => navigate('/accounts')}
        >
          View My Accounts
        </Button>
      </Box>
    </Box>
  );
};

export default Home;
