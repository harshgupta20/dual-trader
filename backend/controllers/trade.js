const { getPortfolioHoldings, placeZerodhaOrder } = require("../utils/zerodhaFunctions");


module.exports = {
    getPortfolio : async (req, res) => {
        try{
            const {access_token} = req.body;
            if(!access_token){
                return res.status(400).json({ success: false, error: "Missing access_token" });
            }
            const response = await getPortfolioHoldings({access_token});

            res.status(200).json({ success: true, data: response?.data });
        }
        catch(error){
            res.status(500).json({ success: false, error: error.message });
        }
    },
    placeOrder : async (req, res) => {
        try{
            const {access_token} = req.body;
            if(!access_token){
                return res.status(400).json({ success: false, error: "Missing access_token" });
            }
            
            
            if(!req.body.tradingsymbol || !req.body.exchange || !req.body.transaction_type || !req.body.order_type || !req.body.quantity || !req.body.product || !req.body.price){
                return res.status(400).json({ success: false, error: "Missing required fields" });
            }
           
            const body = {
                access_token,
                tradingsymbol: req.body.tradingsymbol,
                exchange: req.body.exchange,
                transaction_type: req.body.transaction_type,
                order_type: req.body.order_type,
                quantity: req.body.quantity,
                product: req.body.product,
                price: req.body.price
            }

            console.log(body)

            // const response = await placeZerodhaOrder({...body});

            res.status(200).json({ success: true, data: body });
        }
        catch(error){
            res.status(500).json({ success: false, error: error.message });
        }
    }
}