import { Types } from 'mongoose';
import { ForbiddenError, NotFoundError } from '../../core/errors/ApiError';
import { Experience } from './experience.interface';
import { ExperienceModel } from './experience.model';

export class ExperienceService {
    /* ------- helpers ------- */
    static async getById(id: string) {
        const exp = await ExperienceModel.findById(id);
        if (!exp) throw new NotFoundError('Experience not found');
        return exp;
    }

    static async validateOwner(expId: string, userId: string) {
        const exp = await this.getById(expId);
        if (exp.user.toString() !== userId)
            throw new ForbiddenError('Not allowed to modify this experience');
        return exp;
    }

    /* ------- create ------- */
    static create(userId: Types.ObjectId, payload: Omit<Experience, 'user' | '_id' | 'createdAt'>) {
        return ExperienceModel.create({ ...payload, user: userId });
    }

    /* ------- update ------- */
    static async update(expId: string, userId: string, changes: Partial<Experience>) {
        await this.validateOwner(expId, userId);
        return ExperienceModel.findByIdAndUpdate(expId, changes, { new: true });
    }

    /* ------- delete ------- */
    static async remove(expId: string, userId: string) {
        await this.validateOwner(expId, userId);
        await ExperienceModel.findByIdAndDelete(expId);
    }

    /* ------- list by user ------- */
    static listByUser(userId: Types.ObjectId) {
        return ExperienceModel.find({ user: userId }).sort({ startDate: -1 }).lean();
    }
}
