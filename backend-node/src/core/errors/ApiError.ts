export class ApiError extends Error {
    public readonly statusCode: number;
    public readonly isOperational: boolean; // vs. programming bug
    public readonly details?: unknown; // extra context

    constructor(
        statusCode: number,
        message: string,
        options: { details?: unknown; isOperational?: boolean } = {},
    ) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
        this.statusCode = statusCode;
        this.isOperational = options.isOperational ?? true;
        this.details = options.details;
        Error.captureStackTrace(this);
    }
}

/* ---- subclasses & helpers ---- */
export class BadRequestError extends ApiError {
    constructor(msg = 'Invalid request', opts?: { details?: unknown }) {
        super(400, msg, opts);
    }
}

export class NotFoundError extends ApiError {
    constructor(msg = 'Resource not found', opts?: { details?: unknown }) {
        super(404, msg, opts);
    }
}

export class ForbiddenError extends ApiError {
    constructor(msg = 'Forbidden', opts?: { details?: unknown }) {
        super(403, msg, opts);
    }
}

export class ConflictError extends ApiError {
    constructor(msg = 'Resource already exists', opts?: { details?: unknown }) {
        super(409, msg, opts);
    }
}

export const BadRequest = (msg = 'Invalid request', opts?: { details?: unknown }) =>
    new ApiError(400, msg, { ...opts });

export const NotFound = (msg = 'Resource not found', opts?: { details?: unknown }) =>
    new ApiError(404, msg, { ...opts });

export const Forbidden = (msg = 'Forbidden', opts?: { details?: unknown }) =>
    new ApiError(403, msg, { ...opts });

export const Conflict = (msg?: string, opts?: any) => new ConflictError(msg, opts);
