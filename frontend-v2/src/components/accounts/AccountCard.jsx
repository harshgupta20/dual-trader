import { Box, Button } from '@mui/material'

const AccountCard = ({account}) => {

    const handleLogout = () => {
        // Handle logout logic here
        console.log('Logged out');
    };


    return (
        <Box className="p-3 border border-gray-300 rounded-lg shadow-md mb-4">
            <Box className="flex w-full justify-end">
                <p>Account 1</p>
            </Box>
            <Box>
                <p>Name : <span>{account.name}</span></p>
                <p>Email : <span>{account.email}</span></p>
                <p>Broker : <span>{account.broker}</span></p>
                <p>Account Key : <span>{account.accountKey}</span></p>
            </Box>

            <Button onClick={handleLogout} fullWidth variant="contained" color="error">Logout</Button>
        </Box>
    )
}

export default AccountCard