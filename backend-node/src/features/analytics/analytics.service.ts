import { BlogModel } from '../blog/blog.model';
import { ProjectModel } from '../project/project.model';
import { UserModel } from '../user/user.model';

export class AnalyticsService {
    async trackProfileView(username: string) {
        // Find user by slug (username) and increment profileViews
        // We use findOneAndUpdate to be atomic
        await UserModel.findOneAndUpdate({ slug: username }, { $inc: { profileViews: 1 } });
    }

    async trackProjectClick(projectId: string) {
        await ProjectModel.findByIdAndUpdate(projectId, { $inc: { clicks: 1 } });
    }

    async trackArticleRead(blogId: string) {
        await BlogModel.findByIdAndUpdate(blogId, { $inc: { views: 1 } });
    }

    async getDashboardStats(userId: string) {
        const user = await UserModel.findById(userId);
        if (!user) throw new Error('User not found');

        // Aggregate project clicks
        const projects = await ProjectModel.find({ user: userId });
        const totalProjectClicks = projects.reduce((sum, p) => sum + (p.clicks || 0), 0);

        // Aggregate blog views
        const blogs = await BlogModel.find({ user: userId });
        const totalArticleReads = blogs.reduce((sum, b) => sum + (b.views || 0), 0);

        return {
            profileViews: user.profileViews || 0,
            projectClicks: totalProjectClicks,
            articleReads: totalArticleReads,
        };
    }
}
