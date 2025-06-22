import { RequestHandler } from 'express';

/** Wraps an async controller → forwards rejection to next() */
export const catchAsync =
    (fn: RequestHandler): RequestHandler =>
    (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
