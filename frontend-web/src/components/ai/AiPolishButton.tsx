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
import api from '@/lib/api';
import { Sparkles, Wand2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface AiPolishButtonProps {
    initialText: string;
    onPolished: (text: string) => void;
    className?: string;
}

export function AiPolishButton({ initialText, onPolished, className }: AiPolishButtonProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [polishedText, setPolishedText] = useState('');

    const handlePolish = async () => {
        if (!initialText || initialText.length < 10) {
            toast.error('Please enter at least 10 characters to polish.');
            return;
        }

        setLoading(true);
        try {
            console.log('Sending polish request for:', initialText);
            const res = await api.post('/ai/polish', { text: initialText });
            console.log('Polish response:', res.data);
            setPolishedText(res.data.data);
        } catch (error: any) {
            console.error('AI Polish failed', error);
            if (error.response) {
                console.error('Server Error Response:', error.response.data);
                toast.error(`Error: ${error.response.data.message || 'Failed to polish'}`);
            } else {
                toast.error('Failed to polish content. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleApply = () => {
        onPolished(polishedText);
        setOpen(false);
        setPolishedText('');
        toast.success('Polished content applied!');
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    className={`gap-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50 ${className}`}
                    onClick={(e) => {
                        // Prevent default if inside a form
                        e.preventDefault();
                        setOpen(true);
                    }}
                >
                    <Sparkles className="h-4 w-4" />
                    <span className="hidden sm:inline">AI Polish</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Wand2 className="h-5 w-5 text-purple-600" />
                        AI Content Polish
                    </DialogTitle>
                    <DialogDescription>
                        Use AI to rewrite your text to be more professional and impactful.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <h4 className="text-sm font-medium text-slate-500">Original</h4>
                        <div className="rounded-md bg-slate-50 p-3 text-sm text-slate-700">
                            {initialText || <span className="text-slate-400 italic">No text provided...</span>}
                        </div>
                    </div>

                    {polishedText && (
                        <div className="space-y-2">
                            <h4 className="text-sm font-medium text-purple-600">Polished Version</h4>
                            <Textarea
                                value={polishedText}
                                onChange={(e) => setPolishedText(e.target.value)}
                                className="min-h-[150px] border-purple-200 bg-purple-50/30 focus-visible:ring-purple-500"
                            />
                        </div>
                    )}
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                    {!polishedText ? (
                        <Button onClick={handlePolish} disabled={loading} className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700">
                            {loading ? (
                                <>
                                    <Sparkles className="mr-2 h-4 w-4 animate-spin" /> Polishing...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="mr-2 h-4 w-4" /> Generate Polish
                                </>
                            )}
                        </Button>
                    ) : (
                        <>
                            <Button variant="outline" onClick={() => setPolishedText('')}>
                                Try Again
                            </Button>
                            <Button onClick={handleApply} className="bg-green-600 hover:bg-green-700">
                                Apply Changes
                            </Button>
                        </>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
