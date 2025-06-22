import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { ZodError } from 'zod';
import { ApiError, BadRequest, ConflictError } from '../errors/ApiError';

export const errorConverter = (err: unknown, _req: Request, _res: Response, next: NextFunction) => {
    if (err instanceof ApiError) return next(err);

    if (err instanceof ZodError) {
        return next(
            BadRequest('Validation failed', {
                details: err.flatten().fieldErrors,
            }),
        );
    }

    if (err instanceof mongoose.mongo.MongoServerError && err.code === 11000) {
        const field = Object.keys(err.keyPattern ?? {})[0] ?? 'value';
        const value = Object.values(err.keyValue ?? {})[0];
        return next(new ConflictError(`${field} '${value}' already exists`, { details: err }));
    }

    // Fallback → 500 unexpected
    const wrapped = new ApiError(500, 'Internal server error', {
        isOperational: false,
        details: err,
    });
    return next(wrapped);
};
