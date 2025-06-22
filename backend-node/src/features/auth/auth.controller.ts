import { NextFunction, Request, Response } from 'express';
import { signToken } from '../../core/auth/jwt';
import { UserService } from '../user/user.service';
import { loginSchema, registerSchema } from './auth.schema';

export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = registerSchema.parse(req.body);
        const user = await UserService.register(data);

        const token = signToken({
            userId: user._id.toString(),
            email: user.email,
            slug: user.slug,
        });

        res.status(201).json({
            message: 'Account created successfully',
            data: { user, token },
        });
    } catch (err) {
        next(err);
    }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const creds = loginSchema.parse(req.body);
        const user = await UserService.validateCredentials(creds.email, creds.password);

        const token = signToken({
            userId: user._id.toString(),
            email: user.email,
            slug: user.slug,
        });

        res.json({
            message: 'User logged in successfully',
            data: { token },
        });
    } catch (err) {
        next(err);
    }
};
