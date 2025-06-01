const axios = require('axios');
const ZERODHA_API_DEFINITIONS = require('../utils/zerodhaApi');
require('dotenv').config();

module.exports = {
    getProfile: async (req, res) => {
        try {
            const {access_token} = req.body;

            const API_KEY = process.env.ZERODHA_ACCOUNT1_API_KEY;

            const response = await axios.get(
                ZERODHA_API_DEFINITIONS.GET_PROFILE.URL,
                {
                    headers: {
                        'X-Kite-Version': '3',
                        "Authorization": `token ${API_KEY}:${access_token}`,
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                }
            );

            if(response?.data?.status === "success") {
                res.status(200).json({ success: true, data: response?.data?.data });                
            }
            
            res.status(200).json({ success: false, data: response?.data });

        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        } finally {
            // Code to execute regardless of success or failure
        }
    },
}