import { useSearchParams } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInterceptor';
import { useEffect } from 'react';
import localStorageHelper from '../../utils/localstorage';
import { toast } from 'sonner';

const Account1 = () => {

    const [searchParams] = useSearchParams();
    const request_token = searchParams.get('request_token');

    const getAuthToken = async () => {
        try{
            if(request_token){
                const response = await axiosInstance.post(`${import.meta.env.VITE_BACKEND_BASE_URL}/auth/login`, {request_token});
                if(response.success){
                    localStorageHelper.set("token", response?.data?.token);
                    localStorageHelper.set("userInfo", response?.data?.userInfo);
                    toast.success(response?.message || "Login successful");
                    console.log("harsh",response?.data);
                }
            }else{
                toast.error(response?.data?.message || "An Error Occured");
                console.log("harsh request token not found");
            }
        }
        catch(error){
            toast.error(error?.message || "An Error Occured");
            console.log("harsh error",error.message);
        }
    }

    useEffect(() => {
        getAuthToken();
    }, [])

    return (
        <>
        <div>Account1</div>
        </>
    )
}

export default Account1