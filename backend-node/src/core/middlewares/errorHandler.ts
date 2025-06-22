import { NextFunction, Request, Response } from 'express';
import { env } from '../../config/env';
import { ApiError } from '../errors/ApiError';
import { MSG } from '../messages';

const DEFAULT_MESSAGE_BY_STATUS: Record<number, string> = {
    400: MSG.BAD_REQUEST(),
    401: MSG.UNAUTHORIZED(),
    403: MSG.FORBIDDEN(),
    404: MSG.NOT_FOUND(),
    409: MSG.CONFLICT(),
    500: MSG.INTERNAL(),
};

export const errorHandler = (err: ApiError, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.statusCode ?? 500;

    const publicMessage = err.isOperational
        ? err.message
        : DEFAULT_MESSAGE_BY_STATUS[status] || MSG.INTERNAL();

    const payload: Record<string, unknown> = { message: publicMessage };

    if (!env.isProd) {
        payload.stack = err.stack;
        if (err.details) payload.details = err.details;
    }

    res.status(status).json(payload);
};
