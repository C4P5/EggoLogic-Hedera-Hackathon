import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { verifyGoogleToken, requireAllowlistAuth, generateSessionToken, AuthenticatedRequest } from './auth';
import { HederaGuardianService } from './services/HederaGuardianService';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.server') });

const app = express();
const PORT = process.env.PORT || 3001;
const ALLOWED_EMAILS = (process.env.ALLOWED_EMAILS || '').split(',').map(e => e.trim().toLowerCase());

app.use(cors()); // In production, restrict origin
app.use(express.json());
app.use(cookieParser());

// Auth Endpoint (Login)
app.post('/api/auth/google', async (req, res) => {
    const { credential } = req.body;
    if (!credential) {
        return res.status(400).json({ error: 'Credential is required' });
    }

    const payload = await verifyGoogleToken(credential);
    if (!payload || !payload.email) {
        return res.status(401).json({ error: 'Invalid Google Identity' });
    }

    const email = payload.email.toLowerCase();

    // 1. Authorize against Allowlist
    if (!ALLOWED_EMAILS.includes(email)) {
        return res.status(403).json({ error: 'Access Denied: Email not allowlisted' });
    }

    // 2. Issue Session JWT
    const token = generateSessionToken(email);

    res.json({
        message: 'Authenticated successfully',
        token,
        user: {
            email: email,
            name: payload.name,
            picture: payload.picture
        }
    });
});

// Guarded API Endpoint bridging to KMS
app.post('/api/submit', requireAllowlistAuth, async (req: AuthenticatedRequest, res) => {
    try {
        const email = req.user!.email;
        const payload = req.body;
        
        console.log(`[API] Received form submission from ${email}`);
        
        const receipt = await HederaGuardianService.submitDataToGuardian(email, payload);
        
        if (receipt) {
            res.status(200).json({ 
                success: true, 
                message: "Data submitted to Guardian", 
                transactionId: receipt.transactionId 
            });
        } else {
            res.status(500).json({ error: "Failed to submit data to KMS/Guardian" });
        }
    } catch (error) {
        console.error("[API] Error processing submission:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Eggologic Backend API Server running on port ${PORT}`);
});
