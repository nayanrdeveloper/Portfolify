import { Types } from 'mongoose';
import { NotFoundError } from '../../core/errors/ApiError';
import { UserService } from '../user/user.service';
import { UserDetailsModel } from './userDetails.model';
import { upsertDetailsSchema } from './userDetails.schema';

export class UserDetailsService {
    /* ------------- helpers ------------- */
    static async getByUser(userId: Types.ObjectId) {
        return UserDetailsModel.findOne({ user: userId }).lean();
    }

    /* ------------- upsert -------------- */
    static async upsert(userId: Types.ObjectId, payload: unknown) {
        const data = upsertDetailsSchema.parse(payload);

        return UserDetailsModel.findOneAndUpdate(
            { user: userId },
            { ...data },
            { upsert: true, new: true, setDefaultsOnInsert: true },
        );
    }

    /* ------------- public by slug ------ */
    static async publicBySlug(slug: string) {
        const user = await UserService.getBySlug(slug);
        if (!user) throw new NotFoundError('User not found by slug');
        return this.getByUser(user._id);
    }
}
