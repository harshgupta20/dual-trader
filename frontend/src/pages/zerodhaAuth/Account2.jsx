import { useSearchParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInterceptor';
import { useEffect, useState } from 'react';
import localStorageHelper from '../../utils/localstorage';
import { toast } from 'sonner';

const Account2 = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const request_token = searchParams.get('request_token');
    const [status, setStatus] = useState('loading'); // loading | success | error

    const getAuthToken = async () => {
        if (!request_token) {
            toast.error("Request token not found");
            console.log("harsh request token not found");
            setStatus('error');
            return;
        }

        try {
            setStatus('loading');
            const response = await axiosInstance.post(
                `${import.meta.env.VITE_BACKEND_BASE_URL}/auth/login`,
                { request_token }
            );

            if (response?.success) {
                const totalAccounts = localStorageHelper.get("totalAccounts") || {};
                localStorageHelper.set("account2", response?.data);
                localStorageHelper.set("totalAccounts", {...totalAccounts, [`account${Object.keys(totalAccounts).length + 1}`]: response?.data?.userInfo?.user_id, [`account${totalAccounts.length + 1}`]: response?.data?.userInfo?.user_id});
                
                toast.success(response?.data?.message || "Login successful");
                console.log("harsh", response?.data);
                setStatus('success');
            } else {
                toast.error(response?.message || "Login failed");
                console.log("harsh login failed:", response?.data);
                setStatus('error');
            }
        } catch (error) {
            toast.error(error?.message || error?.message || "An error occurred");
            console.log("harsh error", error);
            setStatus('error');
        }
    };

    useEffect(() => {
        getAuthToken();
    }, []);

    return (
        <div className="flex flex-col items-center justify-center px-4 text-center">
            {status === 'loading' && (
                <div className="text-xl animate-pulse text-blue-500">
                    Logging you in...
                </div>
            )}

            {status === 'success' && (
                <>
                    <h2 className="text-2xl font-semibold text-green-600 mb-4">
                        Login Successfull ✅
                    </h2>
                    <button
                        onClick={() => navigate('/login')}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                        Redirect Me to Main Page...
                    </button>
                </>
            )}
            {status === 'error' && (
                <>
                    <h2 className="text-2xl font-semibold text-red-600 mb-4">Login Failed ❌</h2>
                    <div className="flex flex-col gap-3">
                        <button
                            onClick={getAuthToken}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                        >
                            Retry Login
                        </button>
                        <button
                            onClick={() => navigate('/')}
                            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
                        >
                            Go Home
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Account2;
