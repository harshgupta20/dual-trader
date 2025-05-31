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

export const placeZerodhaOrder = async ({
    access_token,
    tradingsymbol,
    exchange,
    transaction_type, // 'BUY' or 'SELL'
    order_type,        // 'MARKET', 'LIMIT', etc.
    quantity,
    product,           // 'MIS', 'CNC', 'NRML'
    price = 0,         // Required for LIMIT orders
}) => {
    if (!access_token) throw new Error('Missing access_token');

    try {
        const response = await axios.post(
            'https://api.kite.trade/orders/regular',
            new URLSearchParams({
                tradingsymbol,
                exchange,
                transaction_type,
                order_type,
                quantity: quantity.toString(),
                product,
                price: price.toString(),
                validity: 'DAY',
            }),
            {
                headers: {
                    'X-Kite-Version': '3',
                    'Authorization': `token ${ZERODHA_API_KEY}:${access_token}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        );

        return { success: true, data: response.data };
    } catch (error) {
        console.error('Error placing order:', error.response?.data || error.message);
        return {
            success: false,
            error: error.response?.data || 'Order placement failed',
        };
    }
};






/**
 * Fetches real-time market data (quote) for one or more instruments from Zerodha.
 *
 * @param {Object} params - Parameters object
 * @param {string} params.access_token - User's Zerodha access token obtained after login
 * @param {string[]} params.instruments - Array of instrument identifiers (e.g., ['NSE:INFY', 'NSE:NIFTY 50'])
 *                                        Each instrument string specifies the exchange and symbol,
 *                                        like 'NSE:INFY' for Infosys stock or 'NSE:NIFTY 50' for Nifty index.
 *
 * @returns {Promise<Object>} - Resolves with real-time quote data for requested instruments.
 */
export const getZerodhaQuote = async ({ access_token, instruments }) => {
    if (!access_token || !instruments?.length) {
        throw new Error('Missing access_token or instruments');
    }

    try {
        const query = instruments.map(i => `i=${encodeURIComponent(i)}`).join('&');

        const response = await axios.get(
            `https://api.kite.trade/quote?${query}`,
            {
                headers: {
                    'X-Kite-Version': '3',
                    'Authorization': `token ${ZERODHA_API_KEY}:${access_token}`,
                },
            }
        );

        return { success: true, data: response.data.data };
    } catch (error) {
        console.error('Error fetching Zerodha quote:', error.response?.data || error.message);
        return {
            success: false,
            error: error.response?.data || 'Failed to fetch real-time quote',
        };
    }
};




export const getLTP = async ({access_token, instrument}) => {
  try {
    const response = await axios.get(`https://api.kite.trade/quote?i=${instrument}`, {
      headers: {
        'X-Kite-Version': '3',
        'Authorization': `token ${ZERODHA_API_KEY}:${access_token}`
      }
    });
    return response.data.data[instrument].last_price;
  } catch (error) {
    throw new Error('Failed to fetch LTP');
  }
};

export const placeNiftyFutureOrderWithStopLoss = async () => {
  const instrument = 'NFO:NIFTY23JUNFUT'; // example instrument token for Nifty Future

  try {
    const currentPrice = await getLTP(instrument);
    const stopLossPrice = currentPrice - 100;

    const response = await axios.post('https://api.kite.trade/orders/co',
      new URLSearchParams({
        tradingsymbol: 'NIFTY23JUNFUT',
        exchange: 'NFO',
        transaction_type: 'BUY',
        quantity: '1',           // set appropriate quantity
        product: 'MIS',          // intraday
        order_type: 'MARKET',
        stoploss: stopLossPrice.toString(),
        variety: 'co',
      }),
      {
        headers: {
          'X-Kite-Version': '3',
          'Authorization': `token ${ZERODHA_API_KEY}:${access_token}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error placing Nifty Future order:', error.response?.data || error.message);
    return { success: false, error: error.message };
  }
};