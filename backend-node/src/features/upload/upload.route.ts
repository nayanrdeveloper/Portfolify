// src/features/upload/upload.route.ts
import { Router } from 'express';
import multer from 'multer';
import { requireAuth } from '../../core/middlewares/requireAuth';
import { uploadMultiple, uploadSingle } from './upload.controller';

const router = Router();
const mem = multer({ storage: multer.memoryStorage() });

router.use(requireAuth); // all endpoints require JWT

router.post('/single', mem.single('file'), uploadSingle);
router.post('/multiple', mem.array('files'), uploadMultiple);

export default router;
