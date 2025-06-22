import { Router } from 'express';
import { requireAuth } from '../../core/middlewares/requireAuth';
import { createMessage, deleteMessage, getMessage, listMessages } from './contact.controller';

const router = Router();

/* Public visitor → owner */
router.post('/:slug', createMessage);

/* Owner-only */
router.use(requireAuth);
router.get('/messages', listMessages);
router.get('/:id', getMessage);
router.delete('/:id', deleteMessage);

export default router;
