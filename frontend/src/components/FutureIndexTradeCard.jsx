import React from 'react'

const FutureIndexTradeCard = ({
  type,
  title,
  quantity,
  onQuantityChange,
  price,
  onPriceChange,
  stopLoss,
  setStopLoss,
  orderStatus,
  tradedValue
}) => {
  const handleQuantityChange = (e) => {
    onQuantityChange(e.target.value);
  };

  const handlePriceChange = (e) => {
    onPriceChange(e.target.value);
  };

  const handleStopLossChange = (e) => {
    setStopLoss(e.target.value);
  };

  const orderResult = (result = false) => {
    return (
      <div className="p-2">
        {result === "success" && <p className="text-lg font-bold text-green-600">Buy Successful</p>}
        {result === "failed" && <p className="text-lg font-bold text-red-700 bg-white p-1 rounded">Failed</p>}
      </div>
    );
  };

  return (
    <div
      className={`flex flex-col justify-between items-center p-3 border-[2px] border-indigo-400 rounded ${
        orderStatus === "success" && "bg-green-600"
      } ${orderStatus === "failed" && "bg-red-600"}`}
    >
      <div className="w-full text-left pb-3">
        <p className="text-xl">{title}</p>
      </div>

      <div className="flex flex-col gap-3 w-full">
        <div className="flex gap-2">
          <input
            className="w-[30%] p-1 border-[1px] border-indigo-400 rounded"
            placeholder="Quantity"
            type="number"
            value={quantity}
            onChange={handleQuantityChange}
          />
          <input
            className="w-[70%] p-1 border-[1px] border-indigo-400 rounded"
            placeholder="Price"
            type="number"
            value={price}
            onChange={handlePriceChange}
          />
        </div>
        <input
          className="w-full p-1 border-[1px] border-indigo-400 rounded"
          placeholder="Stop Loss"
          type="number"
          value={stopLoss}
          onChange={handleStopLossChange}
        />
      </div>

      <div>
        {orderResult(orderStatus)}
        {orderStatus === "success" && (
          <p className="text-xl">
            Traded Price <span className="text-green-600">{tradedValue}</span>
          </p>
        )}
      </div>
    </div>
  );
};

export default FutureIndexTradeCard;
