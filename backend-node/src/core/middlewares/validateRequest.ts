// src/core/middlewares/validateRequest.ts
import { RequestHandler } from 'express';
import { ZodSchema } from 'zod';

/**
 * validate(schema)  ⇒  Express middleware
 *   • If the request part is valid → attaches the parsed data & calls next()
 *   • If invalid → sends 400 and stops the chain
 */
export const validate =
    (schema: ZodSchema<any>, target: 'body' | 'params' = 'body'): RequestHandler =>
    (req, res, next) => {
        const parsed = schema.safeParse(req[target]);

        if (!parsed.success) {
            res.status(400).json({
                error: 'Validation error',
                details: parsed.error.flatten().fieldErrors,
            });
            return; // <-- ensures the handler returns void
        }

        // overwrite the raw data with the typed, validated version
        (req as any)[target] = parsed.data;
        next();
    };
