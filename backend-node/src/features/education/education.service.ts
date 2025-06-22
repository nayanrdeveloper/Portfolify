import { Types } from 'mongoose';
import { ForbiddenError, NotFoundError } from '../../core/errors/ApiError';
import { Education } from './education.interface';
import { EducationModel } from './education.model';

export class EducationService {
    static async create(
        userId: Types.ObjectId,
        payload: Omit<Education, 'user' | '_id' | 'createdAt'>,
    ) {
        return EducationModel.create({ ...payload, user: userId });
    }

    /* -------- helpers -------- */
    static async getById(id: string) {
        const edu = await EducationModel.findById(id);
        if (!edu) throw new NotFoundError('Education not found');
        return edu;
    }

    static async validateOwner(eduId: string, userId: string) {
        const edu = await this.getById(eduId);
        if (edu.user.toString() !== userId)
            throw new ForbiddenError('Not allowed to modify this education');
        return edu;
    }

    /* -------- update -------- */
    static async update(eduId: string, userId: string, changes: Partial<Education>) {
        await this.validateOwner(eduId, userId);
        return EducationModel.findByIdAndUpdate(eduId, changes, { new: true });
    }

    /* -------- delete -------- */
    static async remove(eduId: string, userId: string) {
        await this.validateOwner(eduId, userId);
        await EducationModel.findByIdAndDelete(eduId);
    }

    /* -------- list by user -------- */
    static listByUser(userId: Types.ObjectId) {
        return EducationModel.find({ user: userId }).sort({ startDate: -1 }).lean();
    }
}
