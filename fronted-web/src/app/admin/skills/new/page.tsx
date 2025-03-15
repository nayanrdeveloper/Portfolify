'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useCreateSkillMutation } from '@/redux/skills/skillApi';
import { useGetAllCategoriesQuery } from '@/redux/categories/categoryApi';
import CustomCombobox, { SelectableItem } from '@/components/ui/CustomCombobox';
import { mapToSelectableItems } from '@/lib/convert';

export default function NewSkillPage() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [proficiency, setProficiency] = useState('');
    const [years, setYears] = useState<number>(0);
    const [iconName, setIconName] = useState('');
    const [iconURL, setIconURL] = useState('');
    const [progress, setProgress] = useState<number>(0);
    const [selectedCategories, setSelectedCategories] = useState<
        SelectableItem[]
    >([]);

    const [createSkill, { isLoading, isError, error }] =
        useCreateSkillMutation();

    // Fetch all categories from RTK Query
    const {
        data: categoryData,
        isLoading: isCatLoading,
        isError: isCatError,
    } = useGetAllCategoriesQuery();

    // Map fetched categories to a simplified shape
    const categories: SelectableItem[] =
        categoryData && Array.isArray(categoryData.data)
            ? mapToSelectableItems(categoryData.data, 'id', 'name')
            : [];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createSkill({
                name,
                proficiency,
                years,
                icon_name: iconName,
                icon_url: iconURL,
                progress,
                // Send only category names, or adjust as needed
                category_names: selectedCategories.map((cat) => cat.name),
            }).unwrap();
            router.push('/admin/skills');
        } catch (err) {
            console.error('Failed to create skill:', err);
        }
    };

    return (
        <div className="max-w-xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Add New Skill</h1>
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
                <div>
                    <Label>Categories</Label>
                    {isCatLoading ? (
                        <div>Loading categories...</div>
                    ) : isCatError ? (
                        <div>Error loading categories</div>
                    ) : (
                        <CustomCombobox
                            items={categories}
                            multiple
                            selected={selectedCategories}
                            onChange={(selected) =>
                                setSelectedCategories(
                                    selected
                                        ? Array.isArray(selected)
                                            ? selected
                                            : [selected]
                                        : [],
                                )
                            }
                            placeholder="Select categories..."
                        />
                    )}
                </div>
                <Button
                    type="submit"
                    variant="default"
                    className="w-full"
                    disabled={isLoading}
                >
                    {isLoading ? 'Saving...' : 'Save Skill'}
                </Button>
                {isError && (
                    <p className="text-red-500">
                        Error:{' '}
                        {
                            (error as { data?: { message?: string } })?.data
                                ?.message
                        }
                    </p>
                )}
            </form>
        </div>
    );
}
