// category.controller.ts
import { NextFunction, Request, Response } from 'express';
import { createCategorySchema, updateCategorySchema } from './category.schema';
import { CategoryService } from './category.service';

export const createCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = createCategorySchema.parse(req.body);
        const cat = await CategoryService.create(data);
        res.status(201).json({ message: 'Category created', data: cat });
    } catch (e) {
        next(e);
    }
};

export const listCategories = async (_: Request, res: Response, next: NextFunction) => {
    try {
        const cats = await CategoryService.list();
        res.json({ message: 'Categories retrieved', data: cats });
    } catch (e) {
        next(e);
    }
};

export const updateCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const changes = updateCategorySchema.parse(req.body);
        const cat = await CategoryService.update(req.params.id, changes as any);
        res.json({ message: 'Category updated', data: cat });
    } catch (e) {
        next(e);
    }
};

export const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await CategoryService.remove(req.params.id);
        res.json({ message: 'Category deleted' });
    } catch (e) {
        next(e);
    }
};
