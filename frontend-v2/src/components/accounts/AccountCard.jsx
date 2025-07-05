import { Box, Button } from '@mui/material'

const AccountCard = ({ account, index }) => {

    const handleLogout = () => {
        // Handle logout logic here
        console.log('Logged out');
    };

    const handleRemoveAccount = () => {
        // Handle account removal logic here
        console.log('Account removed');
    }


    return (
        <Box className="p-3 border border-gray-300 rounded-lg shadow-md mb-4">
            <Box className="flex w-full justify-end">
                <p>Account {index+1}</p>
            </Box>
            <Box>
                <p>Name : <span>{account.name}</span></p>
                <p>Email : <span>{account.email}</span></p>
                <p>Broker : <span>{account.broker}</span></p>
                <p>Account Key : <span>{account.accountKey}</span></p>
            </Box>

            <div className='flex flex-col gap-2 mt-4'>
                <Button onClick={handleRemoveAccount} fullWidth variant="contained" color="error">Remove Account</Button>
                <Button onClick={handleLogout} fullWidth variant="contained" color="error">Logout</Button>
            </div>
        </Box>
    )
}

export default AccountCard