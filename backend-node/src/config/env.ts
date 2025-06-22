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

export const env = {
    NODE_ENV,
    PORT: Number(process.env.PORT ?? 4000),
    MONGO_URI: requireEnv('MONGO_URI'),
    JWT_SECRET: requireEnv('JWT_SECRET'),
    CLOUDINARY_CLOUD_NAME: requireEnv('CLOUDINARY_CLOUD_NAME'),
    CLOUDINARY_API_KEY: requireEnv('CLOUDINARY_API_KEY'),
    CLOUDINARY_API_SECRET: requireEnv('CLOUDINARY_API_SECRET'),
    isProd,
} as const;
