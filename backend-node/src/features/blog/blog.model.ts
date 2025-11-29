import { Schema, model } from 'mongoose';
import { Blog } from './blog.interface';

const blogSchema = new Schema<Blog>(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
        title: { type: String, required: true },
        slug: { type: String, required: true, unique: true, index: true },
        content: { type: String, required: true },
        summary: { type: String },
        coverImage: { type: String },
        tags: [{ type: String }],
        isPublished: { type: Boolean, default: false },
        views: { type: Number, default: 0 },
    },
    { timestamps: true },
);

// Index for text search
blogSchema.index({ title: 'text', summary: 'text', tags: 'text' });

export const BlogModel = model<Blog>('Blog', blogSchema);
