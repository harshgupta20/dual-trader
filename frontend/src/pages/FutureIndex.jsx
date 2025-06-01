import { useState } from "react";
import FutureIndexTradeCard from "../components/FutureIndexTradeCard";

const FutureIndex = () => {
  const [quantity, setQuantity] = useState("");
  const [buyPrice, setBuyPrice] = useState("");
  const [sellPrice, setSellPrice] = useState("");
  const [buyStopLoss, setBuyStopLoss] = useState("");
  const [sellStopLoss, setSellStopLoss] = useState("");

  // Shared quantity change handler
  const handleQuantityChange = (val) => {
    setQuantity(val);
  };

  // BUY price change logic
  const handleBuyPriceChange = (val) => {
    setBuyPrice(val);
    setBuyStopLoss(val ? val - 100 : "");
    // setSellPrice(val ? val - 100 : "");
  };

  // SELL price change logic
  const handleSellPriceChange = (val) => {
    setSellPrice(val);
    setSellStopLoss(val ? parseFloat(val) + 100 : "");
    // setBuyPrice(val ? parseFloat(val) + 100 : "");
  };

  const placeOrder = () => {};

  return (
    <div className="flex flex-col gap-3 justify-between w-full h-full">
      <div className="flex flex-col grow gap-3 overflow-hidden">
        {/* NIFTY PRICE SHOW */}
        <div className="flex flex-col gap-3 max-h-[30%] overflow-scroll">
          <div className="flex justify-between items-center p-4 bg-indigo-500">
            <p className="font-bold">Nifty 50</p>
            <p>90387</p>
          </div>
          <div className="flex justify-between items-center p-4 bg-indigo-500">
            <p className="font-bold">Nifty Future May</p>
            <p>90387</p>
          </div>
        </div>

        <div className="flex flex-col gap-3 max-h-[70%] overflow-scroll">
          <FutureIndexTradeCard
            type="buy"
            title="Future Index Future (BUY)"
            quantity={quantity}
            onQuantityChange={handleQuantityChange}
            price={buyPrice}
            onPriceChange={handleBuyPriceChange}
            stopLoss={buyStopLoss}
            setStopLoss={setBuyStopLoss}
            orderStatus={null}
            tradedValue={9098}
          />

          <FutureIndexTradeCard
            type="sell"
            title="Future Index Future (SELL)"
            quantity={quantity}
            onQuantityChange={handleQuantityChange}
            price={sellPrice}
            onPriceChange={handleSellPriceChange}
            stopLoss={sellStopLoss}
            setStopLoss={setSellStopLoss}
            orderStatus={null}
            tradedValue={9098}
          />
        </div>
      </div>

      <button className="bg-indigo-500 p-2 rounded">Place Order</button>
    </div>
  );
};

export default FutureIndex;
