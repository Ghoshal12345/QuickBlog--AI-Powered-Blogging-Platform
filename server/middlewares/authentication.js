import { verifyToken } from "../services/auth.js";
import User from "../models/user.js";


async function cookieAuthentication(req, res, next) {

    try {
        const { auth_token } = req.cookies;
        if (!auth_token) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        const decoded = verifyToken(auth_token);
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        // Check whether this is still the user's active session
        if (decoded.sessionVersion !== user.sessionVersion) {
            // clear the cookie
            res.clearCookie('auth_token', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict'
            });
            return res.status(401).json({
                code: "SESSION_REPLACED",
                message: "Session expired. You have logged in from another device."
            });
        }

        req.user = user;// here user is mongoDB document
        next();
    } catch (error) {
        console.error("Authentication error:", error);

        return res.status(401).json({
            message: "Invalid or expired authentication token"
        });
    }
}

function adminAuthentication(req, res, next) {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Forbidden" });
    }
    next();
}
export {
    cookieAuthentication,
    adminAuthentication
}