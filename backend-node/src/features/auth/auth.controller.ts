// src/features/auth/auth.controller.ts
import { NextFunction, Request, Response } from 'express';
import { signToken } from '../../core/auth/jwt';
import { created, ok } from '../../core/utils/sendResponse'; // ✅ NEW
import { UserService } from '../user/user.service';
import { loginSchema, registerSchema } from './auth.schema';

/* POST /auth/register */
export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // 1) validate body
        const dto = registerSchema.parse(req.body);

        // 2) create user
        const user = await UserService.register(dto);

        // 3) JWT
        const token = signToken({
            userId: user._id.toString(),
            email: user.email,
            slug: user.slug,
        });

        // 4) consistent envelope
        return created(res, { user, token }, 'Account created successfully');
    } catch (err) {
        next(err);
    }
};

/* POST /auth/login */
export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // 1) validate body
        const creds = loginSchema.parse(req.body);

        // 2) verify credentials
        const user = await UserService.validateCredentials(creds.email, creds.password);

        // 3) JWT
        const token = signToken({
            userId: user._id.toString(),
            email: user.email,
            slug: user.slug,
        });

        // 4) consistent envelope
        return ok(res, { token }, 'User logged in successfully');
    } catch (err) {
        next(err);
    }
};
