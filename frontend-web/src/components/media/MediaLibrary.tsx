'use client';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import api from '@/lib/api';
import { Check, Copy, Image as ImageIcon, Loader2, Trash2, UploadCloud } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';

interface Media {
    _id: string;
    url: string;
    format: string;
    size: number;
    createdAt: string;
}

interface MediaLibraryProps {
    onSelect?: (url: string) => void;
    mode?: 'manage' | 'select';
}

export function MediaLibrary({ onSelect, mode = 'manage' }: MediaLibraryProps) {
    const [media, setMedia] = useState<Media[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    const fetchMedia = async () => {
        try {
            const res = await api.get('/uploads');
            setMedia(res.data.data);
        } catch (error) {
            console.error('Failed to fetch media', error);
            toast.error('Failed to load media library');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMedia();
    }, []);

    const onDrop = async (acceptedFiles: File[]) => {
        setUploading(true);
        try {
            const formData = new FormData();
            acceptedFiles.forEach(file => {
                formData.append('files', file);
            });

            await api.post('/uploads/multiple', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            toast.success('Files uploaded successfully');
            fetchMedia();
        } catch (error) {
            console.error('Upload failed', error);
            toast.error('Failed to upload files');
        } finally {
            setUploading(false);
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
        },
    });

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm('Are you sure you want to delete this image?')) return;

        try {
            await api.delete(`/uploads/${id}`);
            setMedia(prev => prev.filter(m => m._id !== id));
            toast.success('Image deleted');
        } catch (error) {
            console.error('Delete failed', error);
            toast.error('Failed to delete image');
        }
    };

    const copyToClipboard = (url: string, e: React.MouseEvent) => {
        e.stopPropagation();
        navigator.clipboard.writeText(url);
        toast.success('URL copied to clipboard');
    };

    return (
        <div className="space-y-6">
            <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                    isDragActive
                        ? 'border-primary bg-primary/5'
                        : 'border-slate-200 hover:border-primary'
                }`}
            >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center gap-2 text-slate-500">
                    {uploading ? (
                        <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    ) : (
                        <UploadCloud className="h-10 w-10" />
                    )}
                    <p className="text-sm font-medium">
                        {uploading
                            ? 'Uploading...'
                            : isDragActive
                              ? 'Drop files here'
                              : 'Drag & drop images here, or click to select'}
                    </p>
                    <p className="text-xs">Supports PNG, JPG, GIF, WEBP up to 5MB</p>
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map(i => (
                        <div
                            key={i}
                            className="aspect-square bg-slate-100 rounded-lg animate-pulse"
                        />
                    ))}
                </div>
            ) : media.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                    <ImageIcon className="h-12 w-12 mx-auto mb-3 opacity-20" />
                    <p>No images found. Upload some to get started.</p>
                </div>
            ) : (
                <ScrollArea className={mode === 'select' ? 'h-[400px]' : 'h-auto'}>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {media.map(item => (
                            <div
                                key={item._id}
                                className="group relative aspect-square bg-slate-100 rounded-lg overflow-hidden border cursor-pointer hover:ring-2 hover:ring-primary transition-all"
                                onClick={() => onSelect?.(item.url)}
                            >
                                <Image
                                    src={item.url}
                                    alt="Uploaded media"
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    {mode === 'manage' && (
                                        <>
                                            <Button
                                                variant="secondary"
                                                size="icon"
                                                className="h-8 w-8"
                                                onClick={e => copyToClipboard(item.url, e)}
                                                title="Copy URL"
                                            >
                                                <Copy className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="icon"
                                                className="h-8 w-8"
                                                onClick={e => handleDelete(item._id, e)}
                                                title="Delete"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </>
                                    )}
                                    {mode === 'select' && (
                                        <div className="bg-primary text-primary-foreground p-2 rounded-full">
                                            <Check className="h-4 w-4" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            )}
        </div>
    );
}

interface ImagePickerProps {
    value?: string;
    onChange: (url: string) => void;
    trigger?: React.ReactNode;
}

export function ImagePicker({ value, onChange, trigger }: ImagePickerProps) {
    const [open, setOpen] = useState(false);

    const handleSelect = (url: string) => {
        onChange(url);
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <div className="relative group cursor-pointer border-2 border-dashed border-slate-200 rounded-lg hover:border-primary transition-colors">
                        {value ? (
                            <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                                <Image src={value} alt="Selected" fill className="object-cover" />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="text-white font-medium">Change Image</span>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-slate-500">
                                <ImageIcon className="h-8 w-8 mb-2" />
                                <span className="text-sm">Click to select image</span>
                            </div>
                        )}
                    </div>
                )}
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Media Library</DialogTitle>
                </DialogHeader>
                <Tabs defaultValue="library">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="library">Library</TabsTrigger>
                        <TabsTrigger value="url">Direct URL</TabsTrigger>
                    </TabsList>
                    <TabsContent value="library" className="mt-4">
                        <MediaLibrary mode="select" onSelect={handleSelect} />
                    </TabsContent>
                    <TabsContent value="url" className="mt-4">
                        <div className="flex gap-2">
                            <Input
                                placeholder="https://example.com/image.jpg"
                                defaultValue={value}
                                onChange={e => onChange(e.target.value)}
                            />
                            <Button onClick={() => setOpen(false)}>Save</Button>
                        </div>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}
