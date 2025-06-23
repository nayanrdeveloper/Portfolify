import { Response } from 'express';

/** Standard 200 JSON envelope */
export function ok<Data>(res: Response, data: Data, message = 'Success'): Response {
    return res.json({ message, data });
}

/** 201 JSON envelope (use for “created”) */
export function created<Data>(res: Response, data: Data, message = 'Created'): Response {
    return res.status(201).json({ message, data });
}
