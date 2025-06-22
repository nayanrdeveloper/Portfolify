import { Types } from 'mongoose';
import { BadRequestError, ForbiddenError, NotFoundError } from '../../core/errors/ApiError';
import { Project } from './project.interface';
import { ProjectModel } from './project.model';

export class ProjectService {
    /* helpers */
    static async getById(id: string) {
        const prj = await ProjectModel.findById(id);
        if (!prj) throw new NotFoundError('Project not found');
        return prj;
    }

    static async validateOwner(projectId: string, userId: string) {
        const prj = await this.getById(projectId);
        if (prj.user.toString() !== userId)
            throw new ForbiddenError('Not allowed to modify this project');
        return prj;
    }

    /* CRUD */
    static create(userId: Types.ObjectId, data: Omit<Project, '_id' | 'user' | 'createdAt'>) {
        if (!data.name) throw new BadRequestError('Project name is required');
        return ProjectModel.create({ ...data, user: userId });
    }

    static async update(id: string, userId: string, changes: Partial<Project>) {
        await this.validateOwner(id, userId);
        return ProjectModel.findByIdAndUpdate(id, changes, { new: true });
    }

    static async remove(id: string, userId: string) {
        await this.validateOwner(id, userId);
        await ProjectModel.findByIdAndDelete(id);
    }

    static listByUser(userId: Types.ObjectId) {
        return ProjectModel.find({ user: userId }).sort({ createdAt: -1 }).lean();
    }
}
