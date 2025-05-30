import axiosInstance from "../utils/axiosInterceptor";

const Login = () => {

    const loginZerodha = async () => {
        try {
            const response = await axiosInstance.get('https://kite.zerodha.com/connect/login?v=3&api_key=1y1ohmgx6u3e1tt9');
        }
        catch (error) {
            alert(error?.message);
        }
    }

    return (
        <>
            <div className='flex flex-col items-center justify-center h-full'>

                <div>
                    <a href="https://kite.zerodha.com/connect/login?v=3&api_key=1y1ohmgx6u3e1tt9" noreferrer>
                        <button className='bg-violet-600 px-6 py-2 rounded my-2 w-full'>
                            Login Account 1
                        </button>
                    </a>
                    <button className='bg-violet-600 px-6 py-2 rounded my-2 w-full'>
                        Login Account 2
                    </button>
                </div>

                <div className="flex flex-col gap-4">
                    <div className="border-2 border-gray-600 p-4">
                        <table className='w-full'>
                            <tr>
                                <td className="font-bold pr-2">Account Holder</td>
                                <td className="italic">John Doe</td>
                            </tr>
                            <tr>
                                <td className="font-bold pr-2">Email</td>
                                <td className="italic">gE7oC@example.com</td>
                            </tr>
                        </table>
                    </div>
                    <div className="border-2 border-gray-600 p-4">
                        <table className='w-full'>
                            <tr>
                                <td className="font-bold pr-2">Account Holder</td>
                                <td className="italic">John Doe</td>
                            </tr>
                            <tr>
                                <td className="font-bold pr-2">Email</td>
                                <td className="italic">gE7oC@example.com</td>
                            </tr>
                        </table>
                    </div>
                </div>


                <div className="w-full pt-4">
                    <button className="border-2 border-violet-600 text-violet-400 px-6 py-2 rounded w-full">Continue</button>
                </div>

            </div>
        </>
    )
}

export default Login