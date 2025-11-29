import { NextFunction, Request, Response } from 'express';
import { ForbiddenError } from '../../core/errors/ApiError';
import { createBlogSchema, updateBlogSchema } from './blog.schema';
import { BlogService } from './blog.service';

export const createBlog = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = createBlogSchema.parse(req.body);
        const blog = await BlogService.create(req.auth!.userId, data);
        res.status(201).json({ message: 'Blog created successfully', data: blog });
    } catch (e) {
        next(e);
    }
};

export const getBlogs = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const query = req.query;
        // If not authenticated or requesting public view, force isPublished=true unless looking at own
        if (!req.auth) {
            query.isPublished = 'true';
        }
        const blogs = await BlogService.findAll(query);
        res.json({ data: blogs });
    } catch (e) {
        next(e);
    }
};

export const getBlogBySlug = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const blog = await BlogService.findBySlug(req.params.slug);
        if (!blog.isPublished) {
            // Allow owner to view draft
            if (!req.auth || req.auth.userId !== blog.user._id.toString()) {
                throw new ForbiddenError('This blog post is not published');
            }
        }
        res.json({ data: blog });
    } catch (e) {
        next(e);
    }
};

export const getBlogById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const blog = await BlogService.findById(req.params.id);
        // Only owner can fetch by ID (usually for editing)
        if (req.auth!.userId !== blog.user.toString()) {
            throw new ForbiddenError('Unauthorized to view this blog');
        }
        res.json({ data: blog });
    } catch (e) {
        next(e);
    }
};

export const updateBlog = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = updateBlogSchema.parse(req.body);
        const blog = await BlogService.update(req.params.id, req.auth!.userId, data);
        res.json({ message: 'Blog updated successfully', data: blog });
    } catch (e) {
        next(e);
    }
};

export const deleteBlog = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await BlogService.delete(req.params.id, req.auth!.userId);
        res.json({ message: 'Blog deleted successfully' });
    } catch (e) {
        next(e);
    }
};
