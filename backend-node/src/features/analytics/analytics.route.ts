import { Router } from 'express';
import { requireAuth } from '../../core/middlewares/requireAuth';
import {
    getDashboardStats,
    trackArticleRead,
    trackProfileView,
    trackProjectClick,
} from './analytics.controller';

const router = Router();

// Public tracking routes
router.post('/track/profile/:username', trackProfileView);
router.post('/track/project/:id', trackProjectClick);
router.post('/track/article/:id', trackArticleRead);

// Protected dashboard stats
router.get('/dashboard', requireAuth, getDashboardStats);

export default router;
