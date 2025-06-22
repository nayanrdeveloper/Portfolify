import { Router } from 'express';
import { requireAuth } from '../../core/middlewares/requireAuth';
import { createSkill, deleteSkill, getSkill, listBySlug, updateSkill } from './skill.controller';

const router = Router();

/* Public */
router.get('/user/:slug', listBySlug);
router.get('/:id', getSkill);

/* Protected */
router.use(requireAuth);
router.post('/', createSkill);
router.put('/:id', updateSkill);
router.delete('/:id', deleteSkill);

export default router;
