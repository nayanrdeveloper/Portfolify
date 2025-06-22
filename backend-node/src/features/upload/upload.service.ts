// src/features/upload/upload.service.ts
import { CloudinaryManager } from '../../core/cloudinary/manager';
import { BadRequestError } from '../../core/errors/ApiError';

const MAX_SIZE = 20 * 1024 * 1024; // 20 MB
const ALLOWED_PREFIXES = ['image/', 'video/', 'application/pdf'];

export class UploadService {
    static validate(file: Express.Multer.File) {
        if (file.size > MAX_SIZE) throw new BadRequestError('File exceeds 20 MB');
        if (!ALLOWED_PREFIXES.some(p => file.mimetype.startsWith(p)))
            throw new BadRequestError(`Invalid type ${file.mimetype}; images, videos, pdf only`);
    }

    static async uploadFile(file: Express.Multer.File, folder?: string): Promise<string> {
        const res = await CloudinaryManager.upload(file.buffer, file.originalname, folder);
        return res.secure_url;
    }
}
