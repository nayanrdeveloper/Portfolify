import { Router } from 'express';

import educationRoutes from '../features/education/education.route';
import userRoutes from '../features/user/user.route';
// ⬆️ add future feature routes here

const apiRouter = Router();

/* v1 sub-paths */
apiRouter.use('/users', userRoutes);
apiRouter.use('/educations', educationRoutes);

export default apiRouter;
