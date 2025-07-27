const { readCSVToJsonFromRootFolder } = require("../utils/helperFunction");
const { getLTP, setFilteredInstrumentsFuturesLocally } = require("../utils/zerodhaFunctions");

module.exports = {
    getLTP: async (req, res) => {
        try {
            const { access_token, instruments, api_key } = req.body;
            if (!access_token || !instruments || !Array.isArray(instruments) || instruments.length === 0) {
                return res.status(400).json({ success: false, error: "Missing access_token or instruments" });
            }

            const response = await getLTP({ access_token, instruments, api_key });
            if (!response.success) {
                return res.status(500).json({ success: false, message: response.message || "Failed to fetch LTP" });
            }

            res.status(200).json({ success: true, data: response?.data });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },

    setInstrumentsFuturesLocally: async (req, res) => {
        try {
            const { access_token, api_key } = req.body;
            if (!access_token || !api_key) {
                return res.status(400).json({ success: false, error: "Missing access_token or instruments" });
            }

            const response = await setFilteredInstrumentsFuturesLocally({ access_token, api_key })

            if (response.success) {
                res.status(200).json({ success: true, data: response.data });
            }
            else {
                res.status(500).json({ success: false, error: response.error || "Failed to set instruments futures locally" });
            }
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },

    getInstrumentsList: async (req, res) => {
        try {
            const { access_token, api_key, search_term } = req.body;
            if (!access_token || !api_key) {
                return res.status(400).json({ success: false, error: "Missing access_token or instruments" });
            };
            if (search_term && (typeof search_term !== 'string' && search_term !== "number")) {
                return res.status(400).json({ success: false, error: "search_term must be a string or number" });
            };

            const response = await readCSVToJsonFromRootFolder('instruments-nse-bse-eq.csv');

            if (response.success) {
                if (search_term) {
                    response.data = response.data.filter(instrument => (instrument.name.toLowerCase().includes(search_term.toLowerCase()) || instrument.tradingsymbol.toLowerCase().includes(search_term.toLowerCase())));
                }
                res.status(200).json({ success: true, data: response.data });
            }
            else {
                res.status(500).json({ success: false, error: response.error || "Failed to get instruments" });
            };
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },
}