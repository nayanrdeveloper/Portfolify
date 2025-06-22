import { Router } from 'express';

import achievementRoutes from '../features/achievement/achievement.route';
import authRoutes from '../features/auth/auth.route';
import educationRoutes from '../features/education/education.route';
import experienceRoutes from '../features/experience/experience.route';
import userRoutes from '../features/user/user.route';
// ⬆️ add future feature routes here

const apiRouter = Router();

/* v1 sub-paths */
apiRouter.use('/auth', authRoutes);
apiRouter.use('/users', userRoutes);
apiRouter.use('/educations', educationRoutes);
apiRouter.use('/experiences', experienceRoutes);
apiRouter.use('/achievements', achievementRoutes);

export default apiRouter;
