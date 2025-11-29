// src/features/upload/upload.route.ts
import { Router } from 'express';
import multer from 'multer';
import { requireAuth } from '../../core/middlewares/requireAuth';
import { deleteMedia, getMediaLibrary, uploadMultiple, uploadSingle } from './upload.controller';

const router = Router();
const mem = multer({ storage: multer.memoryStorage() });

router.use(requireAuth); // all endpoints require JWT

router.get('/', getMediaLibrary);
router.post('/single', mem.single('file'), uploadSingle);
router.post('/multiple', mem.array('files'), uploadMultiple);
router.delete('/:id', deleteMedia);

export default router;
