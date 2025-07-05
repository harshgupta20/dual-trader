import { Box, Button } from '@mui/material'
import React, { useState } from 'react'
import AddAccountDialog from '../components/accounts/AddAccountDialog'
import AccountCard from '../components/accounts/AccountCard';

const Accounts = () => {

    const [openAddAccountDialog, setOpenAddAccountDialog] = useState(false);

    const ACCOUNTS = [
        {
            name: "John",
            email: "john@gmail.com",
            broker: "Zerodha",
            accountKey: "1234567890"
        },
        {
            name: "Jane",
            email: "jane@gmail.com",
            broker: "Grow",
            accountKey: "0987654321"
        }
    ]

    return (
        <Box>
            <Box className="flex w-full justify-end p-4">
                <Button onClick={() => setOpenAddAccountDialog(true)} variant="contained" color="primary">
                    + Add Account
                </Button>
            </Box>


            <Box className="flex flex-col gap-4 p-4">
                {
                    ACCOUNTS.map((account, index) => (
                        <AccountCard index={index} account={account} />
                    ))
                }
            </Box>


            {openAddAccountDialog && <AddAccountDialog open={openAddAccountDialog} onClose={() => setOpenAddAccountDialog(false)} />}
        </Box>
    )
}

export default Accounts