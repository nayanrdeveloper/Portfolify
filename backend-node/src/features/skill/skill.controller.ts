import { NextFunction, Request, Response } from 'express';
import { Types } from 'mongoose';
import { NotFoundError } from '../../core/errors/ApiError';
import { CategoryService } from '../category/category.service';
import { UserService } from '../user/user.service';
import { createSkillSchema, updateSkillSchema } from './skill.schema';
import { SkillService } from './skill.service';

export const createSkill = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = createSkillSchema.parse(req.body);
        const skill = await SkillService.create(new Types.ObjectId(req.auth!.userId), data as any);
        res.status(201).json({ message: 'Skill created', data: skill });
    } catch (e) {
        next(e);
    }
};

export const getSkill = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const s = await SkillService.getById(req.params.id);
        res.json({ message: 'Skill retrieved', data: s });
    } catch (e) {
        next(e);
    }
};

export const updateSkill = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const changes = updateSkillSchema.parse(req.body);
        const s = await SkillService.update(req.params.id, req.auth!.userId, changes as any);
        res.json({ message: 'Skill updated', data: s });
    } catch (e) {
        next(e);
    }
};

export const deleteSkill = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await SkillService.remove(req.params.id, req.auth!.userId);
        res.json({ message: 'Skill deleted' });
    } catch (e) {
        next(e);
    }
};

export const listBySlug = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await UserService.getBySlug(req.params.slug);
        if (!user) throw new NotFoundError('User not found by slug');

        /* skills */
        const skills = await SkillService.listByUser(user._id);

        /* map categoryId → name (bulk query) */
        const uniqueIds = [...new Set(skills.flatMap(s => s.categoryIds.map(String)))];
        const catDocs = await CategoryService.listByIds(
            uniqueIds.map(id => new Types.ObjectId(id)),
        );
        const catMap = Object.fromEntries(catDocs.map(c => [c._id.toString(), c.name]));

        /* decorate */
        const decorated = skills.map(s => ({
            ...s,
            categoryNames: s.categoryIds.map(id => catMap[id.toString()]).filter(Boolean),
        }));

        res.json({ message: 'Skills retrieved', data: decorated });
    } catch (e) {
        next(e);
    }
};
