import { useSearchParams } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInterceptor';
import { useEffect } from 'react';

const Account1 = () => {

    const [searchParams] = useSearchParams();

    // Example: if the URL is /page?name=John&age=25
    const request_token = searchParams.get('request_token'); // 'John'


    const getAuthToken = async () => {
        try{
            if(request_token){
                const response = await axiosInstance.post(`${import.meta.env.VITE_BACKEND_BASE_URL}/auth/login`, {request_token});
                console.log("harsh",response);
            }else{
                console.log("harsh request token not found");
            }
        }
        catch(error){
            console.log("harsh error",error.message);
        }
    }

    useEffect(() => {
        getAuthToken();
    }, [])

    return (
        <div>Account1</div>
    )
}

export default Account1