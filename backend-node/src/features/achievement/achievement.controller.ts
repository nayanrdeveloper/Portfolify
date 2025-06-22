import { NextFunction, Request, Response } from 'express';
import { Types } from 'mongoose';
import { NotFoundError } from '../../core/errors/ApiError';
import { UserService } from '../user/user.service';
import { createAchievementSchema, updateAchievementSchema } from './achievement.schema';
import { AchievementService } from './achievement.service';

export const createAchievement = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = createAchievementSchema.parse(req.body);
        const userId = new Types.ObjectId(req.auth!.userId);

        const ach = await AchievementService.create(userId, data as any);
        res.status(201).json({ message: 'Achievement created', data: ach });
    } catch (err) {
        next(err);
    }
};

export const getAchievement = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const ach = await AchievementService.getById(req.params.id);
        res.json({ message: 'Achievement retrieved', data: ach });
    } catch (err) {
        next(err);
    }
};

export const updateAchievement = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = updateAchievementSchema.parse(req.body);
        const ach = await AchievementService.update(req.params.id, req.auth!.userId, data as any);
        res.json({ message: 'Achievement updated', data: ach });
    } catch (err) {
        next(err);
    }
};

export const deleteAchievement = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await AchievementService.remove(req.params.id, req.auth!.userId);
        res.json({ message: 'Achievement deleted' });
    } catch (err) {
        next(err);
    }
};

export const listBySlug = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await UserService.getBySlug(req.params.slug);
        if (!user) throw new NotFoundError('User not found by slug');

        const achs = await AchievementService.listByUser(user._id);
        res.json({ message: 'Achievements retrieved', data: achs });
    } catch (err) {
        next(err);
    }
};
