import { Types } from 'mongoose';
import { NotFoundError } from '../../core/errors/ApiError';
import { SocialModel } from './social.model';
import { upsertSocialSchema } from './social.schema';

export class SocialService {
    static async getByUser(userId: Types.ObjectId) {
        return SocialModel.findOne({ user: userId }).lean();
    }

    static async upsert(userId: Types.ObjectId, payload: unknown) {
        const data = upsertSocialSchema.parse(payload);

        return SocialModel.findOneAndUpdate(
            { user: userId },
            { links: data.links },
            { upsert: true, new: true, setDefaultsOnInsert: true },
        );
    }

    /* util for slug controller */
    static async publicBySlug(slug: string) {
        const user = await (await import('../user/user.service')).UserService.getBySlug(slug);
        if (!user) throw new NotFoundError('User not found by slug');
        return SocialModel.findOne({ user: user._id }).lean();
    }
}
