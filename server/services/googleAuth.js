import { OAuth2Client } from 'google-auth-library';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

async function verifyGoogleToken(googleId_token) {
    try {
        const ticket = await googleClient.verifyIdToken({
            idToken: googleId_token,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        const payload = ticket.getPayload();

        if (!payload) {
            return null;
        }

        return {
            googleId: payload.sub,
            email: payload.email,
            name: payload.name,
            profileImage: payload.picture,
            emailVerified: payload.email_verified
        };
    } catch (error) {
        console.error("Google token verification error:", error);
        return null;
    }
}

export { verifyGoogleToken };