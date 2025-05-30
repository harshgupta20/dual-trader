const ZERODHA_API_DEFINITIONS = {
    GET_ACCESS_TOKEN: {
        METHOD: 'POST',
        URL: 'https://api.kite.trade/session/token',
        BODY: ["api_key", "request_token", "checksum"]
    }
}


module.exports = ZERODHA_API_DEFINITIONS;