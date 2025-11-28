'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Achievement, AchievementFormData, achievementSchema } from '@/features/onboarding/schema';
import api from '@/lib/api';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Award,
    Calendar,
    ExternalLink,
    Loader2,
    MoreVertical,
    Pencil,
    Plus,
    Trash2,
    Upload,
} from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

export default function DashboardCertificatesPage() {
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingAchievement, setEditingAchievement] = useState<Achievement | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors },
    } = useForm<AchievementFormData>({
        resolver: zodResolver(achievementSchema),
        defaultValues: {
            name: '',
            issuer: '',
            issueDate: '',
            expirationDate: '',
            credentialID: '',
            credentialURL: '',
            mediaUrl: '',
            description: '',
        },
    });

    const mediaUrl = watch('mediaUrl');

    useEffect(() => {
        fetchAchievements();
    }, []);

    const fetchAchievements = async () => {
        try {
            // Note: The backend route is /achievements/user/:slug, but for dashboard we might need a direct list route
            // or we fetch user first. Assuming we can fetch user's achievements via a protected route or similar.
            // Let's check the routes. The route is /achievements/user/:slug (public) and /achievements/:id (get one).
            // There isn't a "list my achievements" route explicitly shown in the route file I viewed,
            // but usually there's one or we use the user slug.
            // Let's try fetching user profile first to get slug, or assume there's a route.
            // Actually, looking at other pages, they use api.get('/projects') which implies a "list mine" route exists.
            // Let's assume api.get('/achievements') works if implemented, or I might need to fix the backend route.
            // The backend route file showed: router.get('/user/:slug', listBySlug); and router.post('/', createAchievement);
            // It seems missing a "list mine" route. I might need to use listBySlug with the current user's slug.
            // For now, let's try to get the current user's slug from the store.

            // Wait, I can get user from store.
            const userStr = localStorage.getItem('user');
            if (userStr) {
                const user = JSON.parse(userStr);
                if (user.slug) {
                    const response = await api.get(`/achievements/user/${user.slug}`);
                    setAchievements(response.data.data);
                }
            }
        } catch (error) {
            console.error('Failed to fetch achievements', error);
        } finally {
            setIsFetching(false);
        }
    };

    const handleOpenDialog = (achievement?: Achievement) => {
        if (achievement) {
            setEditingAchievement(achievement);
            setValue('name', achievement.name);
            setValue('issuer', achievement.issuer);
            setValue(
                'issueDate',
                achievement.issueDate
                    ? new Date(achievement.issueDate).toISOString().split('T')[0]
                    : '',
            );
            setValue(
                'expirationDate',
                achievement.expirationDate
                    ? new Date(achievement.expirationDate).toISOString().split('T')[0]
                    : '',
            );
            setValue('credentialID', achievement.credentialID || '');
            setValue('credentialURL', achievement.credentialURL || '');
            setValue('mediaUrl', achievement.mediaUrl || '');
            setValue('description', achievement.description || '');
        } else {
            setEditingAchievement(null);
            reset({
                name: '',
                issuer: '',
                issueDate: '',
                expirationDate: '',
                credentialID: '',
                credentialURL: '',
                mediaUrl: '',
                description: '',
            });
        }
        setIsDialogOpen(true);
    };

    const onSubmit = async (data: AchievementFormData) => {
        setIsLoading(true);
        try {
            if (editingAchievement) {
                const response = await api.put(`/achievements/${editingAchievement._id}`, data);
                setAchievements(
                    achievements.map(a =>
                        a._id === editingAchievement._id ? response.data.data : a,
                    ),
                );
            } else {
                const response = await api.post('/achievements', data);
                setAchievements([...achievements, response.data.data]);
            }
            setIsDialogOpen(false);
            reset();
        } catch (error) {
            console.error('Failed to save achievement', error);
            alert('Failed to save achievement');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this certificate?')) return;
        try {
            await api.delete(`/achievements/${id}`);
            setAchievements(achievements.filter(a => a._id !== id));
        } catch (error) {
            console.error('Failed to delete achievement', error);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        setIsUploading(true);
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await api.post('/uploads/single', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            const url = response.data.data.url;
            setValue('mediaUrl', url);
        } catch (error) {
            console.error('Upload failed', error);
            alert('Upload failed');
        } finally {
            setIsUploading(false);
        }
    };

    if (isFetching) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Certificates & Achievements
                    </h1>
                    <p className="text-muted-foreground">
                        Showcase your certifications, awards, and badges.
                    </p>
                </div>
                <Button onClick={() => handleOpenDialog()}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Certificate
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {achievements.map(achievement => (
                    <Card key={achievement._id} className="overflow-hidden group flex flex-col">
                        <div className="aspect-video relative bg-muted">
                            {achievement.mediaUrl ? (
                                <Image
                                    src={achievement.mediaUrl}
                                    alt={achievement.name}
                                    fill
                                    className="object-cover transition-transform group-hover:scale-105"
                                    unoptimized
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground bg-secondary/30">
                                    <Award className="h-12 w-12 opacity-20" />
                                </div>
                            )}
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="secondary" size="icon" className="h-8 w-8">
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem
                                            onClick={() => handleOpenDialog(achievement)}
                                        >
                                            <Pencil className="mr-2 h-4 w-4" /> Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            className="text-red-600"
                                            onClick={() => handleDelete(achievement._id)}
                                        >
                                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                        <CardHeader className="pb-2">
                            <CardTitle className="line-clamp-1 text-lg">
                                {achievement.name}
                            </CardTitle>
                            <p className="text-sm font-medium text-primary">{achievement.issuer}</p>
                        </CardHeader>
                        <CardContent className="flex-1 flex flex-col gap-4">
                            <div className="flex items-center text-xs text-muted-foreground gap-4">
                                <span className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    Issued: {new Date(achievement.issueDate).toLocaleDateString()}
                                </span>
                                {achievement.expirationDate && (
                                    <span className="flex items-center gap-1">
                                        <Calendar className="h-3 w-3" />
                                        Expires:{' '}
                                        {new Date(achievement.expirationDate).toLocaleDateString()}
                                    </span>
                                )}
                            </div>

                            {achievement.description && (
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                    {achievement.description}
                                </p>
                            )}

                            <div className="mt-auto pt-2 flex gap-3">
                                {achievement.credentialURL && (
                                    <a
                                        href={achievement.credentialURL}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-xs flex items-center text-primary hover:underline"
                                    >
                                        <ExternalLink className="h-3 w-3 mr-1" /> Verify Credential
                                    </a>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
                {achievements.length === 0 && (
                    <div className="col-span-full text-center py-12 border-2 border-dashed rounded-lg text-muted-foreground">
                        <p>No certificates found. Add your first certificate to get started!</p>
                    </div>
                )}
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            {editingAchievement ? 'Edit Certificate' : 'Add New Certificate'}
                        </DialogTitle>
                        <DialogDescription>
                            {editingAchievement
                                ? 'Update certificate details.'
                                : 'Add a new certificate or award.'}
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Certificate Name</Label>
                            <Input
                                id="name"
                                placeholder="e.g. AWS Certified Solutions Architect"
                                {...register('name')}
                            />
                            {errors.name && (
                                <p className="text-sm text-red-500">{errors.name.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="issuer">Issuing Organization</Label>
                            <Input
                                id="issuer"
                                placeholder="e.g. Amazon Web Services"
                                {...register('issuer')}
                            />
                            {errors.issuer && (
                                <p className="text-sm text-red-500">{errors.issuer.message}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="issueDate">Issue Date</Label>
                                <Input id="issueDate" type="date" {...register('issueDate')} />
                                {errors.issueDate && (
                                    <p className="text-sm text-red-500">
                                        {errors.issueDate.message}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="expirationDate">Expiration Date (Optional)</Label>
                                <Input
                                    id="expirationDate"
                                    type="date"
                                    {...register('expirationDate')}
                                />
                                {errors.expirationDate && (
                                    <p className="text-sm text-red-500">
                                        {errors.expirationDate.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="credentialID">Credential ID (Optional)</Label>
                                <Input
                                    id="credentialID"
                                    placeholder="e.g. ABC-123-XYZ"
                                    {...register('credentialID')}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="credentialURL">Credential URL (Optional)</Label>
                                <Input
                                    id="credentialURL"
                                    type="url"
                                    placeholder="https://..."
                                    {...register('credentialURL')}
                                />
                                {errors.credentialURL && (
                                    <p className="text-sm text-red-500">
                                        {errors.credentialURL.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description (Optional)</Label>
                            <Textarea
                                id="description"
                                placeholder="Brief description of the achievement..."
                                {...register('description')}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Certificate Image</Label>
                            <div className="flex items-center gap-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => document.getElementById('cert-upload')?.click()}
                                    disabled={isUploading}
                                >
                                    {isUploading ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                        <Upload className="mr-2 h-4 w-4" />
                                    )}
                                    Upload Image
                                </Button>
                                <input
                                    id="cert-upload"
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleFileUpload}
                                />
                            </div>

                            {mediaUrl && (
                                <div className="mt-4 relative aspect-video w-full rounded-md overflow-hidden border group">
                                    <Image
                                        src={mediaUrl}
                                        alt="Certificate Preview"
                                        fill
                                        className="object-cover"
                                        unoptimized
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setValue('mediaUrl', '')}
                                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            )}
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsDialogOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {editingAchievement ? 'Save Changes' : 'Add Certificate'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
