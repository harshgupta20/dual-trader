import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Accounts from "./pages/Accounts";
import HedgeFuture from "./pages/HedgeFuture";
import HeaderComponent from "./components/HeaderComponent";

const App = () => {
  return (
    <div className="h-screen flex flex-col">
      <HeaderComponent />
      <div className="flex flex-col min-h-0 flex-1 grow overflow-scroll">
        <Routes>
          <Route path="/accounts" element={<Accounts />} />
          <Route path="/hedge-future" element={<HedgeFuture />} />
        </Routes>
      </div>
      <div className="">
        <Navbar />
      </div>
    </div>
  );
};

export default App;