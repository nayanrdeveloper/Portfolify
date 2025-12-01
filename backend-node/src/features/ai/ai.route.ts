import { Router } from 'express';
import { requireAuth } from '../../core/middlewares/requireAuth';
import { polishContent, tailorResume } from './ai.controller';

const router = Router();

router.use(requireAuth);
router.post('/polish', polishContent);
router.post('/tailor', tailorResume);

export default router;
