import mongoose from 'mongoose';
import { env } from './env';

export const connectMongo = async () => {
  await mongoose.connect(env.MONGO_URI);
  console.log('🗄️  Mongo connected');
};
