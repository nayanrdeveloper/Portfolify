import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2, Sparkles, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import api from '@/lib/api';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface ResumeTailorProps {
    profileData: any;
    onUpdateSummary: (newSummary: string) => void;
}

interface TailorResult {
    matchScore: number;
    missingKeywords: string[];
    rewrittenSummary: string;
    improvementTips: string[];
}

export function ResumeTailor({ profileData, onUpdateSummary }: ResumeTailorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [jobDescription, setJobDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<TailorResult | null>(null);

    const handleTailor = async () => {
        if (!jobDescription.trim()) return;

        setIsLoading(true);
        try {
            const response = await api.post('/ai/tailor', {
                profile: profileData,
                jobDescription,
            });
            setResult(response.data.data);
        } catch (error) {
            console.error('Failed to tailor resume', error);
            // Ideally show a toast here
        } finally {
            setIsLoading(false);
        }
    };

    const handleApplySummary = () => {
        if (result) {
            onUpdateSummary(result.rewrittenSummary);
            setIsOpen(false);
            setResult(null);
            setJobDescription('');
        }
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'bg-green-500';
        if (score >= 50) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                    <Sparkles className="h-4 w-4 text-purple-500" />
                    Tailor to Job
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-purple-500" />
                        AI Resume Tailor
                    </DialogTitle>
                    <DialogDescription>
                        Paste a job description to see how well your resume matches and get AI-powered suggestions.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto py-4 px-1">
                    {!result ? (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="jd">Job Description</Label>
                                <Textarea
                                    id="jd"
                                    placeholder="Paste the full job description here..."
                                    className="min-h-[200px]"
                                    value={jobDescription}
                                    onChange={e => setJobDescription(e.target.value)}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Match Score */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label className="text-base font-semibold">Match Score</Label>
                                    <span className={`font-bold text-lg ${result.matchScore >= 80 ? 'text-green-600' : result.matchScore >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                                        {result.matchScore}%
                                    </span>
                                </div>
                                <Progress value={result.matchScore} className="h-3" indicatorClassName={getScoreColor(result.matchScore)} />
                            </div>

                            {/* Missing Keywords */}
                            {result.missingKeywords.length > 0 && (
                                <div className="space-y-2">
                                    <Label className="text-base font-semibold flex items-center gap-2">
                                        <AlertCircle className="h-4 w-4 text-yellow-500" />
                                        Missing Keywords
                                    </Label>
                                    <div className="flex flex-wrap gap-2">
                                        {result.missingKeywords.map((keyword, idx) => (
                                            <Badge key={idx} variant="secondary" className="bg-yellow-50 text-yellow-800 hover:bg-yellow-100 border-yellow-200">
                                                {keyword}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Improvement Tips */}
                            {result.improvementTips.length > 0 && (
                                <div className="space-y-2">
                                    <Label className="text-base font-semibold flex items-center gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-blue-500" />
                                        Improvement Tips
                                    </Label>
                                    <ul className="space-y-2">
                                        {result.improvementTips.map((tip, idx) => (
                                            <li key={idx} className="text-sm text-muted-foreground flex gap-2 items-start">
                                                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0" />
                                                {tip}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Rewritten Summary */}
                            <Card className="bg-purple-50 border-purple-100">
                                <CardContent className="pt-6">
                                    <Label className="text-base font-semibold flex items-center gap-2 mb-2 text-purple-900">
                                        <Sparkles className="h-4 w-4 text-purple-600" />
                                        Suggested Professional Summary
                                    </Label>
                                    <p className="text-sm text-purple-800 leading-relaxed">
                                        {result.rewrittenSummary}
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                    {!result ? (
                        <Button onClick={handleTailor} disabled={isLoading || !jobDescription.trim()} className="w-full sm:w-auto">
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Analyzing...
                                </>
                            ) : (
                                <>
                                    Analyze Match
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </>
                            )}
                        </Button>
                    ) : (
                        <>
                            <Button variant="outline" onClick={() => setResult(null)}>
                                Try Another Job
                            </Button>
                            <Button onClick={handleApplySummary} className="bg-purple-600 hover:bg-purple-700">
                                Apply New Summary
                            </Button>
                        </>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
