const { getLTP } = require("../utils/zerodhaFunctions");

module.exports = {
    getLTP: async (req, res) => {
        try {
            const { access_token, instruments, api_key } = req.body;
            if (!access_token || !instruments || !Array.isArray(instruments) || instruments.length === 0) {
                return res.status(400).json({ success: false, error: "Missing access_token or instruments" });
            }

            const response = await getLTP({ access_token, instruments, api_key });
            if (!response.success) {
                return res.status(500).json({ success: false, message: response.message || "Failed to fetch LTP" });
            }
            
            res.status(200).json({ success: true, data: response?.data });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
}