import { Types } from 'mongoose';
import { BadRequestError, ForbiddenError, NotFoundError } from '../../core/errors/ApiError';
import { CategoryService } from '../category/category.service';
import { Skill } from './skill.interface';
import { SkillModel } from './skill.model';

export class SkillService {
    /* --- helpers --- */
    static async getById(id: string) {
        const sk = await SkillModel.findById(id);
        if (!sk) throw new NotFoundError('Skill not found');
        return sk;
    }
    static async ownerGuard(skillId: string, userId: string) {
        const sk = await this.getById(skillId);
        if (sk.user.toString() !== userId)
            throw new ForbiddenError('Not allowed to modify this skill');
        return sk;
    }

    /* --- create --- */
    static async create(
        userId: Types.ObjectId,
        data: {
            name: string;
            proficiency?: string;
            years?: number;
            iconName?: string;
            iconURL?: string;
            progress: number;
            categoryNames?: string[];
            categoryIds?: string[];
        },
    ) {
        /* 1. resolve categories */
        let catIds: Types.ObjectId[] = [];
        if (data.categoryIds?.length) {
            catIds = data.categoryIds.map(id => new Types.ObjectId(id));
        } else if (data.categoryNames?.length) {
            for (const n of data.categoryNames) {
                catIds.push(await CategoryService.getOrCreate(n));
            }
        }

        /* 2. build */
        return SkillModel.create({
            user: userId,
            name: data.name,
            proficiency: data.proficiency,
            years: data.years,
            iconName: data.iconName,
            iconURL: data.iconURL,
            progress: data.progress,
            categoryIds: catIds,
        });
    }

    /* --- update --- */
    static async update(skillId: string, userId: string, changes: Partial<Skill>) {
        await this.ownerGuard(skillId, userId);

        if (changes.progress !== undefined && (changes.progress < 0 || changes.progress > 100))
            throw new BadRequestError('Progress must be 0-100');

        return SkillModel.findByIdAndUpdate(skillId, changes, { new: true });
    }

    /* --- delete --- */
    static async remove(skillId: string, userId: string) {
        await this.ownerGuard(skillId, userId);
        await SkillModel.findByIdAndDelete(skillId);
    }

    /* --- list --- */
    static listByUser(userId: Types.ObjectId) {
        return SkillModel.find({ user: userId }).sort({ createdAt: -1 }).lean();
    }
}
