import { NextFunction, Request, Response } from 'express';
import { Types } from 'mongoose';
import { UserDetailsService } from './userDetails.service';

export const getMe = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const doc = await UserDetailsService.getByUser(new Types.ObjectId(req.auth!.userId));
        res.json({ message: 'Details retrieved', data: doc ?? null });
    } catch (e) {
        next(e);
    }
};

export const upsertMe = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const doc = await UserDetailsService.upsert(new Types.ObjectId(req.auth!.userId), req.body);
        res.json({ message: 'Details saved', data: doc });
    } catch (e) {
        next(e);
    }
};

export const getBySlug = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const doc = await UserDetailsService.publicBySlug(req.params.slug);
        res.json({ message: 'Details by slug', data: doc ?? null });
    } catch (e) {
        next(e);
    }
};
