const db = require("../utils/FirebaseInitiate");

const KillSwitch = async (req, res, next) => {
    let isKillSwitchOn;
    try {
        const timestamp = new Date().toISOString();
        console.log(`[KillSwitch] ${req.method} ${req.url} at ${timestamp}`);

        const snapshot = await db.collection('switches').get();
        const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        isKillSwitchOn = users[0].kill || false; // Toggle this to enable/disable API   
        if (isKillSwitchOn) {
            return res.status(503).json({
                status: 'Service Unavailable',
                message: 'The service is temporarily disabled via kill switch.',
                timestamp,
                users
            });
        }
        else{
            next(); // continue to next middleware or route
        }

    }
    catch (error) {
        console.error(error);
    }
};

module.exports = KillSwitch;
