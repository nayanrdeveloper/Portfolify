import { NextFunction, Request, Response } from 'express';
import { AiService } from './ai.service';

const aiService = new AiService();

export const polishContent = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { text, tone } = req.body;
        console.log('AI Polish Request:', { textLength: text?.length, tone });

        if (!text) {
            res.status(400).json({ message: 'Text is required' });
            return;
        }

        const polishedText = await aiService.polishContent(text, tone);
        res.json({ message: 'Content polished', data: polishedText });
    } catch (e: any) {
        console.error('AI Controller Error:', e);
        res.status(500).json({ message: e.message || 'Internal Server Error' });
        next(e);
    }
};
