import { Box, Button, IconButton, Tooltip } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import { useContext, useState } from 'react';
import { AccountsContext } from '../../context/AccountContext';
import moment from 'moment/moment';
import AddAccountDialog from './AddAccountDialog';

const InfoRow = ({ label, value }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(value);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    return (
        <Box className="flex items-center justify-between py-1">
            <p className="font-medium w-1/3">{label}</p>
            <Box className="flex items-center gap-2 w-2/3 justify-end">
                <span className="truncate text-sm">{value}</span>
                <Tooltip title={copied ? "Copied!" : "Copy"}>
                    <IconButton size="small" onClick={handleCopy}>
                        {copied ? <CheckIcon fontSize="small" color="success" /> : <ContentCopyIcon fontSize="small" />}
                    </IconButton>
                </Tooltip>
            </Box>
        </Box>
    );
};

const AccountCard = ({ account, index }) => {
    const { setAccounts } = useContext(AccountsContext);
    const [reAuthorizeAccountModal, setReAuthorizeAccountModal] = useState(false);

    const handleLogout = () => {
        console.log('Logged out');
    };

    const handleRemoveAccount = () => {
        const accounts = localStorage.getItem('accounts');
        if (accounts) {
            let parsedAccounts = JSON.parse(accounts);
            delete parsedAccounts[account.accountKey];
            localStorage.setItem('accounts', JSON.stringify(parsedAccounts));
            setAccounts(parsedAccounts);
        }
        console.log('Account removed');
    };

    return (
        <Box className="p-4 border border-gray-300 rounded-lg shadow-md mb-4">
            <Box className="flex w-full mb-2 bg-gray-300 px-2 py-1 font-semibold">
                <p>Account {index + 1} - <span className='font-normal'>{account?.user_shortname}</span></p>
            </Box>

            <Box className="space-y-1">
                <InfoRow label="User ID" value={account?.user_id} />
                <InfoRow label="Name" value={account?.user_shortname} />
                <InfoRow label="Email" value={account?.email} />
                <InfoRow label="Broker" value={account?.accountType} />
                <InfoRow label="Account Key" value={account?.accountKey} />
                <InfoRow label="Last Login" value={moment(account?.login_time).format('MMMM Do YYYY, h:mm A')} />
            </Box>

            <Box className='flex flex-col gap-2 mt-4'>
                <Button onClick={handleRemoveAccount} fullWidth variant="contained" color="error">Remove Account</Button>
                <Button onClick={() => setReAuthorizeAccountModal(true)} fullWidth variant="contained" color="success">Re-Authorize Account</Button>
                {/* <Button onClick={handleLogout} fullWidth variant="outlined" color="error">Logout</Button> */}
            </Box>


            {reAuthorizeAccountModal && <AddAccountDialog mode="reauthorize" propAccountKey={account?.accountKey} propApiSecret={account?.apiSecret} open={reAuthorizeAccountModal} onClose={() => setReAuthorizeAccountModal(false)} />}
        </Box>
    );
};

export default AccountCard;
