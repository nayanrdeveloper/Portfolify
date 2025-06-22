import { Router } from 'express';
import { requireAuth } from '../../core/middlewares/requireAuth';
import { getBySlug, getMine, updateMine } from './settings.controller';

const router = Router();

/* public */
router.get('/user/:slug', getBySlug);

/* owner */
router.use(requireAuth);
router.get('/', getMine);
router.put('/', updateMine);

export default router;
