import { NextFunction, Request, Response } from 'express';
import { env } from '../../config/env';
import { ApiError } from '../errors/ApiError';

export const errorHandler = (err: ApiError, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.statusCode || 500;

    /* Structure returned to clients */
    const payload: Record<string, unknown> = {
        message: err.message,
    };

    /* Only leak stack/details in non-production */
    if (!env.isProd) {
        payload.stack = err.stack;
        if (err.details) payload.details = err.details;
    }

    res.status(status).json(payload);
};
