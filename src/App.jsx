import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import FutureIndex from "./pages/FutureIndex";
import Navbar from "./components/Navbar";
import AuthContext from "./context/Auth";
import { useEffect, useState } from "react";
import ProtectedRoute from "./components/ProtectedRoute";


const App = () => {

  const [authenticationInfo, setAuthenticationInfo] = useState({});

  useEffect(() => {
    const authInfo = localStorage.getItem('authinfo');
    if (authInfo) {
      setAuthenticationInfo(authInfo)
    }
  }, [])

  return (
    <>
      <AuthContext.Provider value={{ authenticationInfo, setAuthenticationInfo }}>
        <div className="bg-gray-800 min-h-screen text-white h-screen">
          <Navbar />
          <div className="p-4 h-[92dvh]">
          <Routes>
            <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/login" element={<Login />} />
            <Route path="/future-index" element={<ProtectedRoute><FutureIndex /></ProtectedRoute>} />
          </Routes>
          </div>
        </div>
      </AuthContext.Provider>
    </>
  )
}

export default App