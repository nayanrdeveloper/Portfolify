// category.route.ts
import { Router } from 'express';
import { requireAuth } from '../../core/middlewares/requireAuth';
import {
    createCategory,
    deleteCategory,
    listCategories,
    updateCategory,
} from './category.controller';

const router = Router();

/* Public list */
router.get('/', listCategories);

/* (Optional) protect create/update/delete with auth/role middleware */
router.use(requireAuth);
router.post('/', createCategory);
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);

export default router;
