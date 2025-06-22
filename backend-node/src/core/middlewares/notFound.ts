import { RequestHandler } from 'express';
import { env } from '../../config/env';
import { NotFoundError } from '../errors/ApiError';
import { MSG } from '../messages';

export const notFound: RequestHandler = (req, _res, next) => {
    const message = env.isProd
        ? MSG.NOT_FOUND()
        : `${MSG.NOT_FOUND()} — Cannot ${req.method} ${req.originalUrl}`;

    next(new NotFoundError(message));
};
