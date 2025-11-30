// src/config/env.ts
import { config } from 'dotenv';
config(); // loads .env.*

const NODE_ENV = process.env.NODE_ENV ?? 'development';
const isProd = NODE_ENV === 'production';

function requireEnv(name: string): string {
    const val = process.env[name];
    if (!val) {
        console.error(`❌ Missing required env var: ${name}`);
        process.exit(1);
    }
    return val;
}

/* Add OPTIONAL CORS vars with sensible fallbacks */
const CORS_ORIGINS =
    process.env.CORS_ORIGINS?.split(',') // comma-separated list
        .map(o => o.trim())
        .filter(Boolean) ?? [];

const CORS_ALLOW_LOCAL = process.env.CORS_ALLOW_LOCAL === 'true' || !isProd; // default true in dev
/* ────────────────────────────────────────── */

export const env = {
    NODE_ENV,
    PORT: Number(process.env.PORT ?? 4000),
    MONGO_URI: requireEnv('MONGO_URI'),
    JWT_SECRET: requireEnv('JWT_SECRET'),
    CLOUDINARY_CLOUD_NAME: requireEnv('CLOUDINARY_CLOUD_NAME'),
    CLOUDINARY_API_KEY: requireEnv('CLOUDINARY_API_KEY'),
    CLOUDINARY_API_SECRET: requireEnv('CLOUDINARY_API_SECRET'),
    CORS_ORIGINS,
    CORS_ALLOW_LOCAL,
    isProd,
    GEMINI_API_KEY: requireEnv('GEMINI_API_KEY'),
} as const;
