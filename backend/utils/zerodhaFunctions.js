const { generateSHA256Checksum } = require('./helperFunction');
const axios = require('axios');
const logger = require('./winstonLogger');
const csv = require('csv-parser');

// const ZERODHA_ACCOUNT1_API_KEY = process.env.ZERODHA_ACCOUNT1_API_KEY;
// const ZERODHA_ACCOUNT1_API_SECRET = process.env.ZERODHA_ACCOUNT1_API_SECRET;

const ZERODHA_ACCOUNT1_API_KEY = process.env.ZERODHA_ACCOUNT2_API_KEY;
const ZERODHA_ACCOUNT1_API_SECRET = process.env.ZERODHA_ACCOUNT2_API_SECRET;

const createZerodhaSession = async ({ api_key, request_token, api_secret }) => {
  try {
    logger.info('Initiating Zerodha session creation | request_token: %s', request_token);

    const checksum = await generateSHA256Checksum(api_key + request_token + api_secret);
    logger.debug('Generated checksum: %s', checksum);

    const response = await axios.post('https://api.kite.trade/session/token',
      new URLSearchParams({
        api_key: api_key,
        request_token,
        checksum,
      }),
      {
        headers: {
          'X-Kite-Version': '3',
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

    logger.info('Zerodha session created | status: %d | user_id: %s', response.status, response.data?.data?.user_id);
    return { success: true, data: response.data };
  } catch (error) {
    logger.error('Zerodha session creation failed | request_token: %s | error: %o', request_token, error.response?.data || error.message);
    throw error;
  }
};

const getZerodhaProfile = async ({ access_token }) => {
  if (!access_token) throw new Error('Missing access_token');

  try {
    logger.info('Fetching Zerodha profile | access_token provided');

    const response = await axios.get('https://api.kite.trade/user/profile', {
      headers: {
        'X-Kite-Version': '3',
        'Authorization': `token ${ZERODHA_ACCOUNT1_API_KEY}:${access_token}`,
      },
    });

    logger.info('Zerodha profile fetched | status: %d | user_id: %s', response.status, response.data?.data?.user_id);
    return { success: true, data: response.data };
  } catch (error) {
    logger.error('Failed to fetch Zerodha profile | error: %o', error.response?.data || error.message);
    return { success: false, error: error.response?.data || 'Failed to fetch profile' };
  }
};

const placeZerodhaOrder = async ({
  access_token,
  tradingsymbol,
  exchange,
  transaction_type,
  order_type,
  quantity,
  product,
  price = 0,
}) => {
  if (!access_token) throw new Error('Missing access_token');

  if (product === 'CNC') {
    if (!price) throw new Error('Missing price');
  }

  try {
    logger.info('Placing Zerodha order | %o', {
      tradingsymbol,
      exchange,
      transaction_type,
      order_type,
      quantity,
      product,
      price,
    });

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
          'Authorization': `token ${ZERODHA_ACCOUNT1_API_KEY}:${access_token}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    logger.info('Zerodha order placed | order_id: %s | status: %d', response.data?.data?.order_id, response.status);
    return { success: true, data: response.data };
  } catch (error) {
    logger.error('Order placement failed | tradingsymbol: %s | error: %o', tradingsymbol, error.response?.data || error.message);
    return { success: false, error: error.response?.data || 'Order placement failed' };
  }
};

const getZerodhaQuote = async ({ access_token, instruments }) => {
  if (!access_token || !instruments?.length) {
    throw new Error('Missing access_token or instruments');
  }

  try {
    logger.info('Fetching Zerodha quote | instruments: %o', instruments);
    const query = instruments.map(i => `i=${encodeURIComponent(i)}`).join('&');

    const response = await axios.get(`https://api.kite.trade/quote?${query}`, {
      headers: {
        'X-Kite-Version': '3',
        'Authorization': `token ${ZERODHA_ACCOUNT1_API_KEY}:${access_token}`,
      },
    });

    logger.info('Quote fetched | instruments: %d | status: %d', instruments.length, response.status);
    return { success: true, data: response.data.data };
  } catch (error) {
    logger.error('Quote fetch failed | instruments: %o | error: %o', instruments, error.response?.data || error.message);
    return { success: false, error: error.response?.data || 'Failed to fetch real-time quote' };
  }
};

const getLTP = async ({ api_key, access_token, instruments = [] }) => {
  try {
    logger.info('Getting LTP | instrument: %s', instruments);

    const instrumentsQuery = instruments.map(i => `i=${encodeURIComponent(i)}`).join('&');

    const response = await axios.get(`https://api.kite.trade/quote/ohlc?${instrumentsQuery}`, {
      headers: {
        'X-Kite-Version': '3',
        'Authorization': `token ${api_key}:${access_token}`,
      },
    });


    if (response?.data?.status !== "success") {
      logger.warn('No data received for instruments: %s', instruments);
      return { success: false, message: response?.data?.message || 'No data received' };
    }

    logger.info('LTP received | instrument: %s | price: %d', instruments);

    return { success: true, data: response?.data?.data || null };
  } catch (error) {
    logger.error('LTP fetch failed | instrument: %s | error: %o', instruments, error.response?.data || error.message);
    throw new Error('Failed to fetch LTP');
  }
};

const placeNiftyFutureOrderWithStopLoss = async ({ api_key, access_token }) => {
  const instrument = 'NFO:NIFTY23JUNFUT';

  try {
    logger.info('Placing Nifty Future order with SL | instrument: %s', instrument);

    const currentPrice = await getLTP({ api_key, access_token, instruments: [instrument] });
    const stopLossPrice = currentPrice - 100;

    logger.debug('Calculated stop loss | currentPrice: %d | stopLoss: %d', currentPrice, stopLossPrice);

    const response = await axios.post('https://api.kite.trade/orders/co',
      new URLSearchParams({
        tradingsymbol: 'NIFTY23JUNFUT',
        exchange: 'NFO',
        transaction_type: 'BUY',
        quantity: '1',
        product: 'MIS',
        order_type: 'MARKET',
        stoploss: stopLossPrice.toString(),
        variety: 'co',
      }),
      {
        headers: {
          'X-Kite-Version': '3',
          'Authorization': `token ${api_key}:${access_token}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    logger.info('Nifty Future order placed | order_id: %s | status: %d', response.data?.data?.order_id, response.status);
    return { success: true, data: response.data };
  } catch (error) {
    logger.error('Nifty Future order failed | error: %o', error.response?.data || error.message);
    return { success: false, error: error.message };
  }
};

const getPortfolioHoldings = async ({ access_token }) => {
  try {
    logger.info('Getting portfolio holdings');

    const response = await axios.get('https://api.kite.trade/portfolio/holdings', {
      headers: {
        'X-Kite-Version': '3',
        'Authorization': `token ${ZERODHA_ACCOUNT1_API_KEY}:${access_token}`
      }
    });

    logger.info('Holdings fetched | count: %d', response.data?.data?.length || 0);
    return { success: true, data: response.data.data };
  } catch (error) {
    logger.error('Holdings fetch failed | error: %o', error.response?.data || error.message);
    return { success: false, error: error.message };
  }
};

const GetFutureNiftyAndBankNiftyExpiry = async () => {
  try {
    const response = await axios({
      method: 'get',
      url: 'https://api.kite.trade/instruments',
      responseType: 'stream',
    });

    return new Promise((resolve, reject) => {
      const results = [];
      response.data
        .pipe(csv())
        .on('data', (data) => {
          let isNiftyOrBankNifty = (data) => (data?.name?.toLowerCase() === 'nifty');
          let isInstrumentTypeFuture = (data) => (data?.instrument_type?.toLowerCase() === 'fut');
          let isExchangeNFO = (data) => (data?.exchange?.toLowerCase() === 'nfo');
          let isSegmentFutures = (data) => (data?.segment === 'NFO-FUT');
          if (isNiftyOrBankNifty(data) && isInstrumentTypeFuture(data) && isExchangeNFO(data) && isSegmentFutures(data)) {
            results.push({
              tradingsymbol: data.tradingsymbol,
              exchange: data.exchange,
              name: data.name,
              instrument_type: data.instrument_type,
              segment: data.segment,
              last_price: data.last_price,
              expiry: data.expiry,
              lot_size: data.lot_size,
            });
          }
        })
        .on('end', () => resolve(results))
        .on('error', reject)
    });
  }
  catch (error) {
    logger.error('Failed to fetch instruments | error: %o', error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message || 'Failed to fetch instruments' };
  }
}

const placeBuySellIntrumentWithStoploss = async ({
  tradingsymbol,
  quantity,
  exchange,
  buyAccountInfo,
  sellAccountInfo,
}) => {

  try {
    // logger.info('Placing Nifty Future LIMIT BUY | symbol: %s | price: %d | qty: %d', tradingsymbol);

    // const instrument = `${exchange}:${tradingsymbol}`;
    // const stopLossPoints = 100;
    // const instrumentLtpResponse = await getLTP({ access_token, api_key, instruments: [instrument] });

    // if(instrumentLtpResponse?.success === false) {
    //   throw new Error(instrumentLtpResponse?.error);
    // }

    // const currentPrice = instrumentLtpResponse?.data[instrument]?.last_price;

    // if (currentPrice === undefined || currentPrice === null || !currentPrice) {
    //   throw new Error('Failed to fetch current price');
    // }

    // logger.debug('Current price fetched | instrument: %s | price: %d', instrument, currentPrice);
    // Calculate stop loss price for BUY order
    // const stopLossPrice = currentPrice - stopLossPoints;


    const buyResponse = await axios.post(
      'https://api.kite.trade/orders/regular',
      new URLSearchParams({
        tradingsymbol,
        exchange,
        transaction_type: 'BUY',
        order_type: 'LIMIT',
        quantity: quantity.toString(),
        product: "MIS", // or 'MIS' for intraday
        price: currentPrice.toString(),
        validity: 'DAY',
      }),
      {
        headers: {
          'X-Kite-Version': '3',
          'Authorization': `token ${ZERODHA_ACCOUNT1_API_KEY}:${access_token}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      }
    );


    // logger.info('Buy LIMIT order placed | order_id: %s', buyResponse.data.data.order_id);
    // console.log("harsh bought future ", buyResponse);

    // You might want to wait for order to be executed before placing SL
    // logger.info('Placing Stop-Loss SELL order at trigger: %d', stopLossPrice);

    const slResponse = await axios.post(
      'https://api.kite.trade/orders/regular',
      new URLSearchParams({
        tradingsymbol,
        exchange,
        transaction_type: 'SELL',
        order_type: 'SL-M', // OR use 'SL' if you want to define trigger + price
        trigger_price: "25540",
        quantity: quantity.toString(),
        product: 'MIS',
        validity: 'DAY',
      }),
      {
        headers: {
          'X-Kite-Version': '3',
          'Authorization': `token ${ZERODHA_ACCOUNT1_API_KEY}:${access_token}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      }
    );

    // logger.info('Stop-Loss SELL order placed | order_id: %s', slResponse.data.data.order_id);

    return {
      success: true,
      data: {
        // buyOrderId: buyResponse.data.data.order_id,
        // stopLossOrderId: slResponse.data.data.order_id,
        currentPrice,
        // stopLossPrice,

      },
      message: 'Nifty Future LIMIT BUY order placed successfully with Stop-Loss',
    };

  } catch (error) {
    logger.error('Error placing Nifty Future limit buy with SL | %o', error?.response?.data || error?.message);
    return { success: false, error: error?.response?.data || error?.message };
  }
};


module.exports = {
  createZerodhaSession,
  placeZerodhaOrder,
  getZerodhaProfile,
  getZerodhaQuote,
  placeNiftyFutureOrderWithStopLoss,
  getPortfolioHoldings,
  GetFutureNiftyAndBankNiftyExpiry,
  placeBuySellIntrumentWithStoploss,
  getLTP
};
