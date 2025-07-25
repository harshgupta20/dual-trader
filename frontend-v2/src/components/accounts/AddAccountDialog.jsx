import { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  TextField,
  FormControl,
  InputLabel,
  Box,
  FormHelperText
} from '@mui/material';

const AddAccountDialog = ({ open, onClose, mode, propAccountKey, propApiSecret }) => {
  const ACCOUNT_TYPES = [
    { value: 'zerodha', label: 'Zerodha' },
    { value: 'grow', label: 'Grow' },
    { value: 'upstox', label: 'Upstox' }
  ];

  const [accountKey, setAccountKey] = useState(propAccountKey ?? '');
  const [apiSecret, setApiSecret] = useState(propApiSecret ?? '');
  const [accountType] = useState('zerodha'); // Fixed to Zerodha

  const [errors, setErrors] = useState({
    accountKey: false,
    apiSecret: false
  });

  const handleClose = () => {
    setAccountKey('');
    setApiSecret('');
    setErrors({ accountKey: false, apiSecret: false });
    onClose();
  };

  const handleSubmit = () => {
    const hasError = {
      accountKey: !accountKey.trim(),
      apiSecret: !apiSecret.trim()
    };

    setErrors(hasError);

    if (hasError.accountKey || hasError.apiSecret) {
      return;
    }
    else {
      const accounts = localStorage.getItem("accounts");
      if (accounts) {
        // Check if apikey data exist
        const isAccountExist = Object.keys(JSON.parse(accounts)).includes(accountKey);

        // If account dont exist then save the data in local.
        if (!isAccountExist) {
          let parsedAccounts = { ...JSON.parse(accounts) };
          parsedAccounts[accountKey] = {
            accountKey,
            accountType,
            apiSecret
          };
          localStorage.setItem("accounts", JSON.stringify(parsedAccounts));
        }
      }
      else {
        // If accounts not exist then create a new object and save the data in local.
        const newAccounts = {
          [accountKey]: {
            accountKey,
            accountType,
            apiSecret
          }
        };
        localStorage.setItem("accounts", JSON.stringify(newAccounts));
      };

      if (accountType === "zerodha") {
        let redirectUrl = null;
        redirectUrl = `https://kite.zerodha.com/connect/login?v=3&api_key=${accountKey}`;
        window.location.href = redirectUrl;
      }
      else {
        alert("This account type is not supported yet.");
      }
    };
    console.log('Submitted:', { accountKey, apiSecret, accountType });

    // Reset and close
    setAccountKey('');
    setApiSecret('');
    setErrors({ accountKey: false, apiSecret: false });
    onClose();
  };

  const handleReAuthorizeAccount = () => {
    if (!accountKey.trim() || !apiSecret.trim()) {
      setErrors({
        accountKey: !accountKey.trim(),
        apiSecret: !apiSecret.trim()
      });
      return;
    }
    if (accountType === "zerodha") {
      let redirectUrl = null;
      redirectUrl = `https://kite.zerodha.com/connect/login?v=3&api_key=${accountKey}`;
      window.location.href = redirectUrl;
    }
    else {
      alert("This account type is not supported yet.");
    }
  }

  return (
    <Dialog onClose={handleClose} fullWidth open={open}>
      <DialogTitle>{mode === "add" ? "Add Account" : "Re-Authorize Account"}</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} mt={1}>
          <FormControl fullWidth variant="standard" disabled>
            <InputLabel id="account-type-label">Account Type</InputLabel>
            <Select
              labelId="account-type-label"
              id="accountType"
              value={accountType}
            >
              {ACCOUNT_TYPES.map((type) => (
                <MenuItem key={type.value} value={type.value}>
                  {type.label}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>This cannot be changed</FormHelperText>
          </FormControl>

          <TextField
            autoFocus
            margin="dense"
            id="accountKey"
            label="Account Key"
            type="text"
            fullWidth
            variant="standard"
            disabled={mode === "reauthorize"}
            value={accountKey}
            onChange={(e) => {
              setAccountKey(e.target.value);
              if (e.target.value.trim()) {
                setErrors(prev => ({ ...prev, accountKey: false }));
              }
            }}
            error={errors.accountKey}
            helperText={errors.accountKey ? 'Account Key is required' : ''}
          />

          <TextField
            margin="dense"
            id="apiSecret"
            label="API Secret"
            type="text"
            fullWidth
            variant="standard"
            value={apiSecret}
            disabled={mode === "reauthorize"}
            onChange={(e) => {
              setApiSecret(e.target.value);
              if (e.target.value.trim()) {
                setErrors(prev => ({ ...prev, apiSecret: false }));
              }
            }}
            error={errors.apiSecret}
            helperText={errors.apiSecret ? 'API Secret is required' : ''}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={mode === "add" ? handleSubmit : handleReAuthorizeAccount} variant="contained">{mode === "add" ? "Add" : "Re-Authorize"}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddAccountDialog;
