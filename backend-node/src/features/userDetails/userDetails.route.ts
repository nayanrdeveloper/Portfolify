import { Router } from 'express';
import { requireAuth } from '../../core/middlewares/requireAuth';
import { getBySlug, getMe, upsertMe } from './userDetails.controller';

const router = Router();

router.get('/slug/:slug', getBySlug); // public
router.use(requireAuth);
router.get('/me', getMe); // owner
router.post('/', upsertMe); // owner create/update

export default router;
