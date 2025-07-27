import { Box, Button, Dialog, Typography } from '@mui/material';
import TradeResultCard from './TradeResultCard';

const ResultDialog = ({ open, close, data }) => {
    if (!data) return null;

    const {
        tradeInfo,
        buyInstrumentResult,
        buyInstrumentResultWithStoploss,
        sellInstrumentResult,
        sellInstrumentResultWithStoploss,
    } = data;

    return (
        <Dialog open={open} onClose={close} fullWidth maxWidth="sm">
            <Box p={2} className="bg-white min-h-[100vh] sm:min-h-fit">
                <Typography variant="h6" fontWeight="bold" mb={2}>
                    Trade Execution Summary
                </Typography>

                <Box className="flex flex-col gap-4">
                    {/* Buy */}
                    <TradeResultCard
                        title="Buy Order"
                        result={buyInstrumentResult}
                        action="BUY"
                        accountInfo={buyInstrumentResult?.data?.buyAccountInfo}
                    />

                    {/* Buy + Stoploss */}
                    <TradeResultCard
                        title="Buy Order (Stoploss)"
                        result={buyInstrumentResultWithStoploss}
                        action="BUY"
                        accountInfo={buyInstrumentResultWithStoploss?.data?.buyAccountInfo}
                    />

                    {/* Sell */}
                    <TradeResultCard
                        title="Sell Order"
                        result={sellInstrumentResult}
                        action="SELL"
                        accountInfo={sellInstrumentResult?.sellAccountInfo}
                    />

                    {/* Sell + Stoploss */}
                    <TradeResultCard
                        title="Sell Order (Stoploss)"
                        result={sellInstrumentResultWithStoploss}
                        action="SELL"
                        accountInfo={sellInstrumentResultWithStoploss?.data?.sellAccountInfo}
                    />
                </Box>

                <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick={close}
                    className="mt-6"
                >
                    Close
                </Button>
            </Box>
        </Dialog>
    );
};

export default ResultDialog;
