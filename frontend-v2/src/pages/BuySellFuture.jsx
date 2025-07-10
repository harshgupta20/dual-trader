import { Box, Button, Card, CardContent, Typography } from '@mui/material';
import AccountsListDialog from '../components/AccountsListDialog';
import { useState } from 'react';
import SimpleAccountCardUI from '../components/SimpleProfileCard';
import TradingForm from '../components/BuySellFutureTwoAccounts';

const BuySellFuture = () => {
  const [showAccountsDialog, setShowAccountsDialog] = useState(false);
  const [selectedAccountButton, setSelectedAccountButton] = useState(null);

  const [selectedAccounts, setSelectedAccounts] = useState({
    account1: null,
    account2: null,
  });

  const handleAccountSelection = (account) => {
    console.log(`Selected account for Button ${selectedAccountButton}:`, account);
    if (account) {
      setSelectedAccounts((prev) => ({
        ...prev,
        [`account${selectedAccountButton}`]: account,
      }));
    }
    setShowAccountsDialog(false);
  };

  const handleOpenAccountsDialog = (buttonIndex) => {
    setSelectedAccountButton(buttonIndex);
    setShowAccountsDialog(true);
  };


  return (
    <Box className="flex flex-col items-center justify-center h-full gap-5">

      {(!selectedAccounts?.account1 || !selectedAccounts?.account2) && (
        <Box className="flex flex-col items-center justify-center h-full gap-5">
          {Object.keys(selectedAccounts)?.map((accountNo, idx) => (
            selectedAccounts[accountNo] ? (
              <SimpleAccountCardUI account={selectedAccounts[accountNo]} index={idx} />
            ) : (
              <Button
                key={idx}
                onClick={() => handleOpenAccountsDialog(idx + 1)}
                variant="contained"
              >
                Select Account {idx + 1}
              </Button>
            )
          ))}

        </Box>
      )}

      {(selectedAccounts?.account1 && selectedAccounts?.account2) && (
        <TradingForm account1={selectedAccounts.account1} account2={selectedAccounts.account2} />
      )}


      {
        showAccountsDialog &&
        <AccountsListDialog
          open={showAccountsDialog}
          close={() => setShowAccountsDialog(false)}
          onClick={handleAccountSelection}
        />
      }
    </Box>
  );
};

export default BuySellFuture;
