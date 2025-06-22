import { Types } from 'mongoose';
import { BadRequestError, ForbiddenError, NotFoundError } from '../../core/errors/ApiError';
import { ContactMessage } from './contact.interface';
import { ContactModel } from './contact.model';

export class ContactService {
    static async create(
        ownerId: Types.ObjectId,
        data: Omit<ContactMessage, '_id' | 'ownerUser' | 'createdAt'>,
    ) {
        if (!data.message) throw new BadRequestError('Message is required');
        return ContactModel.create({ ...data, ownerUser: ownerId });
    }

    static async list(ownerId: Types.ObjectId) {
        return ContactModel.find({ ownerUser: ownerId }).sort({ createdAt: -1 }).lean();
    }

    static async getById(id: string) {
        const msg = await ContactModel.findById(id);
        if (!msg) throw new NotFoundError('Contact message not found');
        return msg;
    }

    static async remove(id: string, ownerId: string) {
        const msg = await this.getById(id);
        if (msg.ownerUser.toString() !== ownerId)
            throw new ForbiddenError('Not allowed to delete this message');
        await msg.deleteOne();
    }
}
