import { Types } from 'mongoose';
import { BadRequestError, ConflictError, NotFoundError } from '../../core/errors/ApiError';
import { SkillCategory } from './category.interface';
import { CategoryModel } from './category.model';

export class CategoryService {
    /* ---------- helpers ---------- */
    static async getById(id: string) {
        const cat = await CategoryModel.findById(id);
        if (!cat) throw new NotFoundError('Category not found');
        return cat;
    }

    static async getByName(name: string) {
        return CategoryModel.findOne({ name });
    }

    /* ---------- CRUD ---------- */
    static async create(data: { name: string }) {
        if (await this.getByName(data.name))
            throw new ConflictError(`Category '${data.name}' already exists`);
        return CategoryModel.create(data);
    }

    static async list() {
        return CategoryModel.find().sort({ name: 1 }).lean();
    }

    static async update(id: string, changes: Partial<SkillCategory>) {
        if (changes.name && changes.name.trim() === '')
            throw new BadRequestError('Name cannot be empty');

        return CategoryModel.findByIdAndUpdate(id, changes, { new: true });
    }

    static async remove(id: string) {
        await CategoryModel.findByIdAndDelete(id);
    }

    /* ---------- util for skills later ---------- */
    static async getOrCreate(name: string): Promise<Types.ObjectId> {
        const existing = await this.getByName(name);
        if (existing) return existing._id;
        const created = await this.create({ name });
        return created._id;
    }

    static listByIds(ids: Types.ObjectId[]) {
        return CategoryModel.find({ _id: { $in: ids } }).lean();
    }
}
