import { NextFunction, Request, Response } from 'express';
import { EducationService } from './education.service';

export const addEducation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const edu = await EducationService.create({ ...req.body, user: req.params.userId });
        res.status(201).json(edu);
    } catch (err) {
        next(err);
    }
};

export const listEducation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const list = await EducationService.getByUser(req.params.userId);
        res.json(list);
    } catch (err) {
        next(err);
    }
};
