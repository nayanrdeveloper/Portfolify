// src/features/upload/upload.controller.ts
import { NextFunction, Request, Response } from 'express';
import { BadRequestError } from '../../core/errors/ApiError';
import { UploadService } from './upload.service';

export const uploadSingle = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const file = req.file;
        if (!file) throw new BadRequestError('No file uploaded');

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const userId = (req as any).auth?.userId;

        if (!userId) throw new BadRequestError('User not authenticated');

        UploadService.validate(file);

        const media = await UploadService.uploadFile(file, userId, req.query.folder as string);
        res.json({ message: 'File uploaded', data: media });
    } catch (err) {
        next(err);
    }
};

export const uploadMultiple = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const files = req.files as Express.Multer.File[];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const userId = (req as any).auth?.userId;

        if (!files?.length) throw new BadRequestError('No files provided');

        const medias = [];
        for (const f of files) {
            UploadService.validate(f);
            medias.push(await UploadService.uploadFile(f, userId, req.query.folder as string));
        }
        res.json({ message: 'Files uploaded', data: medias });
    } catch (err) {
        next(err);
    }
};

export const getMediaLibrary = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const userId = (req as any).auth?.userId;
        const media = await UploadService.getUserMedia(userId);
        res.json({ success: true, data: media });
    } catch (err) {
        next(err);
    }
};

export const deleteMedia = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const userId = (req as any).auth?.userId;
        const { id } = req.params;
        await UploadService.deleteMedia(id, userId);
        res.json({ success: true, message: 'Media deleted' });
    } catch (err) {
        next(err);
    }
};
