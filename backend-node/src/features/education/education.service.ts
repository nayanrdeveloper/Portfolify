import { EducationModel } from './education.model';
import { Education } from './education.interface';

export class EducationService {
  static async create(payload: Partial<Education>) {
    return EducationModel.create(payload);
  }

  static async getByUser(userId: string) {
    return EducationModel.find({ user: userId }).lean();
  }
}
