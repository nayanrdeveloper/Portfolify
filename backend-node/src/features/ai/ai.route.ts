import { Router } from 'express';
import { requireAuth } from '../../core/middlewares/requireAuth';
import { polishContent } from './ai.controller';

const router = Router();

router.use(requireAuth);
router.post('/polish', polishContent);

export default router;
