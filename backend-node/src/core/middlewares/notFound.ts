// src/core/middlewares/notFound.ts
import { RequestHandler } from 'express';
import { NotFound } from '../errors/ApiError';

/**
 * Catches any request that didn’t match a route.
 * Must be registered *after* all other routes.
 */
export const notFound: RequestHandler = (req, _res, next) => {
    next(NotFound(`Cannot ${req.method} ${req.originalUrl}`)); // forwards to errorConverter → errorHandler
};
