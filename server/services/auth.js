import jwt from 'jsonwebtoken';

function verifyToken(token) {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    return decoded;
}

function generateToken(userId, role, sessionVersion) {
    const token = jwt.sign(
        {
            userId,
            role,
            sessionVersion
        },
        process.env.JWT_SECRET_KEY,{ expiresIn: '1d' }
    );
    return token;
}
export {
    verifyToken,
    generateToken
}