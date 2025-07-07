import { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Typography
} from '@mui/material';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import axiosInstance from '../utils/axios';

const AccountCallback = () => {

    const location = useLocation();

    const [urlQuery, setUrlQuery] = useState();
    const [accountKey, setAccountKey] = useState('');
    const [error, setError] = useState(false);
    const [confirmCancelOpen, setConfirmCancelOpen] = useState(false);

    const handleSubmit = async () => {

        try {

            if (!accountKey.trim()) {
                setError(true)
                return
            }

            let ACCOUNTS_INFO = JSON.parse(localStorage.getItem('accounts')) || null;

            if (ACCOUNTS_INFO === null || !ACCOUNTS_INFO[accountKey]) {
                setError(true);
                alert('Account Key not found. Please check your Account Key.');
                return;
            }

            setError(false);

            const response = await axiosInstance.post(`/auth/login`, {
                request_token: urlQuery?.requestToken,
                api_key: accountKey,
                api_secret: ACCOUNTS_INFO[accountKey]?.apiSecret,
            });

            if (response?.data?.success) {
                console.log('Login successful:', response.data);
                ACCOUNTS_INFO = {
                    ...ACCOUNTS_INFO,
                    [accountKey]: {
                        ...ACCOUNTS_INFO[accountKey],
                        ...response?.data?.data?.userInfo,
                        token: response?.data?.data?.token,
                    }
                }

                // Save the user info and token in local storage or context
                localStorage.setItem('accounts', JSON.stringify(ACCOUNTS_INFO));

                // Redirect to accounts page or dashboard
                window.location.href = '/accounts';
            }
            else {
                console.error('Login failed:', response.data.message);
                setError(true);
                // Optionally, show an error message to the user
                alert('Login failed: ' + response.data.message);
                return;
            }
            console.log('Proceeding with Account Key:', { accountKey, requestToken: urlQuery?.requestToken });
        }
        catch (error) {
            console.error('Error during login:', error);
            setError(true);
            // Optionally, show an error message to the user
            alert('An error occurred during login. Please try again later.');
            return;
        }
    }

    const handleCancel = () => {
        setConfirmCancelOpen(true);
    }

    const handleConfirmCancel = () => {
        setConfirmCancelOpen(false)
        console.log('User cancelled the login step.');
        //naviagte to /accounts
        window.location.href = '/accounts';
    }


    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);

        const type = queryParams.get('type');
        const status = queryParams.get('status');
        const requestToken = queryParams.get('request_token');
        const action = queryParams.get('action');

        setUrlQuery({ type, status, requestToken, action });
    }, [location.search])

    return (
        <>
            {/* Main Dialog */}
            <Dialog open={true} fullWidth>
                <Box className="flex flex-col gap-3 items-center h-[80dvh] p-4">
                    {/* Success Message */}
                    <Box className="w-full p-3 bg-green-200 rounded">
                        <Typography>Token Created Successfully...</Typography>
                    </Box>

                    {/* Input Section */}
                    <Box className="w-full flex flex-col flex-1 items-center justify-between gap-4 p-4">
                        <Box className="w-full flex flex-col gap-3">
                            <Typography className="text-center mb-2">
                                Please enter the same Account Key again.
                            </Typography>

                            <TextField
                                fullWidth
                                variant="standard"
                                label="Request Token"
                                value={urlQuery?.requestToken || ''}
                                disabled
                            />

                            <TextField
                                fullWidth
                                variant="standard"
                                label="Account Key"
                                value={accountKey}
                                onChange={(e) => setAccountKey(e.target.value)}
                                error={error}
                                helperText={error ? 'Account Key is required' : ''}
                            />
                        </Box>

                        <Box className="flex flex-col gap-2 w-full">
                            <Button
                                fullWidth
                                variant="contained"
                                color="primary"
                                onClick={handleSubmit}
                            >
                                Login Step (2/2)
                            </Button>

                            <Button
                                fullWidth
                                variant="contained"
                                color="error"
                                onClick={handleCancel}
                            >
                                Cancel
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Dialog>

            {/* Confirmation Dialog */}
            <Dialog open={confirmCancelOpen} onClose={() => setConfirmCancelOpen(false)}>
                <DialogTitle>Confirm Cancel</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to cancel this process?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmCancelOpen(false)} color="primary">
                        Go Back
                    </Button>
                    <Button onClick={handleConfirmCancel} color="error" variant="contained">
                        Yes, Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default AccountCallback
