import { useContext } from "react"
import AuthContext from "../context/Auth"

const Navbar = () => {

    const { authenticationInfo, setAuthenticationInfo } = useContext(AuthContext)

    const handleLogout = () => {
        localStorage.removeItem('authinfo');
        setAuthenticationInfo({});
    }

    return (
        <nav className='flex justify-between items-center p-2 border-b-2 border-gray-600 h-[8dvh]'>
            <h1 className='font-bold text-1xl'>EZ Trade</h1>

            {authenticationInfo?.token && (
                <ul>
                    <li onClick={handleLogout} className='cursor-pointer bg-red-800 px-4 py-2 rounded'>Logout</li>
                </ul>
            )}
        </nav>
    )
}

export default Navbar