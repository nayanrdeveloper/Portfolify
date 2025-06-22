import { Router } from 'express';

import achievementRoutes from '../features/achievement/achievement.route';
import authRoutes from '../features/auth/auth.route';
import categoryRoutes from '../features/category/category.route';
import contactRoutes from '../features/contact/contact.route';
import educationRoutes from '../features/education/education.route';
import experienceRoutes from '../features/experience/experience.route';
import projectRoutes from '../features/project/project.route';
import skillRoutes from '../features/skill/skill.route';
import socialRoutes from '../features/social/social.route';
import uploadRoutes from '../features/upload/upload.route';
import userRoutes from '../features/user/user.route';
import userDetailsRoutes from '../features/userDetails/userDetails.route';
import settingsRoutes from '../features/userSettings/settings.route';

const apiRouter = Router();

apiRouter.use('/auth', authRoutes);
apiRouter.use('/users', userRoutes);
apiRouter.use('/uploads', uploadRoutes);
apiRouter.use('/educations', educationRoutes);
apiRouter.use('/experiences', experienceRoutes);
apiRouter.use('/achievements', achievementRoutes);
apiRouter.use('/projects', projectRoutes);
apiRouter.use('/contact', contactRoutes);
apiRouter.use('/categories', categoryRoutes);
apiRouter.use('/skills', skillRoutes);
apiRouter.use('/socialmedia', socialRoutes);
apiRouter.use('/user-details', userDetailsRoutes);
apiRouter.use('/settings', settingsRoutes);

export default apiRouter;
