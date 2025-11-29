// src/features/upload/upload.service.ts
import { CloudinaryManager } from '../../core/cloudinary/manager';
import { BadRequestError, NotFoundError } from '../../core/errors/ApiError';
import { MediaModel } from './media.model';

export class UploadService {
    static validate(file: Express.Multer.File) {
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (!allowedMimeTypes.includes(file.mimetype)) {
            throw new BadRequestError(
                'Invalid file type. Only JPEG, PNG, WEBP, and GIF are allowed.',
            );
        }

        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            throw new BadRequestError('File size too large. Max 5MB allowed.');
        }
    }

    static async uploadFile(
        file: Express.Multer.File,
        userId: string,
        folder: string = 'portfolify',
    ) {
        // Use CloudinaryManager to upload
        // We pass originalname as filename, CloudinaryManager uses it as public_id
        // We might want to sanitize it or append timestamp to avoid collisions if manager doesn't handle it
        // But for now let's trust the manager or just pass a unique name
        const uniqueName = `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9]/g, '')}`;

        const result = await CloudinaryManager.upload(file.buffer, uniqueName, folder);

        // Save to DB
        const media = await MediaModel.create({
            user: userId,
            url: result.secure_url,
            publicId: result.public_id,
            format: result.format,
            size: result.bytes,
        });

        return media;
    }

    static async getUserMedia(userId: string) {
        return MediaModel.find({ user: userId }).sort({ createdAt: -1 });
    }

    static async deleteMedia(mediaId: string, userId: string) {
        const media = await MediaModel.findOne({ _id: mediaId, user: userId });
        if (!media) throw new NotFoundError('Media not found');

        // Delete from Cloudinary
        await CloudinaryManager.delete(media.publicId);

        // Delete from DB
        await media.deleteOne();
    }
}
