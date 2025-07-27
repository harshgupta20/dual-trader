import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Accounts from "./pages/Accounts";
import BuySellFuture from "./pages/BuySellFuture";
import HeaderComponent from "./components/HeaderComponent";
import { AccountsContext } from "./context/AccountContext";
import { useEffect, useState } from "react";
import AccountCallback from "./pages/AccountCallback";
import Home from "./pages/Home";

const App = () => {
  const [accounts, setAccounts] = useState([]);
  const fetchAccounts = async () => {
    try {
      const strigifiedAccounts = localStorage.getItem("accounts"); // Adjust the API endpoint as needed
      if(strigifiedAccounts) {
        setAccounts(JSON.parse(strigifiedAccounts));
      }
    } catch (error) {
      console.error("Error context accounts:", error);
    }
  };

  useEffect(() => {
    // Fetch accounts from API or local storage 
    fetchAccounts();
  }, []);

  return (

    <AccountsContext.Provider value={{accounts, setAccounts}}>
      <div className="h-screen flex flex-col">
        <HeaderComponent />
        <div className="flex flex-col min-h-0 flex-1 grow overflow-scroll">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/accounts" element={<Accounts />} />
            <Route path="/accounts/auth/callback" element={<AccountCallback />} />

            <Route path="/buy-sell" element={<BuySellFuture />} />
          </Routes>
        </div>
        <div className="">
          <Navbar />
        </div>
      </div>
    </AccountsContext.Provider>
  );
};

export default App;