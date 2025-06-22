import jwt from 'jsonwebtoken';
import { env } from '../../config/env';

export interface JwtPayload {
    userId: string;
    email: string;
    slug: string;
}

const SECRET = env.JWT_SECRET || 'default_jwt_secret';
const ONE_DAY = '24h';

/* ---------- create token ---------- */
export const signToken = (payload: JwtPayload) => jwt.sign(payload, SECRET, { expiresIn: ONE_DAY });

/* ---------- verify token ---------- */
export const verifyToken = (token: string): JwtPayload => {
    return jwt.verify(token, SECRET) as JwtPayload;
};
