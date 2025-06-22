import { NextFunction, Request, Response } from 'express';
import { Types } from 'mongoose';
import { NotFoundError } from '../../core/errors/ApiError';
import { UserService } from '../user/user.service';
import { createExperienceSchema, updateExperienceSchema } from './experience.schema';
import { ExperienceService } from './experience.service';

export const createExperience = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.auth!.userId;
        const data = createExperienceSchema.parse(req.body);

        const exp = await ExperienceService.create(new Types.ObjectId(userId), data as any);
        res.status(201).json({ message: 'Experience created', data: exp });
    } catch (err) {
        next(err);
    }
};

export const getExperience = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const exp = await ExperienceService.getById(req.params.id);
        res.json({ message: 'Experience retrieved', data: exp });
    } catch (err) {
        next(err);
    }
};

export const updateExperience = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.auth!.userId;
        const data = updateExperienceSchema.parse(req.body);

        const exp = await ExperienceService.update(req.params.id, userId, data as any);
        res.json({ message: 'Experience updated', data: exp });
    } catch (err) {
        next(err);
    }
};

export const deleteExperience = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.auth!.userId;
        await ExperienceService.remove(req.params.id, userId);
        res.json({ message: 'Experience deleted' });
    } catch (err) {
        next(err);
    }
};

export const listBySlug = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await UserService.getBySlug(req.params.slug);
        if (!user) throw new NotFoundError('User not found by slug');

        const exps = await ExperienceService.listByUser(user._id);
        res.json({ message: 'Experiences retrieved', data: exps });
    } catch (err) {
        next(err);
    }
};
