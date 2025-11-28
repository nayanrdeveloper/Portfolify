import { Router } from 'express';
import { requireAuth } from '../../core/middlewares/requireAuth';
import {
    createExperience,
    deleteExperience,
    getExperience,
    listBySlug,
    listMine,
    updateExperience,
} from './experience.controller';

const router = Router();

/* Public */
router.get('/user/:slug', listBySlug);
router.get('/:id', getExperience);

/* Protected */
router.use(requireAuth);
router.get('/', listMine);
router.post('/', createExperience);
router.put('/:id', updateExperience);
router.delete('/:id', deleteExperience);

export default router;
