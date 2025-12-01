import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from '../../config/env';

export class AiService {
    private genAI: GoogleGenerativeAI;
    private model: any;

    constructor() {
        const apiKey = env.GEMINI_API_KEY;
        console.log('AiService initialized. API Key present:', !!apiKey);
        if (!apiKey) {
            console.warn('GEMINI_API_KEY is not set. AI features will not work.');
        }
        this.genAI = new GoogleGenerativeAI(apiKey || '');
        this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    }

    async polishContent(text: string, tone: string = 'professional'): Promise<string> {
        if (!env.GEMINI_API_KEY) {
            throw new Error('AI service is not configured (missing API key).');
        }

        const prompt = `Rewrite the following text to be more ${tone}, concise, and impactful for a professional portfolio. Do not add any introductory or concluding remarks, just return the polished text.

Text: "${text}"`;

        try {
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const polishedText = response.text();
            return polishedText.trim();
        } catch (error: any) {
            console.error('Gemini API Error Details:', JSON.stringify(error, null, 2));
            if (error.message) {
                console.error('Error Message:', error.message);
            }
            throw new Error(`AI Polish Failed: ${error.message || 'Unknown error'}`);
        }
    }

    async tailorResume(profile: any, jobDescription: string): Promise<any> {
        if (!env.GEMINI_API_KEY) {
            throw new Error('AI service is not configured (missing API key).');
        }

        const prompt = `You are an expert ATS (Applicant Tracking System) and Resume Coach.
        
        Analyze the following Candidate Profile against the provided Job Description.
        
        Job Description:
        "${jobDescription}"
        
        Candidate Profile (JSON):
        ${JSON.stringify(profile)}
        
        Provide the output in the following JSON format ONLY (no markdown formatting):
        {
            "matchScore": number (0-100),
            "missingKeywords": string[] (list of important keywords/skills from JD missing in profile),
            "rewrittenSummary": string (a tailored professional summary optimized for this JD),
            "improvementTips": string[] (3-5 specific, actionable tips to improve the resume for this role)
        }`;

        try {
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            // Clean up potential markdown code blocks if Gemini adds them
            const jsonString = text.replace(/```json/g, '').replace(/```/g, '').trim();
            return JSON.parse(jsonString);
        } catch (error: any) {
            console.error('Gemini API Error (Tailor):', error);
            throw new Error(`AI Tailor Failed: ${error.message || 'Unknown error'}`);
        }
    }
}
