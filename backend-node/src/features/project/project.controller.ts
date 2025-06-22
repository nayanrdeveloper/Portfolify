import { NextFunction, Request, Response } from 'express';
import { Types } from 'mongoose';
import { NotFoundError } from '../../core/errors/ApiError';
import { UserService } from '../user/user.service';
import { createProjectSchema, updateProjectSchema } from './project.schema';
import { ProjectService } from './project.service';

export const createProject = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = createProjectSchema.parse(req.body);
        const prj = await ProjectService.create(new Types.ObjectId(req.auth!.userId), data as any);
        res.status(201).json({ message: 'Project created', data: prj });
    } catch (e) {
        next(e);
    }
};

export const getProject = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const prj = await ProjectService.getById(req.params.id);
        res.json({ message: 'Project retrieved', data: prj });
    } catch (e) {
        next(e);
    }
};

export const updateProject = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const changes = updateProjectSchema.parse(req.body);
        const prj = await ProjectService.update(req.params.id, req.auth!.userId, changes as any);
        res.json({ message: 'Project updated', data: prj });
    } catch (e) {
        next(e);
    }
};

export const deleteProject = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await ProjectService.remove(req.params.id, req.auth!.userId);
        res.json({ message: 'Project deleted' });
    } catch (e) {
        next(e);
    }
};

export const listBySlug = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await UserService.getBySlug(req.params.slug);
        if (!user) throw new NotFoundError('User not found by slug');

        const prjs = await ProjectService.listByUser(user._id);
        res.json({ message: 'Projects retrieved', data: prjs });
    } catch (e) {
        next(e);
    }
};
