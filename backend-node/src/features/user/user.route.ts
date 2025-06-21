import { Router } from 'express';
import { validate } from '../../core/middlewares/validateRequest';
import { createUser } from './user.controller';
import { createUserSchema } from './user.schema';
// import { validateRequest } from '../../core/middlewares/validateRequest'; // e.g. zod/yup later

const router = Router();
router.post('/', validate(createUserSchema), createUser);
export default router;
