'use client';

import { AiPolishButton } from '@/components/ai/AiPolishButton';
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
import { motion } from 'framer-motion';
import {
    Briefcase,
    Calendar,
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
        watch: watchExp,
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

    // Helper to format date for display (Month Year)
    const formatDate = (dateString: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        // Handle YYYY-MM format which might be parsed as UTC
        if (dateString.length === 7) {
            const [year, month] = dateString.split('-');
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            return `${months[parseInt(month) - 1]} ${year}`;
        }
        return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    };

    // Experience Handlers
    const handleOpenExpDialog = (exp?: Experience) => {
        if (exp) {
            setEditingExp(exp);
            setValueExp('title', exp.title);
            setValueExp('company', exp.company);
            // Extract YYYY-MM for the input
            setValueExp('startDate', exp.startDate.substring(0, 7));
            setValueExp('endDate', exp.endDate ? exp.endDate.substring(0, 7) : '');
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
            // Extract YYYY-MM for the input
            setValueEdu('startDate', edu.startDate.substring(0, 7));
            setValueEdu('endDate', edu.endDate ? edu.endDate.substring(0, 7) : '');
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

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 },
    };

    return (
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
                    Experience & Education
                </h1>
                <p className="text-muted-foreground">
                    Showcase your professional journey and academic achievements.
                </p>
            </div>

            <Tabs defaultValue="experience" className="space-y-6">
                <TabsList className="grid w-full grid-cols-2 bg-muted/50 p-1">
                    <TabsTrigger
                        value="experience"
                        className="data-[state=active]:bg-white data-[state=active]:text-pink-600 data-[state=active]:shadow-sm"
                    >
                        <Briefcase className="mr-2 h-4 w-4" /> Work Experience
                    </TabsTrigger>
                    <TabsTrigger
                        value="education"
                        className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm"
                    >
                        <GraduationCap className="mr-2 h-4 w-4" /> Education
                    </TabsTrigger>
                </TabsList>

                {/* Experience Tab */}
                <TabsContent value="experience" className="space-y-4">
                    <div className="flex justify-end">
                        <Button
                            onClick={() => handleOpenExpDialog()}
                            className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 shadow-md"
                        >
                            <Plus className="mr-2 h-4 w-4" /> Add Experience
                        </Button>
                    </div>
                    <div className="grid gap-4">
                        {experiences.map((exp, index) => (
                            <motion.div key={exp._id} variants={item} layoutId={exp._id}>
                                <Card className="border-l-4 border-l-pink-500 shadow-sm hover:shadow-md transition-shadow group">
                                    <CardContent className="p-6 flex justify-between items-start">
                                        <div className="space-y-1">
                                            <h3 className="font-bold text-xl text-foreground group-hover:text-pink-600 transition-colors">
                                                {exp.title}
                                            </h3>
                                            <div className="flex items-center gap-2 text-primary font-medium">
                                                <Briefcase className="h-4 w-4" />
                                                {exp.company}
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Calendar className="h-3 w-3" />
                                                {formatDate(exp.startDate)} — {exp.endDate ? formatDate(exp.endDate) : 'Present'}
                                            </div>
                                            {exp.description && (
                                                <p className="text-sm text-foreground/80 mt-3 max-w-2xl leading-relaxed">
                                                    {exp.description}
                                                </p>
                                            )}
                                        </div>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => handleOpenExpDialog(exp)}>
                                                    <Pencil className="mr-2 h-4 w-4" /> Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="text-red-600 focus:text-red-600"
                                                    onClick={() => handleDeleteExp(exp._id)}
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                        {experiences.length === 0 && (
                            <div className="text-center py-16 border-2 border-dashed border-pink-200 bg-pink-50/50 rounded-xl">
                                <div className="h-12 w-12 bg-pink-100 text-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Briefcase className="h-6 w-6" />
                                </div>
                                <h3 className="font-semibold text-lg text-foreground">No experience yet</h3>
                                <p className="text-muted-foreground">Add your work history to impress recruiters.</p>
                            </div>
                        )}
                    </div>
                </TabsContent>

                {/* Education Tab */}
                <TabsContent value="education" className="space-y-4">
                    <div className="flex justify-end">
                        <Button
                            onClick={() => handleOpenEduDialog()}
                            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-md"
                        >
                            <Plus className="mr-2 h-4 w-4" /> Add Education
                        </Button>
                    </div>
                    <div className="grid gap-4">
                        {educations.map((edu, index) => (
                            <motion.div key={edu._id} variants={item} layoutId={edu._id}>
                                <Card className="border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-shadow group">
                                    <CardContent className="p-6 flex justify-between items-start">
                                        <div className="space-y-1">
                                            <h3 className="font-bold text-xl text-foreground group-hover:text-blue-600 transition-colors">
                                                {edu.institution}
                                            </h3>
                                            <div className="flex items-center gap-2 text-primary font-medium">
                                                <GraduationCap className="h-4 w-4" />
                                                {edu.degree}
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Calendar className="h-3 w-3" />
                                                {formatDate(edu.startDate)} — {edu.endDate ? formatDate(edu.endDate) : 'Present'}
                                            </div>
                                        </div>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => handleOpenEduDialog(edu)}>
                                                    <Pencil className="mr-2 h-4 w-4" /> Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="text-red-600 focus:text-red-600"
                                                    onClick={() => handleDeleteEdu(edu._id)}
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                        {educations.length === 0 && (
                            <div className="text-center py-16 border-2 border-dashed border-blue-200 bg-blue-50/50 rounded-xl">
                                <div className="h-12 w-12 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <GraduationCap className="h-6 w-6" />
                                </div>
                                <h3 className="font-semibold text-lg text-foreground">No education yet</h3>
                                <p className="text-muted-foreground">Add your academic background here.</p>
                            </div>
                        )}
                    </div>
                </TabsContent>
            </Tabs>

            {/* Experience Dialog */}
            <Dialog open={isExpDialogOpen} onOpenChange={setIsExpDialogOpen}>
                <DialogContent className="max-w-lg border-2 border-pink-100/20 bg-background/95 backdrop-blur-xl">
                    <DialogHeader>
                        <div className="mb-4 h-12 w-12 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center">
                            <Briefcase className="h-6 w-6" />
                        </div>
                        <DialogTitle className="text-xl">
                            {editingExp ? 'Edit Experience' : 'Add Experience'}
                        </DialogTitle>
                        <DialogDescription>
                            {editingExp ? 'Update your work history details.' : 'Share where you have worked.'}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmitExp(onSubmitExp)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Job Title</Label>
                                <Input
                                    id="title"
                                    placeholder="e.g. Senior Developer"
                                    className="bg-background/50 focus:border-pink-500 transition-colors"
                                    {...registerExp('title')}
                                />
                                {errorsExp.title && (
                                    <p className="text-xs text-red-500">{errorsExp.title.message}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="company">Company</Label>
                                <Input
                                    id="company"
                                    placeholder="e.g. Acme Corp"
                                    className="bg-background/50 focus:border-pink-500 transition-colors"
                                    {...registerExp('company')}
                                />
                                {errorsExp.company && (
                                    <p className="text-xs text-red-500">{errorsExp.company.message}</p>
                                )}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="startDate">Start Date</Label>
                                <Input
                                    id="startDate"
                                    type="month"
                                    className="bg-background/50 focus:border-pink-500 transition-colors"
                                    {...registerExp('startDate')}
                                />
                                {errorsExp.startDate && (
                                    <p className="text-xs text-red-500">{errorsExp.startDate.message}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="endDate">End Date</Label>
                                <Input
                                    id="endDate"
                                    type="month"
                                    className="bg-background/50 focus:border-pink-500 transition-colors"
                                    {...registerExp('endDate')}
                                />
                                {errorsExp.endDate && (
                                    <p className="text-xs text-red-500">{errorsExp.endDate.message}</p>
                                )}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <Label htmlFor="description">Description</Label>
                                <AiPolishButton
                                    initialText={watchExp('description') || ''}
                                    onPolished={text => setValueExp('description', text)}
                                />
                            </div>
                            <Textarea
                                id="description"
                                placeholder="Describe your key responsibilities and achievements..."
                                className="min-h-[100px] bg-background/50 focus:border-pink-500 transition-colors resize-none"
                                {...registerExp('description')}
                            />
                        </div>
                        <DialogFooter className="gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsExpDialogOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700"
                            >
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {editingExp ? 'Save Changes' : 'Add Experience'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Education Dialog */}
            <Dialog open={isEduDialogOpen} onOpenChange={setIsEduDialogOpen}>
                <DialogContent className="max-w-lg border-2 border-blue-100/20 bg-background/95 backdrop-blur-xl">
                    <DialogHeader>
                        <div className="mb-4 h-12 w-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                            <GraduationCap className="h-6 w-6" />
                        </div>
                        <DialogTitle className="text-xl">
                            {editingEdu ? 'Edit Education' : 'Add Education'}
                        </DialogTitle>
                        <DialogDescription>
                            {editingEdu
                                ? 'Update your academic history.'
                                : 'Add a new education entry.'}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmitEdu(onSubmitEdu)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="institution">Institution</Label>
                                <Input
                                    id="institution"
                                    placeholder="e.g. University of Tech"
                                    className="bg-background/50 focus:border-blue-500 transition-colors"
                                    {...registerEdu('institution')}
                                />
                                {errorsEdu.institution && (
                                    <p className="text-xs text-red-500">{errorsEdu.institution.message}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="degree">Degree</Label>
                                <Input
                                    id="degree"
                                    placeholder="e.g. B.S. Computer Science"
                                    className="bg-background/50 focus:border-blue-500 transition-colors"
                                    {...registerEdu('degree')}
                                />
                                {errorsEdu.degree && (
                                    <p className="text-xs text-red-500">{errorsEdu.degree.message}</p>
                                )}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="eduStartDate">Start Date</Label>
                                <Input
                                    id="eduStartDate"
                                    type="month"
                                    className="bg-background/50 focus:border-blue-500 transition-colors"
                                    {...registerEdu('startDate')}
                                />
                                {errorsEdu.startDate && (
                                    <p className="text-xs text-red-500">{errorsEdu.startDate.message}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="eduEndDate">End Date</Label>
                                <Input
                                    id="eduEndDate"
                                    type="month"
                                    className="bg-background/50 focus:border-blue-500 transition-colors"
                                    {...registerEdu('endDate')}
                                />
                                {errorsEdu.endDate && (
                                    <p className="text-xs text-red-500">{errorsEdu.endDate.message}</p>
                                )}
                            </div>
                        </div>
                        <DialogFooter className="gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsEduDialogOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                            >
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {editingEdu ? 'Save Changes' : 'Add Education'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </motion.div>
    );
}
