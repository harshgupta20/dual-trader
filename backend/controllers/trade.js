const { getPortfolioHoldings, placeZerodhaOrder, GetFutureNiftyAndBankNiftyExpiry, placeNiftyFutureLimitBuyWithStopLoss } = require("../utils/zerodhaFunctions");


module.exports = {
    getPortfolio: async (req, res) => {
        try {
            const { access_token } = req.body;
            if (!access_token) {
                return res.status(400).json({ success: false, error: "Missing access_token" });
            }
            const response = await getPortfolioHoldings({ access_token });

            res.status(200).json({ success: true, data: response?.data });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },

    placeOrder: async (req, res) => {
        try {
            const { access_token } = req.body;
            if (!access_token) {
                return res.status(400).json({ success: false, error: "Missing access_token" });
            }


            if (!req.body.tradingsymbol || !req.body.exchange || !req.body.transaction_type || !req.body.order_type || !req.body.quantity || !req.body.product || !req.body.price) {
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

            const response = await placeZerodhaOrder({ ...body });

            if (response.success) {
                return res.status(200).json({ success: true, data: response.data, payload: body });
            }
            else {
                return res.status(500).json({ success: false, error: response.error });
            }
        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },

    companyList: async (req, res) => {
        try {
            // const { access_token } = req.body;
            // if (!access_token) {
            //     return res.status(400).json({ success: false, error: "Missing access_token" });
            // }

            const response = await GetFutureNiftyAndBankNiftyExpiry();

            if (response) {
                return res.status(200).json({ success: true, data: response });
            }
            else {
                return res.status(500).json({ success: false, error: response.error });
            }
        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },

    buyFutureAndStoploss: async (req, res) => {
        try {
            const { access_token } = req.body;
            if (!access_token) {
                return res.status(400).json({ success: false, error: "Missing access_token" });
            }

            const payload = {
                access_token: req.body.access_token,
                tradingsymbol: req.body.tradingsymbol,
                exchange: req.body.exchange || 'NFO',
                quantity: req.body.quantity || 1
            }

            const response = await placeNiftyFutureLimitBuyWithStopLoss({
                ...payload
            });

            if (response) {
                return res.status(200).json({ success: true, data: response });
            }
            else {
                return res.status(500).json({ success: false, error: response.error });
            }
        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
}