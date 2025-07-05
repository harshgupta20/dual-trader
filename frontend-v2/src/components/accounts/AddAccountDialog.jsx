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

const AddAccountDialog = ({ open, onClose }) => {
  const ACCOUNT_TYPES = [
    { value: 'zerodha', label: 'Zerodha' },
    { value: 'grow', label: 'Grow' },
    { value: 'upstox', label: 'Upstox' }
  ];

  const [accountKey, setAccountKey] = useState('');
  const [accountType] = useState('zerodha'); // Fixed to Zerodha
  const [error, setError] = useState(false);

  const handleClose = () => {
    setAccountKey('');
    setError(false);
    onClose();
  };

  const handleSubmit = () => {
    if (!accountKey.trim()) {
      setError(true);
      return;
    }

    console.log('Submitted:', { accountKey, accountType });

    // Reset state and close
    setAccountKey('');
    setError(false);
    onClose();
  };

  return (
    <Dialog onClose={handleClose} fullWidth open={open}>
      <DialogTitle>Add Account</DialogTitle>
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
            value={accountKey}
            onChange={(e) => {
              setAccountKey(e.target.value);
              if (e.target.value.trim()) setError(false);
            }}
            error={error}
            helperText={error ? 'Account Key is required' : ''}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">Add</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddAccountDialog;
