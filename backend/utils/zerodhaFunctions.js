const { generateSHA256Checksum } = require('./helperFunction');
const axios = require('axios');
const logger = require('./winstonLogger');
const csv = require('csv-parser');
const { createObjectCsvWriter } = require('csv-writer');
const fs = require('fs');
const path = require('path');

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

const getZerodhaProfile = async ({ access_token, api_key }) => {
  if (!access_token) throw new Error('Missing access_token');

  try {
    logger.info('Fetching Zerodha profile | access_token provided');

    const response = await axios.get('https://api.kite.trade/user/profile', {
      headers: {
        'X-Kite-Version': '3',
        'Authorization': `token ${api_key}:${access_token}`,
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
  api_key,
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
          'Authorization': `token ${api_key}:${access_token}`,
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

const getZerodhaQuote = async ({ access_token, instruments, api_key }) => {
  if (!access_token || !instruments?.length) {
    throw new Error('Missing access_token or instruments');
  }

  try {
    logger.info('Fetching Zerodha quote | instruments: %o', instruments);
    const query = instruments.map(i => `i=${encodeURIComponent(i)}`).join('&');

    const response = await axios.get(`https://api.kite.trade/quote?${query}`, {
      headers: {
        'X-Kite-Version': '3',
        'Authorization': `token ${api_key}:${access_token}`,
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

const getPortfolioHoldings = async ({ access_token, api_key }) => {
  try {
    logger.info('Getting portfolio holdings');

    const response = await axios.get('https://api.kite.trade/portfolio/holdings', {
      headers: {
        'X-Kite-Version': '3',
        'Authorization': `token ${api_key}:${access_token}`
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
  product,
  buyAccountInfo,
  sellAccountInfo,
}) => {

  try {
    console.log("harsh tradingsymbol", tradingsymbol, quantity, exchange, buyAccountInfo, sellAccountInfo, product);
    // const returningResponse = {
    //   success: false,
    //   error: 'Something went wrong',
    //   data: {
    //     tradeInfo: {
    //       tradingsymbol,
    //       exchange,
    //       quantity,
    //       product,
    //     },
    //     buyInstrumentResult: { success: false, data: { order_id: null, buyAccountInfo } },
    //     buyInstrumentResultWithStoploss: { success: true, data: { order_id: null, buyAccountInfo } },
    //     sellInstrumentResult: { success: false, data: { order_id: null }, sellAccountInfo },
    //     sellInstrumentResultWithStoploss: { success: true, data: { order_id: null, sellAccountInfo } },
    //   },
    // }


    let buyStoplossIntrumentResponse;
    let buyIntrumentResponse;
    let sellIntrumentResponse;
    let sellStoplossIntrumentResponse;

    buyIntrumentResponse = await buySellInstrument({
      access_token: buyAccountInfo.access_token,
      api_key: buyAccountInfo.api_key,
      tradingsymbol,
      exchange,
      transaction_type: 'BUY',
      order_type: 'LIMIT',
      quantity,
      product: product,
      price: buyAccountInfo.price,
      validity: 'DAY',
    });

    if (buyIntrumentResponse?.success === true) {
      buyStoplossIntrumentResponse = await stoplossOrder({
        access_token: buyAccountInfo.access_token,
        api_key: buyAccountInfo.api_key,
        tradingsymbol,
        exchange,
        transaction_type: 'SELL',
        order_type: 'SL', // OR use 'SL' if you want to define
        quantity,
        product: product,
        price: buyAccountInfo.stopLoss,
        trigger_price: buyAccountInfo.stopLoss,
        validity: 'DAY',
      });
    }
    if (buyStoplossIntrumentResponse?.success === true) {
      sellIntrumentResponse = await buySellInstrument({
        access_token: sellAccountInfo.access_token,
        api_key: sellAccountInfo.api_key,
        tradingsymbol,
        exchange,
        transaction_type: 'SELL',
        order_type: 'SL-M',
        quantity,
        product: product,
        price: sellAccountInfo.price,
        validity: 'DAY',
      });
    }
    if (sellIntrumentResponse?.success === true) {
      // return { success: false, error: sellIntrumentResponse.error };
      sellStoplossIntrumentResponse = await stoplossOrder({
        access_token: sellAccountInfo.access_token,
        api_key: sellAccountInfo.api_key,
        tradingsymbol,
        exchange,
        transaction_type: 'BUY',
        order_type: 'SL', // OR use 'SL' if you want to define trigger + price
        quantity,
        product: product,
        price: sellAccountInfo.stopLoss,
        trigger_price: sellAccountInfo.stopLoss,
        validity: 'DAY',
      });
    }

    return {
      success: true,
      data: {
        tradeInfo: {
          tradingsymbol,
          exchange,
          quantity,
          product,
        },
        buyInstrumentResult: { ...buyIntrumentResponse, buyAccountInfo },
        buyInstrumentResultWithStoploss: { ...buyStoplossIntrumentResponse, buyAccountInfo },
        sellInstrumentResult: { ...sellIntrumentResponse, sellAccountInfo },
        sellInstrumentResultWithStoploss: { ...sellStoplossIntrumentResponse, sellAccountInfo },
      },
      message: 'Buy Sell order completed.',
    };

  } catch (error) {
    logger.error('Error placing Nifty Future limit buy with SL | %o', error?.response?.data || error?.message);
    return { success: false, error: error?.response?.data || error?.message };
  }
};

const buySellInstrument = async ({ access_token, api_key, tradingsymbol, exchange, transaction_type, order_type, quantity, product, price, validity }) => {
  try {
    const response = await axios.post('https://api.kite.trade/orders/regular',
      new URLSearchParams({
        tradingsymbol: tradingsymbol,
        exchange: exchange,
        transaction_type: transaction_type,
        order_type: 'LIMIT',
        quantity: quantity,
        product: product,
        price: price, // Example price
        validity: 'DAY',
      }),
      {
        headers: {
          'X-Kite-Version': '3',
          'Authorization': `token ${api_key}:${access_token}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      });

    if (response?.data?.status === 'success') {
      logger.info('Buy order placed successfully | order_id: %s', response.data.data.order_id);
      return { success: true, data: response.data.data };
    }
    else {
      logger.error('Failed to place buy order | error: %o', response.data);
      return { success: false, error: response.data };
    }
  }
  catch (error) {
    logger.error('Error placing buy instrument | %o', error?.response?.data || error?.message);
    return { success: false, error: error?.response?.data || error?.message };
  }
}

const stoplossOrder = async ({ access_token, api_key, tradingsymbol, exchange, transaction_type, order_type, quantity, product, price }) => {
  try {
    const response = await axios.post(
      'https://api.kite.trade/orders/regular',
      new URLSearchParams({
        tradingsymbol,
        exchange,
        transaction_type: 'SELL',
        order_type: 'SL', // OR use 'SL' if you want to define trigger + price
        trigger_price: price.toString(),
        price: price.toString(),
        quantity: quantity.toString(),
        product: product,
        validity: 'DAY',
      }),
      {
        headers: {
          'X-Kite-Version': '3',
          'Authorization': `token ${api_key}:${access_token}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      }
    );

    if (response?.data?.status === 'success') {
      logger.info('Stop-loss order placed successfully | order_id: %s', response.data.data.order_id);
      return { success: true, data: response.data.data };
    } else {
      logger.error('Failed to place stop-loss order | error: %o', response.data);
      return { success: false, error: response.data };
    }
  } catch (error) {
    logger.error('Error placing stop-loss order | %o', error?.response?.data || error?.message);
    return { success: false, error: error?.response?.data || error?.message };
  }
};

const getHistoricalData = async (api_key, access_token, instrumentToken, interval, from, to) => {
  /**
 * Fetches historical data from Kite API for a given instrument.
 *
 * @param {string} accessToken - User access token
 * @param {string} instrumentToken - The instrument token (e.g., 5633 for NIFTY)
 * @param {string} interval - Data interval (e.g., 'minute', '5minute', 'day')
 * @param {string} from - Start datetime in format 'YYYY-MM-DD HH:mm:ss'
 * @param {string} to - End datetime in format 'YYYY-MM-DD HH:mm:ss'
 */
  try {
    const url = `https://api.kite.trade/instruments/historical/${instrumentToken}/${interval}?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`;

    const response = await axios.get(url, {
      headers: {
        'X-Kite-Version': '3',
        'Authorization': `token ${api_key}:${access_token}`
      }
    });
    if (response?.data?.status === 'success') {
      logger.info('Stop-loss order placed successfully | order_id: %s', response.data.data.order_id);
      return { success: true, data: response.data.data };
    } else {
      logger.error('Failed to place stop-loss order | error: %o', response.data);
      return { success: false, error: response.data };
    }

  } catch (error) {
    logger.error('Error fetching historical data | %o', error?.response?.data || error?.message);
    return { success: false, error: error?.response?.data || error?.message };
  }
};

const setInstrumentsFullDumpLocally = async ({ api_key, access_token }) => {
  try {
    const headers = {
      'X-Kite-Version': '3',
      'Authorization': `token ${api_key}:${access_token}`
    };

    const outputPath = path.join(__dirname, '..', 'zerodha_instruments_fut.csv');

    const response = await axios.get('https://api.kite.trade/instruments', {
      headers,
      responseType: 'stream' // We'll stream the file
    });

    // Create a write stream
    const writeStream = fs.createWriteStream(outputPath);

    // Pipe the response directly (no gunzip needed)
    response.data.pipe(writeStream);

    // Wrap stream completion in a promise
    await new Promise((resolve, reject) => {
      writeStream.on('finish', resolve);
      writeStream.on('error', reject);
    });

    logger.info('✅ instruments.csv saved at %s', outputPath);
    return { success: true, data: outputPath };

  } catch (error) {
    logger.error('❌ Error saving instruments futures | %o', error?.response?.data || error?.message);
    return { success: false, error: error?.response?.data || error?.message };
  }
};

const setFilteredInstrumentsFuturesLocally = async ({ api_key, access_token }) => {
  try {
    const headers = {
      'X-Kite-Version': '3',
      'Authorization': `token ${api_key}:${access_token}`
    };

    const filteredCsvPath = path.join(__dirname, '..', 'zerodha_instruments_fut_filtered.csv');

    // Step 1: Get the response stream directly
    const response = await axios.get('https://api.kite.trade/instruments', {
      headers,
      responseType: 'stream'
    });

    const filteredData = [];

    // Step 2: Pipe the stream and apply filters
    await new Promise((resolve, reject) => {
      response.data
        .pipe(csv())
        .on('data', (row) => {
          if (row.name.includes('NIFTY') && row.instrument_type === 'FUT' && row.exchange === 'NFO') {
            filteredData.push(row);
          }
        })
        .on('end', resolve)
        .on('error', reject);
    });

    logger.info(`✅ Filtered ${filteredData.length} futures instruments`);

    // Step 3: Save the filtered data
    if (filteredData.length > 0) {
      const csvWriter = createObjectCsvWriter({
        path: filteredCsvPath,
        header: Object.keys(filteredData[0]).map((key) => ({ id: key, title: key }))
      });

      await csvWriter.writeRecords(filteredData);
      logger.info('✅ Filtered futures CSV saved at %s', filteredCsvPath);
    } else {
      logger.warn('⚠️ No matching futures instruments found to write.');
    }

    return { success: true, data: filteredCsvPath };

  } catch (error) {
    logger.error('❌ Error in filtering and saving futures instruments | %o', error?.response?.data || error?.message);
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
  getLTP,
  getHistoricalData,
  setInstrumentsFullDumpLocally,
  setFilteredInstrumentsFuturesLocally
};
