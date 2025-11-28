import { Router } from 'express';
import { requireAuth } from '../../core/middlewares/requireAuth';
import { getBySlug, getMine, upsertLinks } from './social.controller';

const router = Router();

router.get('/user/:slug', getBySlug); // public
router.get('/', requireAuth, getMine); // owner get
router.post('/', requireAuth, upsertLinks); // owner create/update
router.put('/', requireAuth, upsertLinks); // owner update

export default router;
