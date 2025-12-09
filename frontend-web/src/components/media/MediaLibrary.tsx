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
import { AnimatePresence, motion } from 'framer-motion';
import {
    Check,
    Copy,
    Image as ImageIcon,
    Loader2,
    Trash2,
    UploadCloud,
    X,
} from 'lucide-react';
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

    // Extract conflicting props to prevent type errors with Framer Motion
    const {
        onAnimationStart: _1,
        onDrag: _2,
        onDragStart: _3,
        onDragEnd: _4,
        ...rootProps
    } = getRootProps();

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

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05,
            },
        },
    };

    const item = {
        hidden: { opacity: 0, scale: 0.9 },
        show: { opacity: 1, scale: 1 },
    };

    return (
        <div className="space-y-6">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                {...rootProps}
                className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all duration-300 group ${isDragActive
                    ? 'border-indigo-500 bg-indigo-50/50 scale-[1.02]'
                    : 'border-slate-200/50 hover:border-indigo-400 hover:bg-slate-50/50'
                    }`}
            >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center gap-3 text-slate-500">
                    <div className={`p-4 rounded-full transition-colors ${isDragActive ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 group-hover:bg-indigo-50 group-hover:text-indigo-500'
                        }`}>
                        {uploading ? (
                            <Loader2 className="h-8 w-8 animate-spin" />
                        ) : (
                            <UploadCloud className="h-8 w-8" />
                        )}
                    </div>
                    <div>
                        <p className="text-base font-semibold text-foreground">
                            {uploading
                                ? 'Uploading assets...'
                                : isDragActive
                                    ? 'Drop files to upload'
                                    : 'Drag & drop media here'}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                            or click to select from computer
                        </p>
                    </div>
                    <p className="text-xs text-muted-foreground/60 bg-muted/50 px-3 py-1 rounded-full mt-2">
                        Supports PNG, JPG, GIF, WEBP up to 5MB
                    </p>
                </div>
            </motion.div>

            {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {[1, 2, 3, 4, 5].map(i => (
                        <div
                            key={i}
                            className="aspect-square bg-muted/50 rounded-xl animate-pulse"
                        />
                    ))}
                </div>
            ) : media.length === 0 ? (
                <div className="text-center py-16 flex flex-col items-center border border-dashed border-slate-200 rounded-xl bg-slate-50/30">
                    <div className="h-16 w-16 bg-indigo-50 text-indigo-300 rounded-full flex items-center justify-center mb-4">
                        <ImageIcon className="h-8 w-8" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">No media yet</h3>
                    <p className="text-muted-foreground max-w-xs mx-auto">
                        Upload images to use them in your projects and blog posts.
                    </p>
                </div>
            ) : (
                <ScrollArea className={mode === 'select' ? 'h-[500px] pr-4' : 'h-auto'}>
                    <motion.div
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4"
                    >
                        <AnimatePresence>
                            {media.map(mediaItem => (
                                <motion.div
                                    key={mediaItem._id}
                                    variants={item}
                                    layout
                                    className="group relative aspect-square bg-card rounded-xl overflow-hidden border border-border/50 shadow-sm cursor-pointer hover:shadow-md hover:ring-2 hover:ring-indigo-500 transition-all"
                                    onClick={() => onSelect?.(mediaItem.url)}
                                >
                                    <Image
                                        src={mediaItem.url}
                                        alt="Uploaded media"
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                        unoptimized
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 backdrop-blur-[1px]">
                                        {mode === 'manage' && (
                                            <div className="flex gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                                <Button
                                                    variant="secondary"
                                                    size="icon"
                                                    className="h-8 w-8 rounded-full bg-white/90 hover:bg-white text-indigo-600 shadow-lg"
                                                    onClick={e => copyToClipboard(mediaItem.url, e)}
                                                    title="Copy URL"
                                                >
                                                    <Copy className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="icon"
                                                    className="h-8 w-8 rounded-full shadow-lg"
                                                    onClick={e => handleDelete(mediaItem._id, e)}
                                                    title="Delete"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        )}
                                        {mode === 'select' && (
                                            <div className="bg-indigo-500 text-white p-3 rounded-full shadow-xl transform scale-0 group-hover:scale-100 transition-transform">
                                                <Check className="h-6 w-6" />
                                            </div>
                                        )}
                                    </div>
                                    {mode === 'manage' && (
                                        <div className="absolute bottom-0 left-0 right-0 p-2 text-[10px] text-white/80 bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity truncate text-center">
                                            {new Date(mediaItem.createdAt).toLocaleDateString()}
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
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
                    <div className="relative group cursor-pointer border-2 border-dashed border-muted rounded-xl bg-muted/10 hover:border-indigo-400 hover:bg-indigo-50/10 transition-all duration-300 overflow-hidden">
                        {value ? (
                            <div className="relative aspect-video w-full">
                                <Image src={value} alt="Selected" fill className="object-cover" unoptimized />
                                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                                    <ImageIcon className="h-8 w-8 text-white mb-2" />
                                    <span className="text-white font-medium text-sm">Change Image</span>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground group-hover:text-indigo-500 transition-colors">
                                <div className="p-3 bg-muted rounded-full mb-3 group-hover:bg-indigo-100 transition-colors">
                                    <ImageIcon className="h-6 w-6" />
                                </div>
                                <span className="text-sm font-medium">Select Image</span>
                            </div>
                        )}
                    </div>
                )}
            </DialogTrigger>
            <DialogContent className="max-w-4xl h-[80vh] flex flex-col p-6 overflow-hidden border-indigo-100/20 bg-background/95 backdrop-blur-xl">
                <DialogHeader className="pb-4 border-b">
                    <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
                        Media Library
                    </DialogTitle>
                </DialogHeader>
                <Tabs defaultValue="library" className="flex-1 flex flex-col overflow-hidden">
                    <TabsList className="grid w-full grid-cols-2 mb-4">
                        <TabsTrigger value="library">Library</TabsTrigger>
                        <TabsTrigger value="url">Direct URL</TabsTrigger>
                    </TabsList>
                    <TabsContent value="library" className="flex-1 overflow-auto mt-0 pr-2">
                        <MediaLibrary mode="select" onSelect={handleSelect} />
                    </TabsContent>
                    <TabsContent value="url" className="mt-4">
                        <div className="flex gap-2">
                            <Input
                                placeholder="https://example.com/image.jpg"
                                defaultValue={value}
                                onChange={e => onChange(e.target.value)}
                                className="bg-muted/50 border-input focus:border-indigo-500"
                            />
                            <Button
                                onClick={() => setOpen(false)}
                                className="bg-indigo-600 hover:bg-indigo-700"
                            >
                                Save
                            </Button>
                        </div>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}
