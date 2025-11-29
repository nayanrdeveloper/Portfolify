// src/core/cloudinary/manager.ts
import { v2 as cloudinary, UploadApiOptions, UploadApiResponse } from 'cloudinary';
import { env } from '../../config/env';

cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
});

export class CloudinaryManager {
    static async upload(
        buffer: Buffer,
        filename: string,
        folder = 'portfolio_uploads',
    ): Promise<UploadApiResponse> {
        const opts: UploadApiOptions = {
            folder,
            public_id: filename,
            overwrite: true,
            resource_type: 'auto',
        };
        return new Promise((resolve, reject) => {
            cloudinary.uploader
                .upload_stream(opts, (err, res) => (err ? reject(err) : resolve(res!)))
                .end(buffer);
        });
    }
    static async delete(publicId: string): Promise<void> {
        return new Promise((resolve, reject) => {
            cloudinary.uploader.destroy(publicId, (err, res) => {
                if (err) return reject(err);
                resolve();
            });
        });
    }
}
