'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
    useGetSkillByIDQuery,
    useUpdateSkillMutation,
} from '@/redux/skills/skillApi';
import type { Skill } from '@/redux/skills/skillTypes';

export default function EditSkillPage() {
    const router = useRouter();
    const params = useParams();
    const skillId = params.id as string;

    const { data, isLoading, isError } = useGetSkillByIDQuery(skillId);
    const [
        updateSkill,
        { isLoading: isUpdating, isError: isUpdateError, error: updateError },
    ] = useUpdateSkillMutation();

    const [name, setName] = useState('');
    const [proficiency, setProficiency] = useState('');
    const [years, setYears] = useState<number>(0);
    const [iconName, setIconName] = useState('');
    const [iconURL, setIconURL] = useState('');
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [progress, setProgress] = useState<number>(0);

    useEffect(() => {
        if (data && data.data) {
            const skill = data.data as Skill;
            setName(skill.name);
            setProficiency(skill.proficiency || '');
            setYears(skill.years || 0);
            setIconName(skill.icon_name || '');
            setIconURL(skill.icon_url || '');
            // Assuming your backend returns a "category_names" field.
            setSelectedCategories(skill.category_names || []);
            setProgress(skill.progress);
        }
    }, [data]);

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selected = Array.from(
            e.target.selectedOptions,
            (option) => option.value,
        );
        setSelectedCategories(selected);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await updateSkill({
                id: skillId,
                name,
                proficiency,
                years,
                icon_name: iconName,
                icon_url: iconURL,
                category_names: selectedCategories,
                progress,
            }).unwrap();
            router.push('/admin/skills');
        } catch (err) {
            console.error('Update failed:', err);
        }
    };

    if (isLoading) return <div>Loading skill record...</div>;
    if (isError) return <div>Error loading skill record.</div>;

    return (
        <div className="max-w-xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Edit Skill</h1>
            <form
                onSubmit={handleSubmit}
                className="space-y-4 bg-white p-6 rounded shadow"
            >
                <div>
                    <Label htmlFor="skillName">Name</Label>
                    <Input
                        id="skillName"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g., Golang"
                        className="mt-1"
                        required
                    />
                </div>
                <div>
                    <Label htmlFor="proficiency">Proficiency</Label>
                    <Input
                        id="proficiency"
                        value={proficiency}
                        onChange={(e) => setProficiency(e.target.value)}
                        placeholder="e.g., Expert"
                        className="mt-1"
                    />
                </div>
                <div>
                    <Label htmlFor="years">Years</Label>
                    <Input
                        id="years"
                        type="number"
                        value={years}
                        onChange={(e) => setYears(Number(e.target.value))}
                        placeholder="e.g., 4"
                        className="mt-1"
                    />
                </div>
                <div>
                    <Label htmlFor="iconName">Icon Name</Label>
                    <Input
                        id="iconName"
                        value={iconName}
                        onChange={(e) => setIconName(e.target.value)}
                        placeholder="e.g., fa-brands fa-golang"
                        className="mt-1"
                    />
                </div>
                <div>
                    <Label htmlFor="iconURL">Icon URL</Label>
                    <Input
                        id="iconURL"
                        value={iconURL}
                        onChange={(e) => setIconURL(e.target.value)}
                        placeholder="https://..."
                        className="mt-1"
                    />
                </div>
                <div>
                    <Label htmlFor="categories">Select Categories</Label>
                    <select
                        id="categories"
                        multiple
                        value={selectedCategories}
                        onChange={handleCategoryChange}
                        className="mt-1 w-full border rounded p-2"
                    >
                        {[
                            'Programming',
                            'Backend',
                            'Database',
                            'Communication',
                        ].map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <Label htmlFor="progress">Progress (%)</Label>
                    <Input
                        id="progress"
                        type="number"
                        value={progress}
                        onChange={(e) => setProgress(Number(e.target.value))}
                        placeholder="0 - 100"
                        className="mt-1"
                    />
                </div>
                <Button
                    type="submit"
                    variant="default"
                    className="w-full"
                    disabled={isUpdating}
                >
                    {isUpdating ? 'Updating...' : 'Update Skill'}
                </Button>
                {isUpdateError && (
                    <p className="text-red-500">
                        Error:{' '}
                        {
                            (updateError as { data?: { message?: string } })
                                ?.data?.message
                        }
                    </p>
                )}
            </form>
        </div>
    );
}
