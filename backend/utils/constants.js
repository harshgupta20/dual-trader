const ZERODHA_DATA_CONSTANT = {
    EXCHANGES: {
        "nse": "NSE",
        "bse": "BSE",
        "mcx": "MCX",
        "nfo": "NFO",
        "cfd": "CFD"
    },
    TRANSACTION_TYPES: {
        "buy": "BUY",
        "sell": "SELL"
    },
    ORDER_TYPES: {
        "market": "MARKET",
        "limit": "LIMIT",
        "stoploss": "SL",
        "stoplosslimit": "SL-M",
    },
    PRODUCTS: {
        "mis": "MIS",
        "cnc": "CNC",
        "nrml": "NRML"
    }
}

module.exports = { ZERODHA_DATA_CONSTANT }