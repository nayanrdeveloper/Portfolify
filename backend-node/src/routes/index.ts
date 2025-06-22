import { Router } from 'express';

import achievementRoutes from '../features/achievement/achievement.route';
import authRoutes from '../features/auth/auth.route';
import educationRoutes from '../features/education/education.route';
import experienceRoutes from '../features/experience/experience.route';
import uploadRoutes from '../features/upload/upload.route';
import userRoutes from '../features/user/user.route';

const apiRouter = Router();

apiRouter.use('/auth', authRoutes);
apiRouter.use('/users', userRoutes);
apiRouter.use('/uploads', uploadRoutes);
apiRouter.use('/educations', educationRoutes);
apiRouter.use('/experiences', experienceRoutes);
apiRouter.use('/achievements', achievementRoutes);

export default apiRouter;
