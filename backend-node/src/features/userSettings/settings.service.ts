// settings.service.ts
import { Types } from 'mongoose';
import { NotFoundError } from '../../core/errors/ApiError';
import { UserService } from '../user/user.service';
import { SettingsModel } from './settings.model';
import { updateSettingsSchema } from './settings.schema';

export class SettingsService {
    static async getByUser(userId: Types.ObjectId) {
        return SettingsModel.findOne({ user: userId }).lean();
    }

    static async upsert(userId: Types.ObjectId, payload: unknown) {
        const data = updateSettingsSchema.parse(payload);

        return SettingsModel.findOneAndUpdate(
            { user: userId },
            {
                template: data.template,
                resumeTemplate: data.resumeTemplate,
                customization: data.customization,
                seo: data.seo,
            },
            { upsert: true, new: true, setDefaultsOnInsert: true },
        );
    }

    /* public read by slug */
    static async publicBySlug(slug: string) {
        const user = await UserService.getBySlug(slug);
        if (!user) throw new NotFoundError('User not found');
        const doc = await this.getByUser(user._id);
        return doc || { template: 'default' };
    }
}
