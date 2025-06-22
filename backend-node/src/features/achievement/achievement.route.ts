import { Router } from 'express';
import { requireAuth } from '../../core/middlewares/requireAuth';
import {
    createAchievement,
    deleteAchievement,
    getAchievement,
    listBySlug,
    updateAchievement,
} from './achievement.controller';

const router = Router();

/* Public */
router.get('/user/:slug', listBySlug);
router.get('/:id', getAchievement);

/* Protected */
router.use(requireAuth);
router.post('/', createAchievement);
router.put('/:id', updateAchievement);
router.delete('/:id', deleteAchievement);

export default router;
