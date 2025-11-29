import { Router } from 'express';
import { requireAuth } from '../../core/middlewares/requireAuth';
import {
    createBlog,
    deleteBlog,
    getBlogById,
    getBlogBySlug,
    getBlogs,
    updateBlog,
} from './blog.controller';

const router = Router();

/* Public Routes */
router.get('/', getBlogs); // Can filter by query params
router.get('/:slug', getBlogBySlug);

/* Protected Routes */
router.use(requireAuth);
router.get('/id/:id', getBlogById);
router.post('/', createBlog);
router.put('/:id', updateBlog);
router.delete('/:id', deleteBlog);

export default router;
