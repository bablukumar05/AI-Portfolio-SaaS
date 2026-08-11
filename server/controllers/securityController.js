const User = require("../models/User");

// Get security logs and active devices
exports.getSecuritySettings = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select("activeDevices securityLog isTwoFactorEnabled");
        res.status(200).json({ success: true, data: user });
    } catch (error) { next(error); }
};

// Remove a session/device
exports.revokeSession = async (req, res, next) => {
    try {
        const { deviceId } = req.params;
        await User.findByIdAndUpdate(req.user.id, {
            $pull: { activeDevices: { deviceId } }
        });
        res.status(200).json({ success: true, message: "Session revoked successfully" });
    } catch (error) { next(error); }
};

// Helper to log security event
exports.logSecurityEvent = async (userId, event, ip) => {
    await User.findByIdAndUpdate(userId, {
        $push: {
            securityLog: {
                $each: [{ event, ip }],
                $slice: -20 // Keep only last 20 logs
            }
        }
    });
};
