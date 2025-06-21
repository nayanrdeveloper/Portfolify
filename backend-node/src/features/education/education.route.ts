import { Router } from 'express';
import { addEducation, listEducation } from './education.controller';

const router = Router({ mergeParams: true }); // merge :userId param
router.post('/:userId', addEducation).get('/:userId', listEducation);

export default router;
