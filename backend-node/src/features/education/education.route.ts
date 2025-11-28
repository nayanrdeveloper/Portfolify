import { Router } from 'express';
import { requireAuth } from '../../core/middlewares/requireAuth';
import {
    createEducation,
    deleteEducation,
    getEducation,
    listBySlug,
    listMine,
    updateEducation,
} from './education.controller';

const router = Router();

/* Public */
router.get('/user/:slug', listBySlug);
router.get('/:id', getEducation);

/* Protected */
router.use(requireAuth);

router.get('/', listMine);
router.post('/', createEducation);
router.put('/:id', updateEducation);
router.delete('/:id', deleteEducation);

export default router;
