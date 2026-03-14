import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { OAuth2Client } from 'google-auth-library';
import dotenv from 'dotenv';
import path from 'path';

// Load server specific env
dotenv.config({ path: path.resolve(process.cwd(), '.env.server') });

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';
const ALLOWED_EMAILS = (process.env.ALLOWED_EMAILS || '').split(',').map(e => e.trim().toLowerCase());
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export interface AuthenticatedRequest extends Request {
    user?: {
        email: string;
    };
}

export const verifyGoogleToken = async (credential: string) => {
    try {
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        return payload;
    } catch (error) {
        console.error("Google Token Verification Error:", error);
        return null;
    }
};

export const requireAllowlistAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1];
    
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { email: string };
        
        if (!ALLOWED_EMAILS.includes(decoded.email.toLowerCase())) {
            return res.status(403).json({ error: 'Forbidden: Email not in allowlist' });
        }
        
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
};

export const generateSessionToken = (email: string) => {
    return jwt.sign({ email }, JWT_SECRET, { expiresIn: '2h' });
};
