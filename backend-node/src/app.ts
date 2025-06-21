import express from 'express';
// import morgan from 'morgan';
// import { errorHandler } from './core/middlewares/errorHandler';
import userRoutes from './features/user/user.route';
import educationRoutes from './features/education/education.route';

export const app = express();
app.use(express.json());
// app.use(morgan('dev'));

app.use('/api/v1/users', userRoutes);
app.use('/api/v1/educations', educationRoutes);

// app.use(errorHandler);          // centralized error middleware
