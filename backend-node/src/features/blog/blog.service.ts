import slugify from 'slugify';
import { NotFoundError } from '../../core/errors/ApiError';
import { Blog } from './blog.interface';
import { BlogModel } from './blog.model';

export class BlogService {
    static async create(userId: string, data: Partial<Blog>) {
        const slug = await this.generateUniqueSlug(data.title!, userId);
        return BlogModel.create({ ...data, user: userId, slug });
    }

    static async findAll(query: any) {
        const filter: any = {};
        if (query.isPublished) filter.isPublished = query.isPublished === 'true';
        if (query.userId) filter.user = query.userId;

        return BlogModel.find(filter).sort({ createdAt: -1 });
    }

    static async findBySlug(slug: string) {
        const blog = await BlogModel.findOne({ slug }).populate('user', 'fullName avatarUrl slug');
        if (!blog) throw new NotFoundError('Blog post not found');

        // Increment views
        blog.views += 1;
        await blog.save();

        return blog;
    }

    static async findById(id: string) {
        const blog = await BlogModel.findById(id);
        if (!blog) throw new NotFoundError('Blog post not found');
        return blog;
    }

    static async update(id: string, userId: string, data: Partial<Blog>) {
        const blog = await this.findById(id);
        if (blog.user.toString() !== userId) {
            throw new Error('Unauthorized to update this blog');
        }

        if (data.title && data.title !== blog.title) {
            data.slug = await this.generateUniqueSlug(data.title, userId);
        }

        Object.assign(blog, data);
        return blog.save();
    }

    static async delete(id: string, userId: string) {
        const blog = await this.findById(id);
        if (blog.user.toString() !== userId) {
            throw new Error('Unauthorized to delete this blog');
        }
        return blog.deleteOne();
    }

    private static async generateUniqueSlug(title: string, userId: string) {
        const baseSlug = slugify(title, { lower: true, strict: true });
        let slug = baseSlug;
        let counter = 1;

        while (await BlogModel.findOne({ slug })) {
            slug = `${baseSlug}-${counter}`;
            counter++;
        }
        return slug;
    }
}
