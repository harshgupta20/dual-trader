import { Box, Typography } from '@mui/material'
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord'

const OHLCPanel = ({ instrumentInfo }) => {
    const ohlc = instrumentInfo?.ohlc ?? {}
    const ltp = instrumentInfo?.last_price ?? null

    const highPercent =
        ltp && ohlc.high ? (((ohlc.high - ltp) / ltp) * 100).toFixed(2) : null

    const lowPercent =
        ltp && ohlc.low ? (((ltp - ohlc.low) / ltp) * 100).toFixed(2) : null

    return (
        <Box className="bg-white rounded-xl shadow-sm p-4 text-sm text-gray-700 space-y-3 border border-gray-200">
            <Typography variant="subtitle2" className="text-sm font-semibold text-gray-900">
                OHLC Data
            </Typography>

            <Box className="grid grid-cols-2 gap-y-2 gap-x-4">
                {/* Open */}
                <div className="flex justify-between">
                    <span className="text-gray-500">Open</span>
                    <span>{ohlc.open ?? '—'}</span>
                </div>

                {/* High */}
                <div className="flex justify-between items-center">
                    <span className="text-gray-500">High</span>
                    <span className="flex items-center gap-1">
                        <FiberManualRecordIcon fontSize="inherit" className="text-green-400" />
                        <span className="text-green-700">{ohlc.high ?? '—'}</span>
                        {highPercent && (
                            <span className="text-[11px] text-green-700 ml-1">
                                ({highPercent}%)
                            </span>
                        )}
                    </span>
                </div>

                {/* Low */}
                <div className="flex justify-between items-center">
                    <span className="text-gray-500">Low</span>
                    <span className="flex items-center gap-1">
                        <FiberManualRecordIcon fontSize="inherit" className="text-red-400" />
                        <span className="text-red-500">{ohlc.low ?? '—'}</span>
                        {lowPercent && (
                            <span className="text-[11px] text-red-700 ml-1">
                                ({lowPercent}%)
                            </span>
                        )}
                    </span>
                </div>

                {/* Close */}
                <div className="flex justify-between">
                    <span className="text-gray-500">Close</span>
                    <span>{ohlc.close ?? '—'}</span>
                </div>
            </Box>

            <Box className="flex justify-between pt-2 border-t border-gray-100">
                <span className="text-gray-500">Last Price</span>
                <span className="text-blue-600 font-medium">
                    {ltp ?? '—'}
                </span>
            </Box>
        </Box>
    )
}

export default OHLCPanel
