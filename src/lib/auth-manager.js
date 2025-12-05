import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export const signToken = (userId) => {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
};

export const verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
};

export const verifyUser = (request) => {
    try {
        const token = request.cookies.get('token')?.value;
        if (!token) return null;
        
        const decoded = verifyToken(token);
        return decoded ? decoded.userId : null;
    } catch (error) {
        return null;
    }
};