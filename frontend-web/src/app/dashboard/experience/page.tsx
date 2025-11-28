'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
    Education,
    EducationFormData,
    educationSchema,
    Experience,
    ExperienceFormData,
    experienceSchema,
} from '@/features/onboarding/schema';
import api from '@/lib/api';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Briefcase,
    GraduationCap,
    Loader2,
    MoreVertical,
    Pencil,
    Plus,
    Trash2,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

export default function DashboardExperiencePage() {
    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [educations, setEducations] = useState<Education[]>([]);
    const [isFetching, setIsFetching] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    // Dialog States
    const [isExpDialogOpen, setIsExpDialogOpen] = useState(false);
    const [isEduDialogOpen, setIsEduDialogOpen] = useState(false);
    const [editingExp, setEditingExp] = useState<Experience | null>(null);
    const [editingEdu, setEditingEdu] = useState<Education | null>(null);

    // Experience Form
    const {
        register: registerExp,
        handleSubmit: handleSubmitExp,
        reset: resetExp,
        setValue: setValueExp,
        formState: { errors: errorsExp },
    } = useForm<ExperienceFormData>({
        resolver: zodResolver(experienceSchema),
        defaultValues: { isCurrent: false },
    });

    // Education Form
    const {
        register: registerEdu,
        handleSubmit: handleSubmitEdu,
        reset: resetEdu,
        setValue: setValueEdu,
        formState: { errors: errorsEdu },
    } = useForm<EducationFormData>({
        resolver: zodResolver(educationSchema),
        defaultValues: { isCurrent: false },
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [expRes, eduRes] = await Promise.all([
                api.get('/experiences'),
                api.get('/educations'),
            ]);
            setExperiences(expRes.data.data);
            setEducations(eduRes.data.data);
        } catch (error) {
            console.error('Failed to fetch data', error);
        } finally {
            setIsFetching(false);
        }
    };

    // Experience Handlers
    const handleOpenExpDialog = (exp?: Experience) => {
        if (exp) {
            setEditingExp(exp);
            setValueExp('title', exp.title);
            setValueExp('company', exp.company);
            setValueExp('startDate', exp.startDate);
            setValueExp('endDate', exp.endDate || '');
            setValueExp('description', exp.description || '');
            setValueExp('isCurrent', !exp.endDate);
        } else {
            setEditingExp(null);
            resetExp({ isCurrent: false });
        }
        setIsExpDialogOpen(true);
    };

    const onSubmitExp = async (data: ExperienceFormData) => {
        setIsLoading(true);
        try {
            if (editingExp) {
                const response = await api.put(`/experiences/${editingExp._id}`, data);
                setExperiences(
                    experiences.map(e => (e._id === editingExp._id ? response.data.data : e)),
                );
            } else {
                const response = await api.post('/experiences', data);
                setExperiences([...experiences, response.data.data]);
            }
            setIsExpDialogOpen(false);
            resetExp();
        } catch (error) {
            console.error('Failed to save experience', error);
            alert('Failed to save experience');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteExp = async (id: string) => {
        if (!confirm('Delete this experience?')) return;
        try {
            await api.delete(`/experiences/${id}`);
            setExperiences(experiences.filter(e => e._id !== id));
        } catch (error) {
            console.error('Failed to delete experience', error);
        }
    };

    // Education Handlers
    const handleOpenEduDialog = (edu?: Education) => {
        if (edu) {
            setEditingEdu(edu);
            setValueEdu('institution', edu.institution);
            setValueEdu('degree', edu.degree);
            setValueEdu('startDate', edu.startDate);
            setValueEdu('endDate', edu.endDate || '');
            setValueEdu('isCurrent', !edu.endDate);
        } else {
            setEditingEdu(null);
            resetEdu({ isCurrent: false });
        }
        setIsEduDialogOpen(true);
    };

    const onSubmitEdu = async (data: EducationFormData) => {
        setIsLoading(true);
        try {
            if (editingEdu) {
                const response = await api.put(`/educations/${editingEdu._id}`, data);
                setEducations(
                    educations.map(e => (e._id === editingEdu._id ? response.data.data : e)),
                );
            } else {
                const response = await api.post('/educations', data);
                setEducations([...educations, response.data.data]);
            }
            setIsEduDialogOpen(false);
            resetEdu();
        } catch (error) {
            console.error('Failed to save education', error);
            alert('Failed to save education');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteEdu = async (id: string) => {
        if (!confirm('Delete this education?')) return;
        try {
            await api.delete(`/educations/${id}`);
            setEducations(educations.filter(e => e._id !== id));
        } catch (error) {
            console.error('Failed to delete education', error);
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
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Experience & Education</h1>
                <p className="text-muted-foreground">
                    Manage your professional background and academic history.
                </p>
            </div>

            <Tabs defaultValue="experience" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="experience" className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4" /> Work Experience
                    </TabsTrigger>
                    <TabsTrigger value="education" className="flex items-center gap-2">
                        <GraduationCap className="h-4 w-4" /> Education
                    </TabsTrigger>
                </TabsList>

                {/* Experience Tab */}
                <TabsContent value="experience" className="space-y-4">
                    <div className="flex justify-end">
                        <Button onClick={() => handleOpenExpDialog()}>
                            <Plus className="mr-2 h-4 w-4" /> Add Experience
                        </Button>
                    </div>
                    <div className="grid gap-4">
                        {experiences.map(exp => (
                            <Card key={exp._id}>
                                <CardContent className="p-6 flex justify-between items-start">
                                    <div>
                                        <h3 className="font-semibold text-lg">{exp.title}</h3>
                                        <p className="text-primary font-medium">{exp.company}</p>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            {exp.startDate} — {exp.endDate || 'Present'}
                                        </p>
                                        {exp.description && (
                                            <p className="text-sm text-muted-foreground mt-2 max-w-2xl">
                                                {exp.description}
                                            </p>
                                        )}
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem
                                                onClick={() => handleOpenExpDialog(exp)}
                                            >
                                                <Pencil className="mr-2 h-4 w-4" /> Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                className="text-red-600"
                                                onClick={() => handleDeleteExp(exp._id)}
                                            >
                                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </CardContent>
                            </Card>
                        ))}
                        {experiences.length === 0 && (
                            <div className="text-center py-12 border-2 border-dashed rounded-lg text-muted-foreground">
                                <p>No work experience added yet.</p>
                            </div>
                        )}
                    </div>
                </TabsContent>

                {/* Education Tab */}
                <TabsContent value="education" className="space-y-4">
                    <div className="flex justify-end">
                        <Button onClick={() => handleOpenEduDialog()}>
                            <Plus className="mr-2 h-4 w-4" /> Add Education
                        </Button>
                    </div>
                    <div className="grid gap-4">
                        {educations.map(edu => (
                            <Card key={edu._id}>
                                <CardContent className="p-6 flex justify-between items-start">
                                    <div>
                                        <h3 className="font-semibold text-lg">{edu.institution}</h3>
                                        <p className="text-primary font-medium">{edu.degree}</p>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            {edu.startDate} — {edu.endDate || 'Present'}
                                        </p>
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem
                                                onClick={() => handleOpenEduDialog(edu)}
                                            >
                                                <Pencil className="mr-2 h-4 w-4" /> Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                className="text-red-600"
                                                onClick={() => handleDeleteEdu(edu._id)}
                                            >
                                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </CardContent>
                            </Card>
                        ))}
                        {educations.length === 0 && (
                            <div className="text-center py-12 border-2 border-dashed rounded-lg text-muted-foreground">
                                <p>No education added yet.</p>
                            </div>
                        )}
                    </div>
                </TabsContent>
            </Tabs>

            {/* Experience Dialog */}
            <Dialog open={isExpDialogOpen} onOpenChange={setIsExpDialogOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>
                            {editingExp ? 'Edit Experience' : 'Add Experience'}
                        </DialogTitle>
                        <DialogDescription>
                            {editingExp
                                ? 'Update your work history.'
                                : 'Add a new work experience.'}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmitExp(onSubmitExp)} className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Job Title</Label>
                                <Input
                                    id="title"
                                    placeholder="Senior Developer"
                                    {...registerExp('title')}
                                />
                                {errorsExp.title && (
                                    <p className="text-xs text-red-500">
                                        {errorsExp.title.message}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="company">Company</Label>
                                <Input
                                    id="company"
                                    placeholder="Acme Corp"
                                    {...registerExp('company')}
                                />
                                {errorsExp.company && (
                                    <p className="text-xs text-red-500">
                                        {errorsExp.company.message}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="startDate">Start Date</Label>
                                <Input id="startDate" type="date" {...registerExp('startDate')} />
                                {errorsExp.startDate && (
                                    <p className="text-xs text-red-500">
                                        {errorsExp.startDate.message}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="endDate">End Date</Label>
                                <Input id="endDate" type="date" {...registerExp('endDate')} />
                                {errorsExp.endDate && (
                                    <p className="text-xs text-red-500">
                                        {errorsExp.endDate.message}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                placeholder="Describe your role..."
                                {...registerExp('description')}
                            />
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsExpDialogOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {editingExp ? 'Save Changes' : 'Add Experience'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Education Dialog */}
            <Dialog open={isEduDialogOpen} onOpenChange={setIsEduDialogOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>{editingEdu ? 'Edit Education' : 'Add Education'}</DialogTitle>
                        <DialogDescription>
                            {editingEdu
                                ? 'Update your academic history.'
                                : 'Add a new education entry.'}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmitEdu(onSubmitEdu)} className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="institution">Institution</Label>
                                <Input
                                    id="institution"
                                    placeholder="University of Tech"
                                    {...registerEdu('institution')}
                                />
                                {errorsEdu.institution && (
                                    <p className="text-xs text-red-500">
                                        {errorsEdu.institution.message}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="degree">Degree</Label>
                                <Input
                                    id="degree"
                                    placeholder="B.S. Computer Science"
                                    {...registerEdu('degree')}
                                />
                                {errorsEdu.degree && (
                                    <p className="text-xs text-red-500">
                                        {errorsEdu.degree.message}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="eduStartDate">Start Date</Label>
                                <Input
                                    id="eduStartDate"
                                    type="date"
                                    {...registerEdu('startDate')}
                                />
                                {errorsEdu.startDate && (
                                    <p className="text-xs text-red-500">
                                        {errorsEdu.startDate.message}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="eduEndDate">End Date</Label>
                                <Input id="eduEndDate" type="date" {...registerEdu('endDate')} />
                                {errorsEdu.endDate && (
                                    <p className="text-xs text-red-500">
                                        {errorsEdu.endDate.message}
                                    </p>
                                )}
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsEduDialogOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {editingEdu ? 'Save Changes' : 'Add Education'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
