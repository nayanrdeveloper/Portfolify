import { NextFunction, Request, Response } from 'express';
import { Types } from 'mongoose';
import { NotFoundError } from '../../core/errors/ApiError';
import { UserService } from '../user/user.service';
import { createEducationSchema, updateEducationSchema } from './education.schema';
import { EducationService } from './education.service';

export const createEducation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.auth!.userId; // from requireAuth
        const data = createEducationSchema.parse(req.body);

        const edu = await EducationService.create(new Types.ObjectId(userId), data as any);
        res.status(201).json({ message: 'Education created', data: edu });
    } catch (err) {
        next(err);
    }
};

export const getEducation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const edu = await EducationService.getById(req.params.id);
        res.json({ message: 'Education retrieved', data: edu });
    } catch (err) {
        next(err);
    }
};

export const updateEducation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.auth!.userId;
        const data = updateEducationSchema.parse(req.body);

        const edu = await EducationService.update(req.params.id, userId, data as any);
        res.json({ message: 'Education updated', data: edu });
    } catch (err) {
        next(err);
    }
};

export const deleteEducation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.auth!.userId;
        await EducationService.remove(req.params.id, userId);
        res.json({ message: 'Education deleted' });
    } catch (err) {
        next(err);
    }
};

export const listBySlug = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await UserService.getBySlug(req.params.slug);
        if (!user) throw new NotFoundError('User not found by slug');

        const edus = await EducationService.listByUser(user._id);
        res.json({ message: 'Educations retrieved', data: edus });
    } catch (err) {
        next(err);
    }
};

export const listMine = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const edus = await EducationService.listByUser(new Types.ObjectId(req.auth!.userId));
        res.json({ message: 'Educations retrieved', data: edus });
    } catch (err) {
        next(err);
    }
};
