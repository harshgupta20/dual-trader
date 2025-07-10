import { Box } from '@mui/material'

const TradeResultCard = () => {
    return (
        <Box className="border p-3 rounded-md">
            <p>Account: <span className='font-bold'>1</span></p>
            <p>Name: <span className='font-bold'>Harsh</span></p>
            <p>Type: <span className='font-bold'>Buy</span></p>
            <p>Quantity: <span className='font-bold'>100</span></p>
            <p>Price: <span className='font-bold'>100.36 INR</span></p>
            <p>Stoploss: <span className='font-bold'>90 INR</span></p>

            <p className='bg-green-500 font-bold px-2 py-1 rounded-md text-white'>Success</p>
        </Box>
    )
}

export default TradeResultCard