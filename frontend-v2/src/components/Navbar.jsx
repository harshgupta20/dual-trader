import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [value, setValue] = useState(null);

    const NAVBAR_OPTIONS = [
        { label: 'Hedge Future', path: '/hedge-future' },
        { label: 'Accounts', path: '/accounts' },
    ];

    // Set the active tab index based on the current route
    useEffect(() => {
        const currentIndex = NAVBAR_OPTIONS.findIndex(option => location.pathname.startsWith(option.path));
        if (currentIndex !== -1) {
            setValue(currentIndex);
        }
    }, [location.pathname]);

    const handleChange = (event, newValue) => {
        setValue(newValue);

        console.log("Navigating to:", NAVBAR_OPTIONS[newValue].path, newValue);
        navigate(NAVBAR_OPTIONS[newValue].path);
    };

    return (
        <Box className="px-2">
            <Tabs
                value={value}
                onChange={handleChange}
                variant="scrollable"
                scrollButtons="auto"
                aria-label="scrollable auto tabs example"
            >
                {
                    NAVBAR_OPTIONS.map((option, index) => (
                        <Tab key={index} label={option.label} />
                    ))
                }
            </Tabs>
        </Box>
    );
}
