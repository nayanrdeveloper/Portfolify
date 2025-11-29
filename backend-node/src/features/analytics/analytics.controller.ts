import { Request, Response } from 'express';
import { AnalyticsService } from './analytics.service';

const analyticsService = new AnalyticsService();

export const trackProfileView = async (req: Request, res: Response) => {
    try {
        const { username } = req.params;
        await analyticsService.trackProfileView(username);
        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to track view' });
    }
};

export const trackProjectClick = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await analyticsService.trackProjectClick(id);
        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to track click' });
    }
};

export const trackArticleRead = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await analyticsService.trackArticleRead(id);
        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to track read' });
    }
};

export const getDashboardStats = async (req: Request, res: Response) => {
    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const userId = (req as any).auth?.userId;
        if (!userId) {
            res.status(401).json({ success: false, message: 'Unauthorized' });
            return;
        }

        const stats = await analyticsService.getDashboardStats(userId);
        res.status(200).json({ success: true, data: stats });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch stats' });
    }
};
