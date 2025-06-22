import { Router } from 'express';
import { requireAuth } from '../../core/middlewares/requireAuth';
import {
    createProject,
    deleteProject,
    getProject,
    listBySlug,
    updateProject,
} from './project.controller';

const router = Router();

/* Public */
router.get('/:id', getProject);
router.get('/user/:slug', listBySlug);

/* Protected */
router.use(requireAuth);
router.post('/', createProject);
router.put('/:id', updateProject);
router.delete('/:id', deleteProject);

export default router;
