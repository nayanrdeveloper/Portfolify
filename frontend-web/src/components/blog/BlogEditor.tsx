'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { TiptapEditor } from '@/components/ui/tiptap-editor';
import { Loader2, Save } from 'lucide-react';
import { useState } from 'react';
import { Textarea } from '../ui/textarea';

interface BlogData {
    title: string;
    content: string;
    summary?: string;
    coverImage?: string;
    tags?: string[];
    isPublished?: boolean;
}

interface BlogEditorProps {
    initialData?: BlogData;
    onSubmit: (data: BlogData) => Promise<void>;
    isSubmitting?: boolean;
}

export function BlogEditor({ initialData, onSubmit, isSubmitting = false }: BlogEditorProps) {
    const [formData, setFormData] = useState<BlogData>({
        title: initialData?.title || '',
        content: initialData?.content || '',
        summary: initialData?.summary || '',
        coverImage: initialData?.coverImage || '',
        tags: initialData?.tags || [],
        isPublished: initialData?.isPublished || false,
    });

    const [tagsInput, setTagsInput] = useState(initialData?.tags?.join(', ') || '');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTagsInput(e.target.value);
        const tags = e.target.value.split(',').map(tag => tag.trim()).filter(Boolean);
        setFormData(prev => ({ ...prev, tags }));
    };

    const handleSwitchChange = (checked: boolean) => {
        setFormData(prev => ({ ...prev, isPublished: checked }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Article Title"
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="coverImage">Cover Image URL</Label>
                    <Input
                        id="coverImage"
                        name="coverImage"
                        value={formData.coverImage}
                        onChange={handleChange}
                        placeholder="https://example.com/image.jpg"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="summary">Summary (Optional)</Label>
                <Textarea
                    id="summary"
                    name="summary"
                    value={formData.summary}
                    onChange={handleChange}
                    placeholder="Brief summary for SEO and previews..."
                    rows={2}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input
                    id="tags"
                    value={tagsInput}
                    onChange={handleTagsChange}
                    placeholder="React, TypeScript, Web Development"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <TiptapEditor
                    value={formData.content}
                    onChange={(content: string) => setFormData(prev => ({ ...prev, content }))}
                />
            </div>

            <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                    <Label className="text-base">Publish Status</Label>
                    <p className="text-sm text-muted-foreground">
                        {formData.isPublished
                            ? 'This article will be visible to everyone.'
                            : 'This article is currently a draft.'}
                    </p>
                </div>
                <Switch
                    checked={formData.isPublished}
                    onCheckedChange={handleSwitchChange}
                />
            </div>

            <div className="flex justify-end">
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    <Save className="mr-2 h-4 w-4" />
                    Save Article
                </Button>
            </div>
        </form>
    );
}
