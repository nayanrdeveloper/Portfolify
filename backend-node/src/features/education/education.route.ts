import { Router } from 'express';
import { validate } from '../../core/middlewares/validateRequest';
import { addEducation, listEducation } from './education.controller';
import { addEducationSchema } from './education.schema';

const router = Router({ mergeParams: true }); // merge :userId param

router.post('/:userId', validate(addEducationSchema), addEducation);
router.get('/:userId', listEducation);

export default router;
