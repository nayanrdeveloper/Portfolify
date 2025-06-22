// src/core/metrics/index.ts
import { Request, RequestHandler, Response } from 'express';
import mongoose from 'mongoose';
import client from 'prom-client';

/* ---------- default Node metrics ---------- */
client.collectDefaultMetrics();

/* ---------- custom HTTP request counter ---------- */
export const httpCounter = new client.Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'route', 'status'] as const,
});

/* ---------- /metrics endpoint ---------- */
export const metricsMiddleware: RequestHandler = async (_req: Request, res: Response) => {
    res.set('Content-Type', client.register.contentType);
    res.end(await client.register.metrics());
};

/* ---------- health helper ---------- */
export const serviceHealth = () => ({
    uptime: process.uptime(),
    db: mongoose.connection.readyState === 1 ? 'ok' : 'disconnected',
});
