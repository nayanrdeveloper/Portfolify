import { User } from './user.interface';
import { UserModel } from './user.model';

export class UserService {
    static async create(payload: Partial<User>) {
        return UserModel.create(payload);
    }

    static async getById(id: string) {
        return UserModel.findById(id).lean();
    }
}
