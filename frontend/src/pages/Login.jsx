import { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInterceptor";
import localStorageHelper from "../utils/localstorage";
import { toast } from "sonner";
import ProfileCard from "../components/ProfileCard";

const Login = () => {

    const [account1Info, setAccount1Info] = useState({});
    const [account2Info, setAccount2Info] = useState({});

    const checkAccountsLoginStatus = () => {
        try {
            const user1 = localStorageHelper.get("account1");
            const user2 = localStorageHelper.get("account2");
            setAccount1Info(user1 || {});
            setAccount2Info(user2 || {});
        }
        catch (error) {
            console.log(error);
            toast.error(error?.message || error?.message || "An error occurred");
        }
    }

    const userInfo = {
        user_type: 'admin',
        email: 'john.doe@example.com',
        full_name: 'John Doe',
        user_shortname: 'JD',
        avatar_url: '', // No photo to test initial fallback
        login_time: '2025-05-31T10:20:00Z',
        products: ['Stocks', 'Mutual Funds'],
        exchanges: ['NSE', 'BSE'],
    };

    const handleLogoutAccount1 = () => {
        console.log("Logging out...");
        localStorageHelper.remove("account1");
        setAccount1Info({});
        // Your logout logic here
    };
    const handleLogoutAccount2 = () => {
        console.log("Logging out...");
        localStorageHelper.remove("account2");
        setAccount2Info({});
        // Your logout logic here
    };

    useEffect(() => {
        document.title = "Login | EZ Trade";
        checkAccountsLoginStatus();
    }, [])

    return (
        <>
            <div className='flex flex-col items-center justify-center h-full'>

                <div className="flex min-h-[90%] w-full flex-col items-center gap-3 p-2">
                    <div className="flex min-h-[50%] w-full flex-col items-center border-[1px] border-dotted border-gray-300 rounded p-4">
                        {account1Info?.userInfo?.user_id ? (<ProfileCard accountNo={"Account 1"} userInfo={account1Info?.userInfo} onLogout={handleLogoutAccount1} />)
                            :
                            (<a href="https://kite.zerodha.com/connect/login?v=3&api_key=1y1ohmgx6u3e1tt9" noreferrer>
                                <button className='bg-indigo-600 px-6 py-2 rounded my-2 w-full'>
                                    Login Account 1
                                </button>
                            </a>)
                        }
                    </div>

                    <div className="flex min-h-[50%] w-full flex-col items-center border-[1px] border-dotted border-gray-300 rounded p-4">

                        {account2Info?.userInfo?.user_id ? (<ProfileCard accountNo={"Account 2"} userInfo={account2Info?.userInfo} onLogout={handleLogoutAccount2} />)
                            :
                            (<a href="https://kite.zerodha.com/connect/login?v=3&api_key=1y1ohmgx6u3e1tt9" noreferrer>
                                <button className='bg-indigo-600 px-6 py-2 rounded my-2 w-full'>
                                    Login Account 2
                                </button>
                            </a>)
                        }

                    </div>

                </div>
                <button className='bg-indigo-600 px-6 py-2 rounded my-2 w-full'>
                    Continue
                </button>

            </div>
        </>
    )
}

export default Login