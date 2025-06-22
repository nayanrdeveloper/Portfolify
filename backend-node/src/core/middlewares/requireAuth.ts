import { RequestHandler } from 'express';
import { verifyToken } from '../auth/jwt';
import { Unauthorized } from '../errors/ApiError';
import { MSG } from '../messages';

export const requireAuth: RequestHandler = (req, _res, next) => {
    const header = req.headers.authorization;
    if (!header) return next(Unauthorized(MSG.UNAUTHORIZED()));

    const [scheme, token] = header.split(' ');
    if (scheme !== 'Bearer' || !token) return next(Unauthorized(MSG.INVALID_TOKEN()));

    try {
        req.auth = verifyToken(token);
        return next();
    } catch {
        return next(Unauthorized(MSG.INVALID_TOKEN()));
    }
};
