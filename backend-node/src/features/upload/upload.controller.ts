// src/features/upload/upload.controller.ts
import { NextFunction, Request, Response } from 'express';
import { BadRequestError } from '../../core/errors/ApiError';
import { UploadService } from './upload.service';

export const uploadSingle = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const file = req.file!;
        UploadService.validate(file);

        const url = await UploadService.uploadFile(file, req.query.folder as string);
        res.json({ message: 'File uploaded', data: { secureUrl: url } });
    } catch (err) {
        next(err);
    }
};

export const uploadMultiple = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const files = req.files as Express.Multer.File[];
        if (!files?.length) throw new BadRequestError('No files provided');

        const urls: string[] = [];
        for (const f of files) {
            UploadService.validate(f);
            urls.push(await UploadService.uploadFile(f, req.query.folder as string));
        }
        res.json({ message: 'Files uploaded', data: { secureUrls: urls } });
    } catch (err) {
        next(err);
    }
};
