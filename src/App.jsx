import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import FutureIndex from "./pages/FutureIndex";
import Navbar from "./components/Navbar";
import AuthContext from "./context/Auth";
import { useEffect, useState } from "react";


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
        <div className="bg-gray-800 min-h-screen text-white">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/future-index" element={<FutureIndex />} />
          </Routes>
        </div>
      </AuthContext.Provider>
    </>
  )
}

export default App