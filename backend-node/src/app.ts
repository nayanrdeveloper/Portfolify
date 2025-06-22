import express from 'express';
// import morgan from 'morgan';
// import { errorHandler } from './core/middlewares/errorHandler';
import { errorConverter } from './core/middlewares/errorConverter';
import { errorHandler } from './core/middlewares/errorHandler';
import { notFound } from './core/middlewares/notFound';
import educationRoutes from './features/education/education.route';
import userRoutes from './features/user/user.route';

export const app = express();

/* ─── Global middlewares ─── */
app.use(express.json());
// app.use(cors());

// if (!env.isProd) app.use(morgan('dev'));  //// verbose logs only in dev

/* ─── Feature routes ─── */
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/educations', educationRoutes);

/* ─── 404 fallback ─── */
app.use(notFound);

/* ─── Centralised error pipeline ─── */
app.use(errorConverter); // normalise → ApiError
app.use(errorHandler); // send JSON response
