import type { JwtPayload } from '../core/auth/jwt';

declare global {
    namespace Express {
        // Available in every handler:  req.auth?.userId
        interface Request {
            auth?: JwtPayload;
        }
    }
}

export {}; // ← makes this a module
