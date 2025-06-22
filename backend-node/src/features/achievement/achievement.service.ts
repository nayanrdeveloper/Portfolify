import { Types } from 'mongoose';
import { ForbiddenError, NotFoundError } from '../../core/errors/ApiError';
import { Achievement } from './achievement.interface';
import { AchievementModel } from './achievement.model';

export class AchievementService {
    static async getById(id: string) {
        const ach = await AchievementModel.findById(id);
        if (!ach) throw new NotFoundError('Achievement not found');
        return ach;
    }

    static async validateOwner(achId: string, userId: string) {
        const ach = await this.getById(achId);
        if (ach.user.toString() !== userId)
            throw new ForbiddenError('Not allowed to modify this achievement');
        return ach;
    }

    static create(
        userId: Types.ObjectId,
        payload: Omit<Achievement, 'user' | '_id' | 'createdAt'>,
    ) {
        return AchievementModel.create({ ...payload, user: userId });
    }

    static async update(achId: string, userId: string, changes: Partial<Achievement>) {
        await this.validateOwner(achId, userId);
        return AchievementModel.findByIdAndUpdate(achId, changes, { new: true });
    }

    static async remove(achId: string, userId: string) {
        await this.validateOwner(achId, userId);
        await AchievementModel.findByIdAndDelete(achId);
    }

    static listByUser(userId: Types.ObjectId) {
        return AchievementModel.find({ user: userId }).sort({ issueDate: -1 }).lean();
    }
}
