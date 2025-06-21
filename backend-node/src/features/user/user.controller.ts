import { Request, Response, NextFunction } from 'express';
import { UserService } from './user.service';

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await UserService.create(req.body);
    res.status(201).json(user);
  } catch (err) { next(err); }
};
