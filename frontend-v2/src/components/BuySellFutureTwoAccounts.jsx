import { useEffect, useState } from 'react';
import {
    Box,
    Button,
    TextField,
    Typography,
    ToggleButtonGroup,
    ToggleButton,
    MenuItem,
    Select,
    FormHelperText,
    FormControl,
    InputLabel,
} from '@mui/material';
import ResultDialog from './buySellFuture/ResultDialog';
import axiosInstance from '../utils/axios';
import OHLCPanel from './OhlcPanel';
import TypeaheadInstrument from './TypeaheadInstrument';

const TradingForm = ({ account1, account2 }) => {
    const [selectedInstrument, setSelectedInstrument] = useState('');
    const [exchange, setExchange] = useState('');
    const [quantity, setQuantity] = useState('');
    const [productType, setProductType] = useState('');
    const [errors, setErrors] = useState({});
    const [showResultDialog, setShowResultDialog] = useState({ show: false });
    const [instrumentInfo, setInstrumentInfo] = useState(null);
    const [instrumentList, setInstrumentList] = useState([]);

    const [accountData, setAccountData] = useState({
        account1: { action: 'BUY', price: '', stopLoss: '' },
        account2: { action: 'SELL', price: '', stopLoss: '' },
    });

    const handleGetIntrumentPrice = async (selectedInstrument) => {
        try {
            const instrument = `${exchange}:${selectedInstrument}`;
            const response = await axiosInstance.post('data/instruments-ltp', {
                access_token: account1?.access_token,
                instruments: [instrument],
                api_key: account1?.accountKey
            });
            if (response.data.success) {
                setInstrumentInfo(response.data.data[instrument]);
            } else {
                console.error('Failed to fetch instrument price:', response.data.message);
            }
        } catch (error) {
            console.error('Error fetching instrument price:', error);
            setErrors(prev => ({ ...prev, selectedInstrument: 'Failed to fetch instrument price' }));
        }
    };

    const getInstrumentList = async () => {
        try {
            const response = await axiosInstance.post('data/instruments-list', {
                access_token: account1?.access_token,
                api_key: account1?.accountKey,
            });
            if (response.data.success) {
                setInstrumentList(response.data.data);
            }
            else {
                setErrors(prev => ({ ...prev, selectedInstrument: response.data.message || 'Failed to fetch instrument list' }));
                return;
            }
        }
        catch (error) {
            console.error('Error fetching instrument list:', error);
            setErrors(prev => ({ ...prev, selectedInstrument: 'Failed to fetch instrument list' }));
        }
    }

    const validateStopLoss = (account, price, stopLoss) => {
        if (!price || !stopLoss) return '';
        const action = accountData[account].action;
        if (action === 'BUY' && parseFloat(stopLoss) >= parseFloat(price)) {
            return 'StopLoss must be less than Price for BUY';
        } else if (action === 'SELL' && parseFloat(stopLoss) <= parseFloat(price)) {
            return 'StopLoss must be greater than Price for SELL';
        }
        return '';
    };

    const handleInputChange = (account, field, value) => {
        setAccountData(prev => {
            const updated = {
                ...prev,
                [account]: { ...prev[account], [field]: value }
            };

            const price = field === 'price' ? value : updated[account].price;
            const stopLoss = field === 'stopLoss' ? value : updated[account].stopLoss;
            const errorMsg = validateStopLoss(account, price, stopLoss);

            setErrors(prevErrors => ({
                ...prevErrors,
                [account]: errorMsg
            }));

            return updated;
        });
    };

    const handleActionChange = (account, newAction) => {
        if (!newAction) return;

        const opposite = newAction === 'BUY' ? 'SELL' : 'BUY';
        const otherAccount = account === 'account1' ? 'account2' : 'account1';

        setAccountData(prev => ({
            ...prev,
            [account]: { ...prev[account], action: newAction },
            [otherAccount]: { ...prev[otherAccount], action: opposite }
        }));

        ['account1', 'account2'].forEach(acc => {
            const price = accountData[acc].price;
            const stopLoss = accountData[acc].stopLoss;
            const errorMsg = validateStopLoss(acc, price, stopLoss);
            setErrors(prev => ({ ...prev, [acc]: errorMsg }));
        });
    };

    const handleSubmit = async () => {
        const newErrors = {};

        if (!selectedInstrument) newErrors.selectedInstrument = 'Please select a Instrument';
        if (!quantity || parseFloat(quantity) <= 0) newErrors.quantity = 'Enter a valid quantity';
        if (!productType) newErrors.productType = 'Select a product type';

        ['account1', 'account2'].forEach(account => {
            const { price, stopLoss } = accountData[account];
            if (!price) newErrors[`${account}_price`] = 'Price is required';
            if (!stopLoss) newErrors[`${account}_stopLoss`] = 'StopLoss is required';

            const stopLossError = validateStopLoss(account, price, stopLoss);
            if (stopLossError) newErrors[account] = stopLossError;
        });

        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;

        const selectedInstrumentInfo = instrumentList.find(
            (instrument) => instrument?.tradingsymbol === selectedInstrument
        );

        if (!selectedInstrumentInfo) {
            setErrors(prev => ({ ...prev, selectedInstrument: 'Invalid instrument selected' }));
            return;
        }

        accountData.account1 = {
            api_key: account1?.accountKey,
            access_token: account1?.access_token,
            ...accountData.account1
        };
        accountData.account2 = {
            api_key: account2?.accountKey,
            access_token: account2?.access_token,
            ...accountData.account2
        };

        const payload = {
            instrument: selectedInstrumentInfo.tradingsymbol,
            quantity,
            exchange,
            product: productType,
            accounts: accountData,
        };

        const response = await axiosInstance.post('trade/buy-sell-instruments', payload);

        if (response.data.success) {
            // setSelectedInstrument('');
            // setQuantity('');
            // setExchange('');
            // setProductType('');
            // setAccountData({
            //     account1: { action: 'BUY', price: '', stopLoss: '' },
            //     account2: { action: 'SELL', price: '', stopLoss: '' },
            // });
            // setErrors({});
            setShowResultDialog({ show: true, data: response?.data?.data });
        } else {
            setErrors(prev => ({
                ...prev,
                submit: response?.data?.message || 'Order execution failed'
            }));
        }
    };

    useEffect(() => {
        let intervalId;

        if (selectedInstrument) {
            const instrument = instrumentList.find(
                (instrument) => instrument.tradingsymbol === selectedInstrument
            );
            setQuantity(instrument?.lot_size || '');
            setExchange(instrument?.exchange || '');

            handleGetIntrumentPrice(selectedInstrument);

            intervalId = setInterval(() => {
                handleGetIntrumentPrice(selectedInstrument);
            }, 1000);
        }

        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [selectedInstrument]);

    useEffect(() => {
        getInstrumentList();
    }, []);

    return (
        <Box className="p-4 flex flex-1 flex-col justify-between gap-5 min-h-full overflow-scroll">
            <Box className="flex flex-col gap-4">
                <Box className="bg-gray-100 rounded-lg p-3 shadow-sm border text-sm">
                    <Typography variant="subtitle2" className="mb-2 font-medium text-gray-700">
                        Market Snapshot
                    </Typography>
                    <OHLCPanel instrumentInfo={instrumentInfo} />
                </Box>

                <Box className="flex gap-2">
                    <FormControl className="flex-1" error={Boolean(errors.selectedInstrument)}>
                        {/* <InputLabel>Select Instrument</InputLabel> */}
                        <TypeaheadInstrument
                            label="Search Instrument"
                            account={account1}
                            onSelect={(instrument) => {
                                if (instrument) {
                                    setSelectedInstrument(instrument.tradingsymbol);
                                    setExchange(instrument.exchange);
                                }
                            }}
                            error={errors.selectedInstrument}
                            helperText={errors.selectedInstrument}
                        />

                        {errors.selectedInstrument && <FormHelperText>{errors.selectedInstrument}</FormHelperText>}
                    </FormControl>

                    <TextField
                        className="flex-1"
                        variant="outlined"
                        label="Enter Quantity"
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        error={Boolean(errors.quantity)}
                        helperText={errors.quantity}
                    />

                    <TextField
                        className="flex-1"
                        variant="outlined"
                        label="Exchange"
                        value={exchange}
                        disabled
                    />
                </Box>

                <FormControl error={Boolean(errors.productType)} fullWidth>
                    <InputLabel>Product Type</InputLabel>
                    <Select
                        value={productType}
                        onChange={(e) => setProductType(e.target.value)}
                        label="Product Type"
                    >
                        <MenuItem value="MIS">Intraday (MIS)</MenuItem>
                        <MenuItem value="CNC">CNC (CNC)</MenuItem>
                    </Select>
                    {errors.productType && <FormHelperText>{errors.productType}</FormHelperText>}
                </FormControl>

                {['account1', 'account2'].map((account, i) => (
                    <Box key={account} className="border p-3 rounded-md space-y-3">
                        <Typography className="text-sm text-gray-600">
                            {account === "account1" ? (
                                <span>{account1?.user_shortname} ({account1?.user_id})</span>
                            ) : (
                                <span>{account2?.user_shortname} ({account2?.user_id})</span>
                            )} - Account {i + 1}
                        </Typography>

                        <Box className="flex items-center gap-3">
                            <ToggleButtonGroup
                                value={accountData[account].action}
                                exclusive
                                onChange={(_, val) => handleActionChange(account, val)}
                                size="small"
                                color="primary"
                            >
                                <ToggleButton value="BUY">Buy</ToggleButton>
                                <ToggleButton value="SELL">Sell</ToggleButton>
                            </ToggleButtonGroup>

                            <TextField
                                label="Price"
                                type="number"
                                variant="outlined"
                                size="small"
                                value={accountData[account].price}
                                onChange={(e) => handleInputChange(account, 'price', e.target.value)}
                                error={Boolean(errors[`${account}_price`])}
                                helperText={errors[`${account}_price`]}
                            />
                        </Box>

                        <TextField
                            label="StopLoss"
                            type="number"
                            variant="outlined"
                            size="small"
                            fullWidth
                            value={accountData[account].stopLoss}
                            onChange={(e) => handleInputChange(account, 'stopLoss', e.target.value)}
                            error={Boolean(errors[account] || errors[`${account}_stopLoss`])}
                            helperText={errors[account] || errors[`${account}_stopLoss`]}
                        />
                    </Box>
                ))}
            </Box>

            <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                fullWidth
                className="bg-blue-500 hover:bg-blue-600 text-white"
            >
                Execute Order
            </Button>

            {showResultDialog?.show && (
                <ResultDialog
                    open={showResultDialog.show}
                    data={showResultDialog.data}
                    close={() => setShowResultDialog({ show: false })}
                />
            )}
        </Box>
    );
};

export default TradingForm;
