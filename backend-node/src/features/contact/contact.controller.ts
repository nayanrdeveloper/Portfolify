import { NextFunction, Request, Response } from 'express';
import { Types } from 'mongoose';
import { ForbiddenError, NotFoundError } from '../../core/errors/ApiError';
import { UserService } from '../user/user.service';
import { createContactSchema } from './contact.schema';
import { ContactService } from './contact.service';

/* ── public: POST /contact/:slug ── */
export const createMessage = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const owner = await UserService.getBySlug(req.params.slug);
        if (!owner) throw new NotFoundError('User not found by slug');

        const data = createContactSchema.parse(req.body);
        const msg = await ContactService.create(owner._id, data as any);

        res.status(201).json({ message: 'Message sent', data: msg });
    } catch (e) {
        next(e);
    }
};

/* ── protected: GET /contact/messages ── */
export const listMessages = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const msgs = await ContactService.list(new Types.ObjectId(req.auth!.userId));
        res.json({ message: 'Messages retrieved', data: msgs });
    } catch (e) {
        next(e);
    }
};

/* ── protected: GET /contact/:id ── */
export const getMessage = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const msg = await ContactService.getById(req.params.id);
        if (msg.ownerUser.toString() !== req.auth!.userId)
            return next(new ForbiddenError('Not allowed to view this message'));
        res.json({ message: 'Message retrieved', data: msg });
    } catch (e) {
        next(e);
    }
};

/* ── protected: DELETE /contact/:id ── */
export const deleteMessage = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await ContactService.remove(req.params.id, req.auth!.userId);
        res.json({ message: 'Message deleted' });
    } catch (e) {
        next(e);
    }
};
