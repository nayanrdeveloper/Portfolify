// src/core/middlewares/cors.ts
import cors, { CorsOptions } from 'cors';
import { env } from '../../config/env';

const whitelist = env.CORS_ORIGINS;

const corsOptions: CorsOptions = {
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Content-Type', 'Authorization'],
    origin: (origin, cb) => {
        if (!origin) return cb(null, true); // curl/Postman

        if (env.CORS_ALLOW_LOCAL && /^https?:\/\/localhost(:\d+)?$/i.test(origin))
            return cb(null, true); // any localhost

        return whitelist.includes(origin)
            ? cb(null, true) // whitelisted domain
            : cb(new Error(`CORS: ${origin} not allowed`)); // block
    },
};

export const corsMiddleware = cors(corsOptions);
