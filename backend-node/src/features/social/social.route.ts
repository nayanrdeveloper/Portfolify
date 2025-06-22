import { Router } from 'express';
import { requireAuth } from '../../core/middlewares/requireAuth';
import { getBySlug, upsertLinks } from './social.controller';

const router = Router();

router.get('/user/:slug', getBySlug); // public
router.put('/', requireAuth, upsertLinks); // owner update

export default router;
