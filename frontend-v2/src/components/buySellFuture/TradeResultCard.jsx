import { Box, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

const TradeResultCard = ({ title, result, action, accountInfo }) => {
    const isSuccess = result?.success;

    const color = isSuccess ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50';
    const icon = isSuccess ? (
        <CheckCircleIcon className="text-green-600 mr-1" fontSize="small" />
    ) : (
        <CancelIcon className="text-red-600 mr-1" fontSize="small" />
    );

    return (
        <Box
            className={`rounded-xl border-l-4 ${color} p-4 shadow-sm transition-all`}
        >
            <Box className="flex items-center gap-2 mb-2">
                {icon}
                <Typography variant="subtitle1" fontWeight={600}>
                    {title}
                </Typography>
            </Box>

            <Typography variant="body2" className="text-gray-700">
                Status:{' '}
                <span className={isSuccess ? 'text-green-700' : 'text-red-700'}>
                    {isSuccess ? 'Success' : 'Failed'}
                </span>
            </Typography>

                <Typography variant="body2" className="text-gray-700">
                    Price: ₹{accountInfo?.price}
                </Typography>

                <Typography variant="body2" className="text-gray-700">
                    Stop Loss: ₹{accountInfo?.stopLoss}
                </Typography>

                <Typography variant="body2" className="text-gray-700">
                    Order ID: <span className="text-blue-700">{result?.data?.order_id || "---"}</span>
                </Typography>
        </Box>
    );
};

export default TradeResultCard;
