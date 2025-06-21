import { Router } from 'express';
import { createUser } from './user.controller';
// import { validateRequest } from '../../core/middlewares/validateRequest'; // e.g. zod/yup later

const router = Router();
router.post('/',  createUser);
export default router;
