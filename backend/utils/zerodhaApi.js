const ZERODHA_API_DEFINITIONS = {
    GET_ACCESS_TOKEN: {
        METHOD: 'POST',
        URL: 'https://api.kite.trade/session/token',
        BODY: ["api_key", "request_token", "checksum"]
    },
    GET_PROFILE: {
        METHOD: 'GET',
        URL: 'https://api.kite.trade/user/profile',
    }
}


module.exports = ZERODHA_API_DEFINITIONS;