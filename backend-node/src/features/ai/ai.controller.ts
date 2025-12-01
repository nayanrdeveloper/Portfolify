import { NextFunction, Request, Response } from 'express';
import { AiService } from './ai.service';

const aiService = new AiService();

export const polishContent = async (req: Request, res: Response) => {
    try {
        const { text, tone } = req.body;
        if (!text) {
            res.status(400).json({ success: false, message: 'Text is required' });
            return;
        }

        const polishedText = await aiService.polishContent(text, tone);
        res.status(200).json({ success: true, data: polishedText });
    } catch (error: any) {
        console.error('Controller Error:', error);
        res.status(500).json({ success: false, message: error.message || 'Internal Server Error' });
    }
};

export const tailorResume = async (req: Request, res: Response) => {
    try {
        const { profile, jobDescription } = req.body;

        if (!profile || !jobDescription) {
            res.status(400).json({ success: false, message: 'Profile and Job Description are required' });
            return;
        }

        const analysis = await aiService.tailorResume(profile, jobDescription);
        res.status(200).json({ success: true, data: analysis });
    } catch (error: any) {
        console.error('Controller Error (Tailor):', error);
        res.status(500).json({ success: false, message: error.message || 'Internal Server Error' });
    }
};
