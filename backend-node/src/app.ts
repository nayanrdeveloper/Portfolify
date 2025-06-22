import express from 'express';
// import cors from 'cors';

import { errorConverter } from './core/middlewares/errorConverter';
import { errorHandler } from './core/middlewares/errorHandler';
import { httpLogger } from './core/middlewares/httpLogger';
import { notFound } from './core/middlewares/notFound';

import { httpCounter, metricsMiddleware, serviceHealth } from './core/metrics';

import { corsMiddleware } from './core/middlewares/cors';
import apiRouter from './routes';

export const app = express();

/* ────────────────────────────────────────────────
   Global middlewares
   ──────────────────────────────────────────────── */
app.use(corsMiddleware);
app.use(express.json());
// app.use(cors());                 // customise origins if needed
app.use(httpLogger); // pino-http logging

/* Count every completed response for Prometheus */
app.use((req, res, next) => {
    res.on('finish', () => {
        httpCounter.inc({
            method: req.method,
            route: req.route?.path ?? req.originalUrl,
            status: res.statusCode,
        });
    });
    next();
});

/* ────────────────────────────────────────────────
   Observability endpoints
   ──────────────────────────────────────────────── */
app.get('/healthz', (_req, res) => {
    res.json(serviceHealth());
});
app.get('/metrics', metricsMiddleware);

/* ────────────────────────────────────────────────
   Feature routes
   ──────────────────────────────────────────────── */
app.use('/api/v1', apiRouter);
/* ────────────────────────────────────────────────
   404 + error pipeline
   ──────────────────────────────────────────────── */
app.use(notFound); // after all routes
app.use(errorConverter); // normalise → ApiError
app.use(errorHandler); // send JSON response

/* ────────────────────────────────────────────────
   Startup banner (called in server.ts)
   ──────────────────────────────────────────────── */
// export const app so server.ts can import & start it
