import { useEffect, useState } from "react";
import localStorageHelper from "../utils/localstorage";
import { toast } from "sonner";
import ProfileCard from "../components/ProfileCard";

const Login = () => {

    const [account1Info, setAccount1Info] = useState({});
    const [account2Info, setAccount2Info] = useState({});

    const checkAccountsLoginStatus = () => {
        try {
            const accounts = localStorageHelper.get("accounts");
            // const user2 = localStorageHelper.get("account2");
            setAccount1Info(accounts?.account1 || {});
            setAccount2Info(accounts?.account2 || {});
        }
        catch (error) {
            console.log(error);
            toast.error(error?.message || error?.message || "An error occurred");
        }
    }

    const handleLogoutAccount1 = () => {
        console.log("Logging out...");
        const accounts = localStorageHelper.get("accounts");
        localStorageHelper.set("accounts", { ...accounts, account1: {} });
        setAccount1Info({});
        // Your logout logic here
    };
    const handleLogoutAccount2 = () => {
        console.log("Logging out...");
        const accounts = localStorageHelper.get("accounts");
        localStorageHelper.set("accounts", { ...accounts, account2: {} });
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
                            (<a href={`https://kite.zerodha.com/connect/login?v=3&api_key=${import.meta.env.VITE_ZERODHA_ACCOUNT1_API_KEY}`} noreferrer>
                                <button className='bg-indigo-600 px-6 py-2 rounded my-2 w-full'>
                                    Login as Harsh
                                </button>
                            </a>)
                        }
                    </div>

                    <div className="flex min-h-[50%] w-full flex-col items-center border-[1px] border-dotted border-gray-300 rounded p-4">

                        {account2Info?.userInfo?.user_id ? (<ProfileCard accountNo={"Account 2"} userInfo={account2Info?.userInfo} onLogout={handleLogoutAccount2} />)
                            :
                            (<a href={`https://kite.zerodha.com/connect/login?v=3&api_key=${import.meta.env.VITE_ZERODHA_ACCOUNT2_API_KEY}`} noreferrer>
                                <button className='bg-indigo-600 px-6 py-2 rounded my-2 w-full'>
                                    Login as Ashish
                                </button>
                            </a>)
                        }

                    </div>

                </div>

                {
                    account1Info?.userInfo?.user_id && account2Info?.userInfo?.user_id &&
                    <a href="/future-index" noreferrer>
                        <button className='bg-indigo-600 px-6 py-2 rounded my-2 w-full'>
                            Continue
                        </button>
                    </a>
                }
            </div>
        </>
    )
}

export default Login