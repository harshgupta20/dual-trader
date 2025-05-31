const { getPortfolioHoldings } = require("../utils/zerodhaFunctions");


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
    }
}