const axios = require('axios');
const ZERODHA_API_DEFINITIONS = require('../utils/zerodhaApi');
const { generateSHA256Checksum } = require('../utils/helperFunction');
require('dotenv').config();

module.exports = {
    login: async (req, res) => {
        try {
            const { request_token } = req.body;

            if (!request_token) {
                return res.status(400).send('request_token is required');
            }

            const ZERODHA_API_KEY = process.env.ZERODHA_API_KEY;
            const ZERODHA_API_SECRET = process.env.ZERODHA_API_SECRET;
            const zerodha_checksum = await generateSHA256Checksum(ZERODHA_API_KEY + request_token + ZERODHA_API_SECRET);

            const zerodha_api_body = {
                api_key: ZERODHA_API_KEY,
                request_token: request_token,
                checksum: zerodha_checksum
            }

            // const response = await axios.post(ZERODHA_API_DEFINITIONS.GET_ACCESS_TOKEN.URL, zerodha_api_body);
            const response = await axios.post(
                ZERODHA_API_DEFINITIONS.GET_ACCESS_TOKEN.URL,
                new URLSearchParams(zerodha_api_body),
                {
                    headers: {
                        'X-Kite-Version': '3',
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                }
            );
            res.send({
                message: "Login successful",
                success: true,
                data: response.data
            });
        }
        catch (error) {
            console.log("Error in zerodha login ->", error);
            res.status(500).send(error.message);
        }
    }
}