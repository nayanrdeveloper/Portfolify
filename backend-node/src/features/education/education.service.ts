import { Education } from './education.interface';
import { EducationModel } from './education.model';

export class EducationService {
    static async create(payload: Partial<Education>) {
        return EducationModel.create(payload);
    }

    static async getByUser(userId: string) {
        return EducationModel.find({ user: userId }).lean();
    }
}
