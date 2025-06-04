import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import FutureIndex from "./pages/FutureIndex";
import Navbar from "./components/Navbar";
import AuthContext from "./context/Auth";
import { useEffect, useState } from "react";
import ProtectedRoute from "./components/ProtectedRoute";
import Account1 from "./pages/zerodhaAuth/Account1";
import { Toaster } from 'sonner';
import Profile from "./pages/Profile";
import localStorageHelper from "./utils/localstorage";
import DualOrder from "./pages/DualOrder";
import Account2 from "./pages/zerodhaAuth/Account2";


const App = () => {

  const [authenticationInfo, setAuthenticationInfo] = useState({});

  useEffect(() => {
    const authInfo = localStorageHelper.get('accounts');
    if (authInfo) {
      setAuthenticationInfo(authInfo)
    }
  }, []);

  return (
    <>
      <AuthContext.Provider value={{ authenticationInfo, setAuthenticationInfo }}>
        <div className=" min-h-screen h-screen">
          <Navbar />
          <div className="p-4 h-[92dvh]">
            <Routes>
              <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
              <Route path="/login" >
                <Route index element={<Login />} />
                <Route path="account1" element={<Account1 />} />
                <Route path="account2" element={<Account2 />} />
              </Route>
              <Route path="/future-index" element={<ProtectedRoute><FutureIndex /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/dual-order" element={<ProtectedRoute><DualOrder /></ProtectedRoute>} />
            </Routes>
          </div>
        </div>


        <Toaster position="bottom" richColors duration={2000} />
      </AuthContext.Provider>
    </>
  )
}

export default App