import { NextFunction, Request, Response } from 'express';
import { Types } from 'mongoose';
import { SocialService } from './social.service';

export const getBySlug = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const doc = await SocialService.publicBySlug(req.params.slug);
        res.json({ message: 'Links retrieved', data: doc ?? null });
    } catch (e) {
        next(e);
    }
};

export const upsertLinks = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const doc = await SocialService.upsert(new Types.ObjectId(req.auth!.userId), req.body);
        res.json({ message: 'Links saved', data: doc });
    } catch (e) {
        next(e);
    }
};

export const getMine = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const doc = await SocialService.getByUser(new Types.ObjectId(req.auth!.userId));
        res.json({ message: 'Links retrieved', data: doc ?? null });
    } catch (e) {
        next(e);
    }
};
