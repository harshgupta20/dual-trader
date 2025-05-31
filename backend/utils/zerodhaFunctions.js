import { generateSHA256Checksum } from './helperFunction';

const axios = require('axios');

const ZERODHA_API_KEY = process.env.ZERODHA_API_KEY;
const ZERODHA_API_SECRET = process.env.ZERODHA_API_SECRET;
export const createZerodhaSession = async ({ request_token }) => {
    try {

        const checksum = await generateSHA256Checksum(ZERODHA_API_KEY + request_token + ZERODHA_API_SECRET)

        const response = await axios.post(`https://api.kite.trade/session/token`,
            new URLSearchParams({
                api_key: ZERODHA_API_KEY,
                request_token: request_token,
                checksum: checksum
            }),
            {
                headers: {
                    'X-Kite-Version': '3',
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
        return { success: true, data: response.data };
    } catch (error) {
        console.error('Error creating Zerodha session:', error);
        throw error;
    }
}

export const getZerodhaProfile = async ({ access_token }) => {
    if (!access_token) {
        throw new Error('Missing access_token');
    }

    try {
        const response = await axios.get('https://api.kite.trade/user/profile', {
            headers: {
                'X-Kite-Version': '3',
                'Authorization': `token ${ZERODHA_API_KEY}:${access_token}`,
            },
        });

        return { success: true, data: response.data };
    } catch (error) {
        console.error('Error fetching Zerodha profile:', error.response?.data || error.message);
        return {
            success: false,
            error: error.response?.data || 'Failed to fetch profile',
        };
    }
};
