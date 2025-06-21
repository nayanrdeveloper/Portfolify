import { UserModel } from './user.model';
import { User } from './user.interface';

export class UserService {
  static async create(payload: Partial<User>) {
    return UserModel.create(payload);
  }

  static async getById(id: string) {
    return UserModel.findById(id).lean();
  }
}
