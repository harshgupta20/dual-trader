import { Box, Button, Dialog, Typography } from '@mui/material'
import TradeResultCard from '../TradeResultCard'

const ResultDialog = ({ open, close }) => {
    return (
        <Dialog open={open} onClose={close} maxWidth="sm" fullWidth>
            <Box p={2}>
                <p className='text-2xl font-bold'>Trade Executed</p>

                <Box className="flex flex-col gap-2 mb-4">
                   <TradeResultCard />
                </Box>
                <Button fullWidth variant="contained" color="primary" onClick={close}>
                    Close
                </Button>
            </Box>
        </Dialog>
    )
}

export default ResultDialog