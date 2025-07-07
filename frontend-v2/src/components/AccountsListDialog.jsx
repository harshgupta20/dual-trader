import { Dialog, Card, CardContent, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

const AccountsListDialog = ({ open, onClick, close }) => {
    const [accounts, setAccounts] = useState([]);

    const GetAccountsFromLocalStorage = () => {
        try {
            const storedAccounts = localStorage.getItem("accounts");
            if (storedAccounts) {
                const parsed = JSON.parse(storedAccounts);
                console.log("harsh accounts", parsed);
                setAccounts(Object.values(parsed)); // convert object to array
            }
        } catch (error) {
            console.error("Error fetching accounts from local storage:", error);
        }
    };

    useEffect(() => {
        if (open) {
            GetAccountsFromLocalStorage();
        }
    }, [open]);

    return (
        <Dialog open={open} onClose={close} maxWidth="sm" fullWidth>
            <div className="p-6">
                <Typography variant="h6" align="center" gutterBottom>
                    Select an Account
                </Typography>

                <div className="flex flex-col gap-4">
                    {accounts?.length === 0 ? (
                        <Typography color="textSecondary" align="center">
                            No accounts available.
                        </Typography>
                    ) : (
                        accounts?.map((account, index) => (
                            <Card
                                key={index}
                                className="cursor-pointer hover:shadow-lg transition-shadow border"
                                onClick={() => {
                                    onClick(account);
                                    close();
                                }}
                            >
                                <CardContent>
                                    <Typography variant="subtitle1" fontWeight={600}>
                                        {account?.user_id || `Account ${index + 1}`}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        {account?.user_shortname}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        {account?.email}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        {account?.accountType}
                                    </Typography>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </Dialog>
    );
};

export default AccountsListDialog;
