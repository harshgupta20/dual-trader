const axios = require('axios');
const ZERODHA_API_DEFINITIONS = require('../utils/zerodhaApi');
const { generateSHA256Checksum } = require('../utils/helperFunction');
const { signToken } = require('../utils/jwt');
const { createZerodhaSession } = require('../utils/zerodhaFunctions');
require('dotenv').config();

module.exports = {
    login: async (req, res) => {
        try {
            const { api_key, api_secret, request_token, account_type } = req.body;

            if (!request_token) {
                return res.status(400).send('request_token is required');
            }

            const response = await createZerodhaSession({api_key, api_secret, request_token});
            
            if (response?.data?.status === "success") {
                const userInfo = {
                    user_type: response.data.data.user_type,
                    email: response.data.data.email,
                    full_name: response.data.data.user_name,
                    user_shortname: response.data.data.user_shortname,
                    exchanges: response.data.data.exchanges,
                    products: response.data.data.products,
                    order_types: response.data.data.order_types,
                    avatar_url: response.data.data.avatar_url,
                    user_id: response.data.data.user_id,
                    access_token: response.data.data.access_token,
                    public_token: response.data.data.public_token,
                    refresh_token: response.data.data.refresh_token,
                    enctoken: response.data.data.enctoken,
                    login_time: response.data.data.login_time,
                }
                const token = signToken({ token: userInfo });

                return res.send({
                    message: "Login successful",
                    success: true,
                    data: {
                        userInfo,
                        token
                    }
                });
            }
            return res.status(response?.data?.status).send(response?.data?.message);
        }
        catch (error) {
            console.log("Error in zerodha login ->", error?.message);
            res.status(500).send(error.message);
        }
    }
}