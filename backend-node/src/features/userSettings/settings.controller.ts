import { NextFunction, Request, Response } from 'express';
import { Types } from 'mongoose';
import { SettingsService } from './settings.service';

export const getMine = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const doc = await SettingsService.getByUser(new Types.ObjectId(req.auth!.userId));
        res.json({ message: 'Settings retrieved', data: doc ?? { template: 'default' } });
    } catch (e) {
        next(e);
    }
};

export const updateMine = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const doc = await SettingsService.upsert(new Types.ObjectId(req.auth!.userId), req.body);
        res.json({ message: 'Settings saved', data: doc });
    } catch (e) {
        next(e);
    }
};

export const getBySlug = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const tpl = await SettingsService.publicBySlug(req.params.slug);
        res.json({ message: 'Template by slug', data: { template: tpl } });
    } catch (e) {
        next(e);
    }
};
